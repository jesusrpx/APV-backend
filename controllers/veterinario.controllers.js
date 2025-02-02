import Veterinario from '../models/veterinario.model.js';
import generarJWT from '../helpers/generarJWT.js';
import generarID from '../helpers/generarID.js';
import emailRegistro from '../helpers/emailRegistro.js';
import emailOlvidePassword from '../helpers/emailOlvidePassword.js';

export const registrar = async (req, res) => {
    // Extraer datos de la petición
    const { nombre, email, password } = req.body;

    // Verificar que exista el usuario
    let existe = await Veterinario.findOne({ email });

    if (existe) {
        const error = new Error('Usuario ya existe');
        return res.status(400).json({ msg: error.message });
    }

    try {
        // Datos de creacion del usuario
        const veterinario = new Veterinario({ nombre: nombre, email, password }); // Instancia del esquema del veterinario
        const newVeterinario = await veterinario.save(); // Guardar el veterinario en base de datos

        // Datos de envio del email del usuario para su posterior envio
        emailRegistro({
            nombre,
            email,
            token: newVeterinario.token,
        });

        // Retornar una respuesta de exito del nuevo veterinario
        res.status(200).json({ veterinario: newVeterinario });
    } catch (error) {
        const e = new Error('Ocurrio un error en el servidor');
        return res.status(400).json({ msg: e.message });
    }
};

export const perfil = (req, res) => {
    // Extraemos los datos del usuario sesionado
    const { veterinario } = req;

    res.json({ data: veterinario });
};

export const confirmar = async (req, res) => {
    const { token } = req.params;

    const usuarioConfirmar = await Veterinario.findOne({ token });

    console.log(usuarioConfirmar);

    // Si no hay usuario
    if (!usuarioConfirmar) {
        console.log('No se encontro el usuario');
        return res.status(404).json({ msg: 'Usuario no encontrado', error: true });
    }

    try {
        console.log('Dentro del try catch');
        // Cambiamos los valores del usuario
        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true;

        // Guardamos los datos
        await usuarioConfirmar.save();

        console.log('Se envio la respuesta');
        // Retornamos la respuesta
        return res.status(200).json({ msg: 'Usuario confirmado correctamente' });
    } catch (error) {
        return res.status(404).json({ msg: error.message, error: true });
    }
};

export const autenticar = async (req, res) => {
    const { email, password } = req.body;

    const usuario = await Veterinario.findOne({ email });

    // Confirmar si el usuario no
    if (!usuario) {
        return res.status(403).json({ error: true, msg: 'No existe el usuario' });
    }

    // Confirmar si el usuario ha sido confirmado
    if (!usuario.confirmado) {
        return res.status(403).json({ error: true, msg: 'Cuenta no confirmada' });
    }

    const userIsValid = await usuario.comprobarPassword(password);

    if (userIsValid) {
        return res.status(200).json({
            msg: 'Usuario logeado correctamente',
            token: generarJWT(usuario.id),
        });
    } else {
        return res.status(403).json({ error: true, msg: 'Contraseña incorrecta' });
    }
};

export const olvidePassword = async (req, res) => {
    const { email } = req.body;

    // Buscamos el veterinario
    const existeVeterinario = await Veterinario.findOne({ email });

    // Si no existe el veterinario, retornamos un mensaje de error
    if (!existeVeterinario) {
        res.status(403).json({ error: true, msg: 'No existe el veterinario con ese correo' });
    }

    try {
        existeVeterinario.token = await generarID();
        await existeVeterinario.save();

        // Enviamos los datos del email al usuario para generar
        emailOlvidePassword({
            email,
            nombre: existeVeterinario.nombre,
            token: existeVeterinario.token,
        });

        return res.json({ msg: 'Se envio un correo con las instrucciones para restablecer la contraseña' });
    } catch (error) {
        res.status(403).json({ error: true, msg: 'Error inesperado' });
    }
};

export const comprobarToken = async (req, res) => {
    // Obtenemos el token de los params
    const { token } = req.params;

    // Buscamos el veterinario con ese token
    const tokenValido = await Veterinario.findOne({ token });

    // Si no hay un usuario, retornamos
    if (!tokenValido) {
        res.status(403).json({ error: true, msg: 'El token no es valido' });
    } else {
        res.status(200).json({ error: true, msg: 'token valido' });
    }
};

export const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    // Buscar al usuario
    const veterinario = await Veterinario.findOne({ token });

    // Si no hay veterinario
    if (!veterinario) {
        res.status(403).json({ error: true, msg: 'El token no es valido' });
    }

    try {
        // Cambiamos el token del usuario a nulo
        veterinario.token = null;
        // Asignamos nueva contraseña
        veterinario.password = password;
        // Guardamos el veterinari
        await veterinario.save();
        res.status(200).json({ error: true, msg: 'Contraseña cambiada con exito' });
    } catch (error) {
        res.status(403).json({ error: true, msg: 'Error inesperado' });
    }
};
