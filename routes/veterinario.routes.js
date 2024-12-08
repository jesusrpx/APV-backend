import express from "express";
import {
	registrar,
	perfil,
	confirmar,
	autenticar,
	olvidePassword,
	comprobarToken,
	nuevoPassword,
} from "../controllers/veterinario.controllers.js";
import checkAuth from "../middleware/authMiddleware.js";
const router = express.Router();

// ------ Publicas -------
router.post("/", registrar);
router.get("/confirmar/:token", confirmar);
router.post("/autenticar", autenticar);
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:token", comprobarToken);
router.post("/olvide-password/:token", nuevoPassword);

// ------ Privadas -------
router.get("/perfil", checkAuth, perfil);

export default router;
