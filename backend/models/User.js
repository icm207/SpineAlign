// models/User.js
const mongoose = require('mongoose');

const evaluacionSchema = new mongoose.Schema({
  fecha: { type: Date, default: Date.now },
  anguloBiacromial: { type: Number },
  indiceAsimetria: { type: Number },
  observaciones: { type: String }
});

const userSchema = new mongoose.Schema({
  nombreCompleto: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  edad: { type: Number, required: true },
  sexo: { type: String, required: true },
  altura: { type: Number, required: true }, // en cm
  peso: { type: Number, required: true },    // en kg
  historialEvaluaciones: [evaluacionSchema]   // Aquí se guardarán las evaluaciones previas
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);