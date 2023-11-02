const emailClienteRegistrado = require('../helpers/emailClienteRegistrado');
const { ClienteModels } = require('../models/ClienteModel');

const consultar = async (req, res) => {
    try {

        /// Consultando todos los registros
        const clientes = await ClienteModels.findAll();

        //- Forma de inviar un JSON
        res.status(200).json(clientes);


    } catch (error) {
        console.log('Error al consultar la tabla cliente:', error);
        res.status(500).json({ error: 'Error al consultar la tabla cliente' });
    }
};

//! Agregar un cliente

const agregar = async (req, res) => {

    try {
        const { nombre, apellido, telefono, email, direccion, identificacion, tipoIdentificacion} = req.body;


        const identificacionRepetido = await ClienteModels.findOne({
            where: {
                identificacion: identificacion,
                tipoIdentificacion: tipoIdentificacion
            }
        });

        if (identificacionRepetido) {
            return res.status(400).json({
                message: 'Ya exite esta identidicación',
                identificacionRepetido,
            });
        }
         


        //!  Insertar un nuevo cliente en la base de datos
        await ClienteModels.create({
            nombre,
            apellido,
            telefono,
            email,
            direccion,
            identificacion,
            tipoIdentificacion,
        });

        /// Mensaje de respuesta
        res.json({
            message: 'Cliente agregado exitosamente',
        });

         emailClienteRegistrado({ email, nombre });


       
    } catch (error) {
        // Envía una respuesta al cliente indicando el error
        res.status(500).json({ message: 'Error al agregar el cliente' });
    }
}

//! Actualizar un cliente

const actualizar = async (req, res) => {
    try {

        const { nombre, apellido, telefono, email, direccion, identificacion, tipoIdentificacion } = req.body;

        const id = req.params.id;
        console.log(id);

        const cliente = await ClienteModels.findOne({
            where: { id_cliente: id },
        });

        
        if (identificacion !== cliente.identificacion) {
            const identificacionRepetido = await ClienteModels.findOne({
                where: { identificacion: identificacion,
                tipoIdentificacion: tipoIdentificacion
            },
            });

            if (identificacionRepetido) {
                return res.status(400).json({
                    message: 'Ya Existe esta Identificación',
                    identificacionRepetido,
                });
            }
        }
    

        // Actualizar los valores del registro
        cliente.nombre = nombre;
        cliente.apellido = apellido;
        cliente.telefono = telefono;
        cliente.email = email;
        cliente.direccion = direccion
        cliente.identificacion = identificacion
        cliente.tipoIdentificacion = tipoIdentificacion
        cliente.save();

        res.json({ message: 'Actualización exitosa' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el cliente' });
    }
}

//! Actualizar un cliente

const cambiarEstado = async (req, res) => {
    try {

        console.log("Se hizo una estado");
        const { estado } = req.body;

        console.log('actualizar esto');
        const id = req.params.id;
        console.log(id);

        const cliente = await ClienteModels.findOne({
            where: { id_cliente: id },
        });
        // Actualizar los valores del registro
        cliente.estado = !estado;

        cliente.save();

        res.json({ message: 'Cambio de estado' });
    } catch (error) {
        res.status(500).json({ message: 'no se cambio el estado' });
    }
}

module.exports = { consultar, agregar, actualizar, cambiarEstado };
