const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json({ limit: '10mb' })); // Aumentamos el límite de tamaño para permitir imágenes en Base64
app.use(cors());                          // Permite la conexión con el frontend

// ==========================================
// 1. ESQUEMA Y MODELO DE USUARIO
// ==========================================
const evaluacionSchema = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },
    anguloBiacromial: { type: Number },
    indiceAsimetria: { type: Number },
    imagenUrl: { type: String } // <-- Campo añadido para guardar la foto de la espalda (Base64)
});

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    edad: { type: Number, required: true },
    correo: { type: String, required: true, unique: true },
    sexo: { type: String, required: true },
    altura: { type: Number, required: true }, // Altura en cm
    peso: { type: Number, required: true },    // Peso en kg
    password: { type: String, required: true },
    historialEvaluaciones: [evaluacionSchema]   // Arreglo para guardar las evaluaciones previas
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// ==========================================
// 2. CONEXIÓN ÚNICA A MONGODB ATLAS
// ==========================================
mongoose.connect('mongodb+srv://hostinjmr2_db_user:MAGayy9nGy66eff7@cluster0.mbunrpc.mongodb.net/spinealign?retryWrites=true&w=majority')
    .then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡El servidor de SpineAlign está funcionando correctamente!');
});

// ==========================================
// 3. RUTA DE REGISTRO (POST /api/registro)
// ==========================================
app.post('/api/registro', async (req, res) => {
    try {
        const { nombre, edad, correo, sexo, altura, peso, password } = req.body;

        // Verificar si el usuario ya existe con ese correo
        const usuarioExistente = await Usuario.findOne({ correo: correo.trim().toLowerCase() });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
        }

        // Encriptar la contraseña por seguridad
        const salt = await bcrypt.genSalt(10);
        const passwordEncriptada = await bcrypt.hash(password, salt);

        // Crear y guardar el nuevo usuario en MongoDB
        const nuevoUsuario = new Usuario({
            nombre,
            edad,
            correo: correo.trim().toLowerCase(),
            sexo,
            altura,
            peso,
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
// 3.1. RUTA DE LOGIN REAL (POST /api/login)
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
// RUTA PARA GUARDAR UNA EVALUACIÓN EN EL HISTORIAL
// ==========================================
app.post('/api/evaluacion', async (req, res) => {
    try {
        const { correo, anguloBiacromial, indiceAsimetria, imagenUrl } = req.body;

        if (!correo) {
            return res.status(400).json({ error: 'Correo no proporcionado.' });
        }

        // Buscamos el usuario ignorando mayúsculas/minúsculas y espacios
        const usuario = await Usuario.findOne({ correo: { $regex: new RegExp(`^${correo.trim()}$`, 'i') } });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado en la base de datos.' });
        }

        // Agregar la nueva evaluación al arreglo incluyendo la fotografía
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
// RUTA PARA OBTENER EL HISTORIAL DE UN USUARIO
// ==========================================
app.get('/api/historial/:correo', async (req, res) => {
    try {
        const { correo } = req.params;
        const usuario = await Usuario.findOne({ correo: { $regex: new RegExp(`^${correo.trim()}$`, 'i') } });

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.json(usuario.historialEvaluaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el historial.' });
    }
});

// ==========================================
// 4. INICIAR EL SERVIDOR
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});