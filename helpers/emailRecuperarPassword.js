const nodemailer = require('nodemailer');

const emailRecuperarPassword = async (data) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_HOST_USER,
            pass: process.env.EMAIL_HOST_PASSWORD,
        },
    });

    const { email, nombre, token } = data;
    try {
        //! Enviar el gmail
        const info = await transporter.sendMail({
            /// recibe un objeto con el contenido del email
            from: 'Colch Star', //* Quien envía
            to: email, //* A quien se le envía
            subject: 'Restablece tu contraseña', //* Objetivo del email
            text: 'Restablece tu contraseña', //* Una versión sin html del objetivo
            html: `<p> 👋 Hola ${nombre}, Has solicitado restablecer tu contraseña en la aplicación de Colch Star</p>
            <p>Sigue el siguiente enlace para generar una nueva contraseña</p>
	         <a href="${process.env.FRONTEND_URL_WEB}/recuperar-password/:${token}"> Ir a Restablecer Contraseña <a>
             <p>Si tu no solicitases esta acción, puedes ignorar este mensaje</p>
	        `,
        });
        console.log('Mensaje enviado: %s', info.messageId);
    } catch (error) {
        console.log(error);
    }
};

module.exports = emailRecuperarPassword;
