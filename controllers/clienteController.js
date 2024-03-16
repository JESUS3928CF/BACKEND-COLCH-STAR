const emailClienteRegistrado = require('../helpers/emailClienteRegistrado');
const { capitalizarPrimeraLetras } = require('../helpers/formatearDatos');
const { ClienteModels } = require('../models/ClienteModel');
const { MovimientosModels } = require('../models/MovimientosModels');

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
        console.log(req.usuario)


        const identificacionRepetido = await ClienteModels.findOne({
            where: {
                identificacion: identificacion,
                tipoIdentificacion: tipoIdentificacion
            }
        });

        if (identificacionRepetido) {
            return res.status(403).json({
                message: 'Ya exite esta Identificación',
                identificacionRepetido,
            });
        }
         


        //!  Insertar un nuevo cliente en la base de datos
        const nuevoCliente = await ClienteModels.create({
            nombre: capitalizarPrimeraLetras(nombre),
            apellido: capitalizarPrimeraLetras(apellido),
            telefono,
            email,
            direccion,
            identificacion,
            tipoIdentificacion,
        });

        const movimiento = await MovimientosModels.create({descripcion:`El usuario: ${req.usuario.nombre} registro un nuevo cliente`})
        

        /// Mensaje de respuesta
        res.json({
            message: 'Cliente agregado exitosamente', nuevoCliente,movimiento
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
        console.log(id, nombre);

        const cliente = await ClienteModels.findOne({
            where: { id_cliente: id },
        });

        
        if (identificacion !== cliente.identificacion || tipoIdentificacion !==cliente.tipoIdentificacion) {
            const identificacionRepetido = await ClienteModels.findOne({
                where: { identificacion: identificacion,
                tipoIdentificacion: tipoIdentificacion
            },
            });

            if (identificacionRepetido) {
                return res.status(403).json({
                    message: 'Ya Existe esta Identificación',
                    identificacionRepetido,
                });
            }
        }
    

        // Actualizar los valores del registro
        cliente.nombre = capitalizarPrimeraLetras(nombre),
        cliente.apellido = capitalizarPrimeraLetras(apellido),
        cliente.telefono = telefono;
        cliente.email = email;
        cliente.direccion = direccion
        cliente.identificacion = identificacion
        cliente.tipoIdentificacion = tipoIdentificacion
        cliente.save();

        const movimiento = await MovimientosModels.create({descripcion:`El usuario: ${req.usuario.nombre} actualizo el cliente # ${id}`})


        res.json({ message: 'Actualización exitosa', cliente,movimiento});
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

        await MovimientosModels.create({descripcion:`El usuario: ${req.usuario.nombre} cambio el estado del cliente # ${id}`})

        res.json({ message: 'Cambio de estado' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'no se cambio el estado' });
    }
}

module.exports = { consultar, agregar, actualizar, cambiarEstado };
