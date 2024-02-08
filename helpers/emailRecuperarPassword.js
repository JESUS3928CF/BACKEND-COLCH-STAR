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
            html: `
            <div style="background-color: #14131b; padding: 13px; border-radius: 4px; ">

            <div style="text-align: center;">
                <h1 style="color: white; font-size: 30px;">Colch Star</h1>
            </div>
        </div>
        
        <div style="background-color: white; padding: 20px; border-radius: 4px; margin-top: 20px; text-align: center;">

            <p style = "font-size: 17px;">👋 Hola  <strong>${nombre}</strong>, Has solicitado restablecer tu contraseña en la aplicación de <strong>Colch Star</strong></p>
            <p   style = "font-size: 15px;"> Sigue el siguiente enlace para generar una nueva contraseña</p>
            <a href="${process.env.FRONTEND_URL_WEB}/recuperar-password/:${token}" style="display: inline-block; background-color: #14131b;; color: white; text-decoration: none; padding: 10px 20px; border-radius: 5px;"> Restablecer Contraseña</a>
            <p style = "font-size: 15px;" >Si tú no solicitaste esta acción, puedes ignorar este mensaje.</p>

        </div>

	        `,
        });
        console.log('Mensaje enviado: %s', info.messageId);
    } catch (error) {
        console.log(error);
    }
};

module.exports = emailRecuperarPassword;
