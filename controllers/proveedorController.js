const { ProveedorModels } = require("../models/ProveedorModel");



const consu = async (req, res) => {
    try {
        //por el meto findAll se buscna todos los registros
        const proveedores = await ProveedorModels.findAll();
        
    res.status(200).json(proveedores)
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
        await ProveedorModels.create({
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

// ! Actualizar un proveedor

const actualizar = async (req, res) => {    
    try {

        const { nombre,  telefono,  direccion, contacto } = req.body;

        console.log('actualizar esto');
        const id = req.params.id;
        console.log(id);

        const proveedor = await ProveedorModels.findOne({
            where: { id_proveedor: id },
        });
        // Actualizar los valores del registro
        proveedor.nombre = nombre;
        proveedor.telefono = telefono;
        proveedor.direccion = direccion;
        proveedor.contacto = contacto

        proveedor.save();

        res.json({ message: 'Actualización exitosa' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el proveedor' });
    }
}

//! Actualizar un cliente

const cambiarEstado = async (req, res) => {    
    try {

        console.log("Se hiso una estado");
        const { estado } = req.body;

        console.log('actualizar esto');
        const id = req.params.id;
        console.log(id);

        const proveedor = await ProveedorModels.findOne({
            where: { id_proveedor: id },
        });
        // Actualizar los valores del registro
        proveedor.estado = !estado;

        proveedor.save();

        res.json({ message: 'Cambio de estado' });
    } catch (error) {
        res.status(500).json({ message: 'no se cambio el estado' });
    }
}


module.exports = {consu,agregar,actualizar, cambiarEstado };

