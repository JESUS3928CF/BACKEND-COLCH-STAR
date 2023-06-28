const  { UsuarioModels} = require('../models/UsuariosModel');
const { RolModels } = require('../models/RolModels');

const consultarRegistro = async (req, res) => {
    try {
        // Obtener el ID del registro a consultar desde los parámetros de la solicitud
        const { id } = req.params;

        // Consultar el registro usando el modelo correspondiente y la relación con RolModels
        const usuario = await UsuarioModels.findByPk(id, {
            include: [
                {
                    model: RolModels,
                    attributes: ['nombre'],
                },
            ],
        });

        // Verificar si se encontró el registro
        if (usuario) {
            // Si se encontró, enviar el registro como respuesta
            res.status(200).json(usuario);
        } else {
            // Si no se encontró, enviar una respuesta indicando que el registro no existe
            res.status(404).json({ error: 'Registro no encontrado' });
        }
    } catch (error) {
        console.log('Error al consultar el registro del usuario:', error);
        res.status(500).json({
            error: 'Error al consultar el registro del usuario',
        });
    }
};


const consultar = async (req, res) => {
    try {

        /// Consultando todos los registros
        // const usuario = await UsuarioModels.findAll();

         const usuarios = await UsuarioModels.findAll({
             include: [
                 {
                     model: RolModels,
                     attributes: ['nombre'], // Incluye solo el campo "nombre" del modelo Rol
                 },
             ]
         });

        
        //- Forma de inviar un JSON
        res.status(200).json(usuarios);

        
    } catch (error) {
        console.log('Error al consultar la tabla usuarios:', error);
        res.status(500).json({ error: 'Error al consultar la tabla usuarios' });
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

module.exports = {
    consultar,
    agregar,
    actualizar,
    cambiarEstado,
    consultarRegistro,
};
