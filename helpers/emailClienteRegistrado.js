const nodemailer = require('nodemailer');

const emailClienteRegistrado = async (data) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_HOST_USER,
            pass: process.env.EMAIL_HOST_PASSWORD,
        },
    });

    const { email, nombre} = data;
    try {
         //! Enviar el gmail
        const info = await transporter.sendMail({
	        /// recibe un objeto con el contenido del email
	        from: 'Colch Star', //* Quien envía
	        to: email, //* A quien se le envía
	        subject: 'Has sido registrado en la aplicación Colch Star ', //* Objetivo del email
	        text: 'Has sido registrado en la aplicación Colch Star', //* Una versión sin html del objetivo
	        html: `<p> 👋 Hola ${nombre}, Has sido registrado en la aplicación Colch Star</p>
	         <p>Recibirás mensajes 📩 de tu pedidos a este correo  <p>
	        `,
	    });
	    console.log("Mensaje enviado: %s", info.messageId);
    } catch (error) {
        console.log(error);
    }
   
}

module.exports = emailClienteRegistrado;
