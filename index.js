import express from "express";
import dotenv from "dotenv";

import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinario.routes.js";
import pacienteRoutes from "./routes/paciente.routes.js";

dotenv.config();

const app = express();
app.use(express.json());

conectarDB();

// ----- Routes -----
app.use("/api/veterinarios", veterinarioRoutes);
app.use("/api/pacientes", pacienteRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
	console.log(`Servidor funcionando en el puerto ${PORT}`);
});
