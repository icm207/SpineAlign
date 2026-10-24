const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middlewares
app.use(express.json()); // Permite recibir datos en formato JSON
app.use(cors());         // Permite la conexión con el frontend

// 1. Ruta de prueba para saber que el servidor funciona
app.get('/', (req, res) => {
    res.send('¡El servidor de SpineAlign está funcionando correctamente!');
});

// 2. Conexión a MongoDB (aquí iría tu enlace a MongoDB Atlas o local)
// mongoose.connect('mongodb://localhost:27017/spinealign', { ... })

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    edad: { type: Number, required: true },
    correo: { type: String, required: true, unique: true },
    sexo: { type: String, required: true },
    password: { type: String, required: true } // Nota: idealmente va encriptado con bcrypt
});

module.exports = mongoose.model('Usuario', usuarioSchema);
const Usuario = require('./models/Usuario'); // Importas tu modelo

// Ruta para Registrar un usuario (POST)
app.post('/api/registro', async (req, res) => {
    try {
        const { nombre, edad, correo, sexo, password } = req.body;
        
        // Crear y guardar en MongoDB
        const nuevoUsuario = new Usuario({ nombre, edad, correo, sexo, password });
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: '¡Usuario registrado con éxito en MongoDB!' });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario (correo ya existente).' });
    }
});