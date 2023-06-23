const { ProveedorModels } = require("../models/ProveedorModel");



const consu = async (req, res) => {
    try {
        //por el meto findAll se buscna todos los registros
        const resultado = await ProveedorModels.findAll();
        
    res.status(200).json(resultado)
    } catch (e) {
        console.e("error en la busqueda de la tabla ",e);
        res.status(500).json({e:"no se consulto la tabla"});
    } 
      
}

//! Agregar proveedor

const agregar = async (req,res) => {

    try {
        const { nombre,  telefono,  direccion, contacto } = req.body;


       //!  Insertar un nuevo cliente en la base de datos
        await ClienteModels.create({
            nombre,
            telefono,
            direccion,
            contacto,
        });

        /// Mensaje de respuesta
        res.json({
            message: 'Proveedor agregado exitosamente',
        });

    } catch (error) {
        // Envía una respuesta al cliente indicando el error
        res.status(500).json({ message: 'Error al agregar el Proveedor' });
    }
}

// //! Actualizar un cliente

// const actualizar = async (req, res) => {    
//     try {

//         const { nombre, apellido, telefono, email, direccion } = req.body;

//         // console.log('actualizar esto');
//         const id = req.params.id;
//         console.log(id);

//         const cliente = await ClienteModels.findOne({
//             where: { id_cliente: id },
//         });
//         // Actualizar los valores del registro
//         cliente.nombre = nombre;
//         cliente.apellido = apellido;
//         cliente.telefono = telefono;
//         cliente.email = email;
//         cliente.direccion = direccion

//         cliente.save();

//         res.json({ message: 'Actualización exitosa' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error al actualizar el cliente' });
//     }
// }

// //! Actualizar un cliente

// const cambiarEstado = async (req, res) => {    
//     try {

//         console.log("Se hiso una estado");
//         const { estado } = req.body;

//         console.log('actualizar esto');
//         const id = req.params.id;
//         console.log(id);

//         const cliente = await ClienteModels.findOne({
//             where: { id_cliente: id },
//         });
//         // Actualizar los valores del registro
//         cliente.estado = !estado;

//         cliente.save();

//         res.json({ message: 'Cambio de estado' });
//     } catch (error) {
//         res.status(500).json({ message: 'no se cambio el estado' });
//     }
// }

module.exports = {consu,agregar};

