import jwt from "jsonwebtoken";
import Veterinario from "../models/veterinario.model.js";

// Verificación del usuario logeado
const checkAuth = async (req, res, next) => {
	// Obtención del token del usuario desde las cabeceras
	//const { authorization } = req.headers;

	// Verirización del token del usuario
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		//next();
		try {
			// Extranción del token
			const token = req.headers.authorization.split(" ");

			// Verificamos el token
			const decoded = jwt.verify(token[1], process.env.JWT_SECRET);

			// Asignamos al veterinario su usuario
			req.veterinario = await Veterinario.findById(decoded.id).select(
				"-password -token -confirmado",
			);

			return next();
		} catch (error) {
			console.log(error.message)
			return res
				.status(401)
				.json({ error: true, msg: "Token no válido" });
		}
	}

	return res.status(403).json({ error: true, msg: "No se pudo autenticar" });
};


export default checkAuth;