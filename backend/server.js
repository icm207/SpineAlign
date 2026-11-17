require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Middlewares
app.use(express.json({ limit: '10mb' })); // Permite recibir imágenes en Base64 de mayor tamaño
app.use(cors());                          // Habilita la comunicación con el frontend

/* 1. ESQUEMA Y MODELO DE USUARIO */
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
    peso: { type: Number, required: true },     // Peso en kg
    idPaciente: { type: String, default: 'PX-2026-01' }, // ID clínico personalizado
    password: { type: String, required: true },
    historialEvaluaciones: [evaluacionSchema]   // Registro de evaluaciones previas
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

/* 2. CONEXIÓN A MONGODB ATLAS */
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado exitosamente a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

/* Ruta de prueba inicial */
app.get('/', (req, res) => {
    res.send('¡El servidor de SpineAlign está funcionando correctamente!');
});

/* 3. RUTA DE REGISTRO (POST /api/registro) */
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

/* 4. RUTA DE LOGIN (POST /api/login) */
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

/* 5. RUTA PARA GUARDAR EVALUACIÓN (POST /api/evaluacion) */
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

/* 6. RUTA PARA OBTENER EL HISTORIAL (GET /api/historial/:correo) */
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

/* 7. RUTA PARA OBTENER DATOS DE USUARIO (GET /api/usuario/:correo) */
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

/* 8. RUTA PARA ACTUALIZAR EL PERFIL (PUT /api/usuario/:correo) */
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

/* 9. RUTA DEL CHAT CONVERSACIONAL SPINY (POST /api/chat-spiny) */
app.post('/api/chat-spiny', async (req, res) => {
    try {
        const { mensaje, historial } = req.body;
        const textoUsuario = (mensaje || "").toLowerCase().trim();

        // Banco de respuestas directas y específicas según lo que pregunte el usuario
        const bancoDirecto = {
            saludo: "¡Hola! Bienvenido a SpineAlign. ¿En qué te gustaría que te ayudemos hoy con tu evaluación postural?",
            
            c7: "La vértebra C7 (o vértebra prominente) es la séptima vértebra cervical y se caracteriza por tener una apófisis espinosa muy perceptible en la base del cuello. En SpineAlign, C7 es el punto de referencia anatómico superior fundamental para alinear la postura y calcular las desviaciones de los hombros en relación con la vertical.",
            
            manubrio: "El manubrio esternal es la porción superior y más ancha del esternón, situada en la parte anterior del tórax. Sirve como punto de anclaje para las clavículas y los primeros cartílagos costales, y en evaluaciones biomecánicas ayuda a estimar la simetría del tronco y la posición frontal del tórax.",
            
            acromion: "El acromion es la apófisis ósea que se encuentra en el extremo lateral de la espina de la escápula (omóplato). Es el punto clave utilizado en SpineAlign para marcar el borde externo de los hombros, permitiendo medir con precisión el ángulo biacromial y detectar desniveles escapulares.",
            
            indiceBiacromial: "El ángulo o índice biacromial evalúa la alineación horizontal de los hombros tomando como referencia los puntos acromiales izquierdo y derecho frente a la vertical de la columna (marcada por C7). Un valor equilibrado indica simetría en la cintura escapular, mientras que alteraciones señalan posibles desequilibrios musculares.",
            
            indiceAsimetria: "El Índice de Asimetría Postural (ASI) mide el grado de desnivel o diferencia de altura entre el hombro izquierdo y el derecho. Un ASI cercano a cero refleja una simetría ideal, mientras que un porcentaje elevado indica que un hombro está más elevado o adelantado, frecuentemente debido a malas posturas o tensiones en el trapecio.",
            
            ejerciciosPostura: "Para mejorar la postura y equilibrar los hombros, se recomiendan estiramientos de pectoral para abrir el pecho, ejercicios de fortalecimiento para los romboides y trapecio medio (como remos controlados), y rutinas de movilidad torácica. Si tienes una asimetría marcada, los ejercicios unilaterales enfocados en el lado más débil son de gran ayuda.",
            
            resultadosGenerales: "Para interpretar tus resultados en SpineAlign, verifica que tus valores de ángulo biacromial y ASI se mantengan estables. Si hay alguna asimetría moderada, asegúrate de corregir tu ergonomía al sentarte (pantalla a la altura de los ojos y soporte lumbar) y repite la evaluación en un par de semanas para medir tu progreso."
        };

        let respuestaTexto = null;

        // Detección directa y estricta de la intención del usuario
        if (textoUsuario.match(/^(hola|buenos días|buenas tardes|buenas|que tal|hey)/)) {
            respuestaTexto = bancoDirecto.saludo;
        } else if (textoUsuario.includes('c7') || textoUsuario.includes('vértebra c7') || textoUsuario.includes('vertebra c7')) {
            respuestaTexto = bancoDirecto.c7;
        } else if (textoUsuario.includes('manubrio')) {
            respuestaTexto = bancoDirecto.manubrio;
        } else if (textoUsuario.includes('acromion')) {
            respuestaTexto = bancoDirecto.acromion;
        } else if (textoUsuario.includes('asi') || textoUsuario.includes('asimetría') || textoUsuario.includes('asimetria')) {
            respuestaTexto = bancoDirecto.indiceAsimetria;
        } else if (textoUsuario.includes('biacromial')) {
            respuestaTexto = bancoDirecto.indiceBiacromial;
        } else if (textoUsuario.includes('ejercicio') || textoUsuario.includes('rutina') || textoUsuario.includes('recomiendas')) {
            respuestaTexto = bancoDirecto.ejerciciosPostura;
        } else if (textoUsuario.includes('resultado') || textoUsuario.includes('mis datos') || textoUsuario.includes('evaluacion')) {
            respuestaTexto = bancoDirecto.resultadosGenerales;
        } else {
            // Si pregunta otra cosa, intentamos con la API de Gemini (con límite de 6 segundos)
            const instruccionSistema = `
                Eres Spiny, el asistente virtual de SpineAlign. 
                Responde de forma directa, concisa y estrictamente relacionada a lo que el usuario pregunte. 
                Si te saludan, saluda cordialmente. Si preguntan por anatomía (C7, acromion, manubrio), explícalo directamente. 
                Nunca des diagnósticos médicos definitivos.
            `;

            const modelosPosibles = ['gemini-3.8-flash', 'gemini-3.8-flash-lite', 'gemini-2.5-flash'];

            for (const modelo of modelosPosibles) {
                try {
                    const promesaGemini = (async () => {
                        const chat = ai.chats.create({
                            model: modelo,
                            config: { systemInstruction: instruccionSistema },
                            history: historial || []
                        });
                        const response = await chat.sendMessage({ message: mensaje });
                        return response ? response.text : null;
                    })();

                    const timeout = new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout Gemini')), 6000)
                    );

                    respuestaTexto = await Promise.race([promesaGemini, timeout]);
                    if (respuestaTexto) break;
                } catch (error) {
                    console.warn(`Modelo ${modelo} ocupado, probando siguiente...`);
                }
            }
        }

        // Si la API no respondió a tiempo, damos una respuesta neutral orientada al tema
        if (!respuestaTexto) {
            respuestaTexto = "Entiendo tu consulta sobre biomecánica en SpineAlign. Para darte una respuesta más precisa, ¿te refieres a una estructura específica como la vértebra C7, el acromion o prefieres que revisemos tus métricas de asimetría?";
        }

        return res.json({ respuesta: respuestaTexto });

    } catch (error) {
        console.error('Error general en Spiny:', error);
        res.json({ respuesta: "Hola, soy Spiny. ¿En qué te puedo colaborar con tu evaluación postural en SpineAlign?" });
    }
});
/* 10. INICIAR EL SERVIDOR */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});