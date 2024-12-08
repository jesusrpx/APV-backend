import Veterinario from "../models/veterinario.model.js";
import generarJWT from "../helpers/generarJWT.js";
import generarID from '../helpers/generarID.js';

export const registrar = async (req, res) => {
	// Extraer datos de la petición
	const { name, email, password } = req.body;

	// Verificar que exista el usuario
	let existe = await Veterinario.findOne({ email });

	if (existe) {
		return res.status(400).json({ error: true, msg: "Usuario existe" });
	}

	const veterinario = new Veterinario({ nombre: name, email, password });
	const newVeterinario = await veterinario.save();

	res.status(200).json({ veterinario: newVeterinario });
};

export const perfil = (req, res) => {
	// Extraemos los datos del usuario sesionado
	const { veterinario } = req;

	res.json({ data: veterinario });
};

export const confirmar = async (req, res) => {
	const { token } = req.params;

	const usuarioConfirmar = await Veterinario.findOne({ token });

	// Si no hay usuario
	if (!usuarioConfirmar) {
		return res
			.status(404)
			.json({ msg: "Usuario no encontrado", error: true });
	}

	try {
		// Cambiamos los valores del usuario
		usuarioConfirmar.token = null;
		usuarioConfirmar.confirmado = true;

		// Guardamos los datos
		await usuarioConfirmar.save();

		// Retornamos la respuesta
		return res
			.status(200)
			.json({ msg: "Usuario confirmado correctamente" });
	} catch (error) {
		return res.status(404).json({ msg: error.message, error: true });
	}
};

export const autenticar = async (req, res) => {
	const { email, password } = req.body;

	const usuario = await Veterinario.findOne({ email });

	// Confirmar si el usuario no
	if (!usuario) {
		return res
			.status(403)
			.json({ error: true, msg: "No existe el usuario" });
	}

	// Confirmar si el usuario ha sido confirmado
	if (!usuario.confirmado) {
		return res
			.status(403)
			.json({ error: true, msg: "Cuenta no confirmada" });
	}

	const userIsValid = await usuario.comprobarPassword(password);

	if (userIsValid) {
		return res
			.status(200)
			.json({
				msg: "Usuario logeado correctamente",
				token: generarJWT(usuario.id),
			});
	} else {
		return res
			.status(403)
			.json({ error: true, msg: "Contraseña incorrecta" });
	}
};

export const olvidePassword = async (req, res) => {

	const { email } = req.body;

	// Buscamos el veterinario
	const existeVeterinario = await Veterinario.findOne({email});

	// Si no existe el veterinario, retornamos un mensaje de error
	if (!existeVeterinario) {
		res.status(403).json({error: true, msg:"No existe el veterinario con ese correo"})
	}

	try {
		existeVeterinario.token = await generarID();
		await existeVeterinario.save()
		return res.json({msg: "Se envio un correo con las instrucciones para restablecer la contraseña"})
	} catch (error) {
		res.status(403).json({error: true, msg:"Error inesperado"})
	}

};

export const nuevoPassword = async (req, res) => {
	const { token } = req.params;

	const tokenValido = await Veterinario.findOne({token});

	if (!tokenValido) {
		res.status(403).json({error: true, msg:"El token no es valido"})
	} else {
		res.status(200).json({error: true, msg:"token valido"})
	}

};

export const comprobarToken = async (req, res) => {
	const { token } = req.params;
	const { password } = req.body;

	const veterinario = await Veterinario.findOne({email});

	if (!veterinario) {
		res.status(403).json({error: true, msg:"El token no es valido"})
	}

	try {
		veterinario.token = null;
		veterinario.password = password;
		await veterinario.save();
		res.status(200).json({error: true, msg:"Contraseña cambiada con exito"})
	} catch (error) {
		res.status(403).json({error: true, msg:"Error inesperado"})
	}
};
