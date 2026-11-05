const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json({ limit: '10mb' })); // Permite recibir imágenes en Base64 de mayor tamaño
app.use(cors());                          // Habilita la comunicación con el frontend

// ==========================================
// 1. ESQUEMA Y MODELO DE USUARIO
// ==========================================
const evaluacionSchema = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },
    anguloBiacromial: { type: Number },
    indiceAsimetria: { type: Number },
    imagenUrl: { type: String } // Guarda la captura del visor postural con puntos (Base64)
});

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    edad: { type: Number, required: true },
    correo: { type: String, required: true, unique: true },
    sexo: { type: String, required: true },
    altura: { type: Number, required: true }, // Altura en cm
    peso: { type: Number, required: true },    // Peso en kg
    idPaciente: { type: String, default: 'PX-2026-01' }, // ID clínico personalizado
    password: { type: String, required: true },
    historialEvaluaciones: [evaluacionSchema]   // Registro de evaluaciones previas
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// ==========================================
// 2. CONEXIÓN A MONGODB ATLAS
// ==========================================
mongoose.connect('mongodb+srv://hostinjmr2_db_user:MAGayy9nGy66eff7@cluster0.mbunrpc.mongodb.net/spinealign?retryWrites=true&w=majority')
    .then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Ruta de prueba inicial
app.get('/', (req, res) => {
    res.send('¡El servidor de SpineAlign está funcionando correctamente!');
});

// ==========================================
// 3. RUTA DE REGISTRO (POST /api/registro)
// ==========================================
app.post('/api/registro', async (req, res) => {
    try {
        const { nombre, edad, correo, sexo, altura, peso, password } = req.body;

        const usuarioExistente = await Usuario.findOne({ correo: correo.trim().toLowerCase() });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        const nuevoUsuario = new Usuario({
            nombre,
            edad,
            correo: correo.trim().toLowerCase(),
            sexo,
            altura,
            peso,
            idPaciente: 'PX-2026-01',
            password: passwordEncriptada,
            historialEvaluaciones: []
        });

        await nuevoUsuario.save();

        res.status(201).json({ mensaje: '¡Usuario registrado con éxito en MongoDB!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar el usuario en el servidor.' });
    }
});

// ==========================================
// 4. RUTA DE LOGIN (POST /api/login)
// ==========================================
app.post('/api/login', async (req, res) => {
    try {
        const { correo, password } = req.body;

        const usuario = await Usuario.findOne({ correo: correo.trim().toLowerCase() });
        if (!usuario) {
            return res.status(400).json({ error: 'Correo o contraseña incorrectos.' });
        }

        const passwordMatch = await bcrypt.compare(password, usuario.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Correo o contraseña incorrectos.' });
        }

        res.json({ 
            mensaje: 'Login exitoso', 
            token: 'jwt-token-valido-spinealign-2026',
            correo: usuario.correo,
            nombre: usuario.nombre 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor al iniciar sesión.' });
    }
});

// ==========================================
// 5. RUTA PARA GUARDAR EVALUACIÓN (POST /api/evaluacion)
// ==========================================
app.post('/api/evaluacion', async (req, res) => {
    try {
        const { correo, anguloBiacromial, indiceAsimetria, imagenUrl } = req.body;

        if (!correo) {
            return res.status(400).json({ error: 'Correo no proporcionado.' });
        }

        const usuario = await Usuario.findOne({ correo: { $regex: new RegExp(`^${correo.trim()}$`, 'i') } });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado en la base de datos.' });
        }

        usuario.historialEvaluaciones.push({
            anguloBiacromial,
            indiceAsimetria,
            imagenUrl
        });

        await usuario.save();
        res.status(201).json({ mensaje: '¡Evaluación y fotografía guardadas en el historial con éxito!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al guardar la evaluación.' });
    }
});

// ==========================================
// 6. RUTA PARA OBTENER EL HISTORIAL (GET /api/historial/:correo)
// ==========================================
app.get('/api/historial/:correo', async (req, res) => {
    try {
        const { correo } = req.params;
        const correoLimpio = correo.trim();

        const usuario = await Usuario.findOne({ correo: { $regex: new RegExp(`^${correoLimpio}$`, 'i') } });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const historialConDatos = usuario.historialEvaluaciones.map(item => ({
            _id: item._id,
            fecha: item.fecha,
            anguloBiacromial: item.anguloBiacromial,
            indiceAsimetria: item.indiceAsimetria,
            imagenUrl: item.imagenUrl,
            nombre: usuario.nombre || "Paciente General",
            edad: usuario.edad || "--",
            sexo: usuario.sexo || "--",
            estatura: usuario.altura ? `${usuario.altura} cm` : "--",
            peso: usuario.peso ? `${usuario.peso} kg` : "--",
            idPaciente: usuario.idPaciente || "PX-2026-01"
        }));

        res.json(historialConDatos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el historial.' });
    }
});

// ==========================================
// 7. RUTA PARA OBTENER DATOS DE USUARIO (GET /api/usuario/:correo)
// ==========================================
app.get('/api/usuario/:correo', async (req, res) => {
    try {
        const { correo } = req.params;
        const usuario = await Usuario.findOne({ correo: { $regex: new RegExp(`^${correo.trim()}$`, 'i') } });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.json({
            nombre: usuario.nombre,
            edad: usuario.edad,
            correo: usuario.correo,
            sexo: usuario.sexo,
            altura: usuario.altura,
            peso: usuario.peso,
            idPaciente: usuario.idPaciente || 'PX-2026-01'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el usuario.' });
    }
});

// ==========================================
// 8. RUTA PARA ACTUALIZAR EL PERFIL (PUT /api/usuario/:correo)
// ==========================================
app.put('/api/usuario/:correo', async (req, res) => {
    try {
        const { correo } = req.params;
        const { nombre, edad, sexo, altura, peso, idPaciente } = req.body;

        const usuarioActualizado = await Usuario.findOneAndUpdate(
            { correo: { $regex: new RegExp(`^${correo.trim()}$`, 'i') } },
            { nombre, edad, sexo, altura, peso, idPaciente },
            { new: true }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.json({ mensaje: '¡Perfil actualizado con éxito!', usuario: usuarioActualizado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el usuario.' });
    }
});

// ==========================================
// 9. INICIAR EL SERVIDOR
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});