const {RolModels} = require('../models/RolModel');

const consultar = async (req, res) => {
    try {

        /// Consultando todos los registros
        const rol = await RolModels.findAll();

        //- Forma de inviar un JSON
        res.status(200).json(rol);


    } catch (error) {
        console.log('Error al consultar la tabla roles:', error);
        res.status(500).json({ error: 'Error al consultar la tabla roles' });
    }
};


//! Agregar un rol

const agregar = async (req, res) => {

    try {
        const { nombre, fecha_creacion} = req.body;

        console.log('Datos recibidos:', { nombre, fecha_creacion });

        //!  Insertar un nuevo cliente en la base de datos
        await RolModels.create({
            nombre,
            fecha_creacion,
        });

        /// Mensaje de respuesta
        res.json({
            message: 'Rol agregado exitosamente',
        });

       
    } catch (error) {
        // Envía una respuesta al cliente indicando el error
        res.status(500).json({ message: 'Error al agregar el rol' });
    }
}

//! Actualizar un cliente

const actualizar = async (req, res) => {
    try {

        const { nombre, fecha_creacion } = req.body;

        const id = req.params.id;
        console.log(id);

        const rol = await RolModels.findOne({
            where: { id_rol: id },
        });

    

        // Actualizar los valores del registro
        rol.nombre = nombre;
        rol.fecha_creacion = fecha_creacion;
        rol.save();

        res.json({ message: 'Actualización exitosa' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol' });
    }
}

//! Actualizar un estado de rol

const cambiarEstado = async (req, res) => {
    try {

        console.log("Se hizo una estado");
        const { estado } = req.body;

        console.log('actualizar esto');
        const id = req.params.id;
        console.log(id);

        const rol = await RolModels.findOne({
            where: { id_rol: id },
        });
        // Actualizar los valores del registro
        rol.estado = !estado;

        rol.save();

        res.json({ message: 'Cambio de estado' });
    } catch (error) {
        res.status(500).json({ message: 'no se cambio el estado' });
    }
}

module.exports = {consultar, agregar, actualizar, cambiarEstado};