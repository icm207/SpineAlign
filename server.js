const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json()); // Permite recibir datos en formato JSON
app.use(cors());         // Permite la conexión con el frontend

// ==========================================
// 1. ESQUEMA Y MODELO DE USUARIO
// ==========================================
const evaluacionSchema = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },
    anguloBiacromial: { type: Number },
    indiceAsimetria: { type: Number }
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
        const usuarioExistente = await Usuario.findOne({ correo });
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
            correo, 
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
// 4. INICIAR EL SERVIDOR
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});