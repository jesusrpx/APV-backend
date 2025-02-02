import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import conectarDB from './config/db.js';
import veterinarioRoutes from './routes/veterinario.routes.js';
import pacienteRoutes from './routes/paciente.routes.js';

// Acceder a la configuracion de Dotenv
dotenv.config();

const dominiosPermitidos = [process.env.FRONTEND_URL];

// Opciones para los cors
const corsOptions = {
    // Objeto con la clave origin que servira para configurar el servicio
    origin: function (origin, callback) {
        if (dominiosPermitidos.indexOf(origin) !== 1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por CORS'));
        }
    },
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));

// Conectar a la base de datos
conectarDB();

// ----- Routes -----
app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

// Puerto 
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});
