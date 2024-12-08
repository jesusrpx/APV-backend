import Paciente from "../models/paciente.model.js";
import generarJWT from "../helpers/generarJWT.js";
import generarID from "../helpers/generarID.js";

export const agregarPaciente = async (req, res) => {
	const paciente = new Paciente(req.body);
	console.log(req.veterinario.id);
	try {
		// Asignamos el id del veterinario al paciente
		paciente.veterinario = req.veterinario.id;

		const pacienteAlmacenado = await paciente.save();

		return res.status(200).json(pacienteAlmacenado);
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ msg: "Hubo un error al crear el paciente" });
	}
};

export const obtenerPacientes = async (req, res) => {
	const pacientes = await Paciente.find()
		.where("veterinario")
		.equals(req.veterinario);
	return res.status(200).json(pacientes);
};

export const obtenerPaciente = async (req, res) => {
	const { id } = req.params.id;

	const paciente = await Paciente.findById(id);

	if (!paciente) {
		return res.status(200).json({ msg: "No hay paciente" });
	}

	// Para evitar problemas en la camparacion de ID es preferible usar toString en los id
	if (paciente.veterinario._id.toString() != req.veterinario._id.toString()) {
		return res.status(400).json({ msg: "No se encontro el usuario" });
	}

	return res.status(200).json({ paciente });
};

export const actualizarPaciente = async (req, res) => {
	const { id } = req.params.id;

	const paciente = await Paciente.findById(id);

	// Si no hay paciente retornar un pensaje
	if (!paciente) {
		return res.status(200).json({ msg: "No hay paciente", error: true });
	}

	// Para evitar problemas en la camparacion de ID es preferible usar toString en los id
	if (paciente.veterinario._id.toString() != req.veterinario._id.toString()) {
		return res.status(400).json({ msg: "No se encontro el usuario" });
	}

	try {
		// ----- Actualización de datos -----
		paciente.nombre = req.body.nombre || paciente.nombre;
		paciente.fecha = req.body.fecha || paciente.fecha;
		paciente.sintomas = req.body.sintomas || paciente.sintomas;
		pacienteActualizado = await paciente.save();

		return res.status(200).json({
			msg: "Paciente actualizado con exito",
			paciente: pacienteActualizado,
		});

	} catch (error) {
		console.log(error);
		return res.status(400).json({
			msg: "Ha ocurrido un error durante la actualización",
		});
	}
};

export const eliminarPaciente = async (req, res) => {
	const { id } = req.params.id;

	const paciente = await Paciente.findById(id);

	// Si no hay paciente retornar un pensaje
	if (!paciente) {
		return res.status(200).json({ msg: "No hay paciente", error: true });
	}

	// Para evitar problemas en la camparacion de ID es preferible usar toString en los id
	if (paciente.veterinario._id.toString() != req.veterinario._id.toString()) {
		return res.status(400).json({ msg: "No se encontro el usuario" });
	}

	try {
		await paciente.deleteOne();
		return res.status(200).json({ msg: "Paciente eliminado con exito" });
	} catch (error) {
		console.log(error);
		return res.status(400).json({
			msg: "Ha ocurrido un error durante la actualización",
		});
	}
};
