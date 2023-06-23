const  { UsuarioModels} = require('../models/UsuariosModel');

const consultar = async (req, res) => {
    try {

        /// Consultando todos los registros
        const usuario = await UsuarioModels.findAll();
        
        //- Forma de inviar un JSON
        res.status(200).json(usuario);

        
    } catch (error) {
        console.log('Error al consultar la tabla usuarios:', error);
        res.status(500).json({ error: 'Error al consultar la tabla usuarios ' });
    }
};

//! Agregar un cliente

const agregar = async (req,res) => {

     try {
         const { nombre, apellido, telefono, email, contrasena, fk_rol } = req.body;


        //!  Insertar un nuevo cliente en la base de datos
         const user = await UsuarioModels.create({
             nombre,
             apellido,
             telefono,
             email,
             contrasena,
             fk_rol,
         });

         /// Mensaje de respuesta
         res.json({
             message: 'Usuario agregado exitosamente',user
         });

     } catch (error) {
         // Envía una respuesta al cliente indicando el error
         res.status(500).json({ message: 'Error al agregar el usuario' });
     }
}

//! Actualizar un cliente

const actualizar = async (req, res) => {    
    try {

        const { nombre, apellido, telefono, email, contrasena, fk_rol } = req.body;

        console.log('actualizar esto');
        const id = req.params.id;
        console.log(id);

        const usuario = await UsuarioModels.findOne({
            where: { id_usuario: id },
        });
        // Actualizar los valores del registro
        usuario.nombre = nombre;
        usuario.apellido = apellido;
        usuario.telefono = telefono;
        usuario.email = email;
        usuario.contrasena = contrasena;
        usuario.fk_rol = fk_rol;

        usuario.save();

        res.json({ message: 'Actualización exitosa' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
}


//! Actualizar un cliente

const cambiarEstado = async (req, res) => {    
    try {

        console.log("Se hizo unn estado");
        const { estado } = req.body;

        console.log('actualizar esto');
        const id = req.params.id;
        console.log(id);

        const usuario = await UsuarioModels.findOne({
            where: { id_usuario: id },
        });
        // Actualizar los valores del registro
        usuario.estado = !estado;

        usuario.save();

        res.json({ message: 'Cambio de estado' });
    } catch (error) {
        res.status(500).json({ message: 'no se cambio el estado' });
    }
}

module.exports = { consultar, agregar, actualizar, cambiarEstado};
