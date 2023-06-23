const  { ClienteModels} = require('../models/ClienteModel');

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


const agregar = async (req,res) => {

     try {
         const { nombre, apellido, telefono, email, direccion } = req.body;


        //!  Insertar un nuevo cliente en la base de datos
         const nuevoCliente = await ClienteModels.create({
             nombre,
             apellido,
             telefono,
             email,
             direccion,
         });

         /// Mensaje de respuesta
         res.json({
             message: 'Cliente agregado exitosamente',
         });

     } catch (error) {
         // Envía una respuesta al cliente indicando el error
         res.status(500).json({ message: 'Error al agregar el cliente' });
     }
}

module.exports = { consultar, agregar };
