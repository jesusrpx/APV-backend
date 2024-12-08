import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import generarID from '../helpers/generarID.js';

// Mongo db le asigna automaticamente los id
const veterinarioSchema = mongoose.Schema({
	nombre: {
		type: String,
		required: true,
		trim: true,
	},
	password: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	phone: {
		type: String,
		default: null,
		trim: true,
	},
	web: {
		type: String,
		default: null,
	},
	token: {
		type: String,
		default: generarID(),
	},
	confirmado: {
		type: Boolean,
		default: false
	}
})

veterinarioSchema.pre('save', async function(next) {
	// Esto es meramente para evitar que se vuelva a hashear
	if (!this.isModified('password')) {
		next()
	}
	// Generamos el salt
	const salt = await bcrypt.genSalt(10);
	// Cambiamos la contraseña
	this.password = await bcrypt.hash(this.password, salt);
})

veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
	return await bcrypt.compare(passwordFormulario, this.password)
}

const Veterinario = mongoose.model("Veterinario", veterinarioSchema);

export default Veterinario 