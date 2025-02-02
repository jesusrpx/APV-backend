import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    // Esto crea una instancia de nodemailer
    const transporter = nodemailer.createTransport({
        host: process.env.HOST_MAILER,
        port: process.env.MAILER_PORT,
        auth: {
            user: process.env.MAILER_AUTH,
            pass: process.env.MAILER_PW,
        },
    });

    const { nombre, email, token } = datos;

    // TODO: Cambiar las varibles del entorno para el envio del token
    const info = await transporter.sendMail({
        from: 'APV - Administrador de pacientes de veterinaria',
        to: email,
        subject: 'Verificar tu cuenta',
        html: `
            <h1>Hola ${nombre}, es un gusto tenerte a bordo</h1>
            <p>Comprueba tu cuenta usando el siguiente enlace</p>
            <a href="http://localhost:5173/confirmar/${token}">Comprueba tu cuenta aquí</a>
            
            <p>Si no solicitaste esto por favor ignoralo</p>
            `,
    });

    console.log('Mensaje enviado: %s', info.messageId);
};

export default emailRegistro;
