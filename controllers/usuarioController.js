const { UsuarioModels } = require('../models/UsuariosModel');
const { RolModels } = require('../models/RolModel');

//! Importamos la dependencia
const bcrypt = require('bcrypt');

//! Consultar un registro relacionado con Sequelize
const login = async (req, res) => {
    const { email, contrasena } = req.body;

    try {
        /// Consultar el registro
        const usuario = await UsuarioModels.findOne({
            where: { email: email },
            include: [
                {
                    model: RolModels,
                    attributes: ['nombre'],
                },
            ],
        });

        if (!usuario) {
            return res.json({ message: 'Usuario no encontrado' });
        }
        /// Verificar si se encontró el registro

        const contrasenaValida = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );
        if (!contrasenaValida) {
            return res.json({ message: 'Contraseña incorrecta' });
        }
        res.json(usuario);
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
            ],
        });

        //- Forma de inviar un JSON
        res.status(200).json(usuarios);
    } catch (error) {
        console.log('Error al consultar la tabla usuarios:', error);
        res.status(500).json({ error: 'Error al consultar la tabla usuarios' });
    }
};

//! Agregar un cliente

const agregar = async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, contrasena, fk_rol } =
            req.body;

        //! Cifra la contraseña utilizando bcrypt
        const hashedContrasena = await bcrypt.hash(contrasena, 10); //- El segundo argumento es el número de rondas de hashing

        const telOcupado = await UsuarioModels.findOne({
            where: { telefono: telefono },
        });

        if (telOcupado) {
            return res.status(400).json({
                message: 'Ya exite este teléfono',
                telOcupado,
            });
        }

        const correoOcupado = await UsuarioModels.findOne({
            where: { email: email },
        });

        if (correoOcupado) {
            return res.status(400).json({
                message: 'Ya exite esta Email',
                correoOcupado,
            });
        }

        await UsuarioModels.create({
            nombre,
            apellido,
            telefono,
            email,
            contrasena: hashedContrasena, /// Guarda la contraseña cifrada en la base de datos
            fk_rol,
        });

        /// Mensaje de respuesta
        res.json({
            message: 'Usuario agregado exitosamente',
            hashedContrasena,
        });
    } catch (error) {
        // Envía una respuesta al cliente indicando el error
        res.status(500).json({ message: 'Error al agregar el usuario' });
    }
};

//! Actualizar un usuario

const actualizar = async (req, res) => {
    try {
        const { nombre, apellido, telefono, email, fk_rol } = req.body;

        const id = req.params.id;
        console.log(id);

        const usuario = await UsuarioModels.findOne({
            where: { id_usuario: id },
        });
        

        if (usuario == null)
            return res.json({ message: 'Usuario no encontrado' });
        // Actualizar los valores del registro
        usuario.nombre = nombre;
        usuario.apellido = apellido;
        usuario.telefono = telefono;
        usuario.email = email;
        usuario.fk_rol = fk_rol;

        usuario.save();

        res.json({ message: 'Actualización exitosa' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el usuario' });
    }
};

const actualizarContrasena = async (req, res) => {
    try {
        const { contrasenaActual, contrasenaNueva } = req.body;

        console.log('actualizar esto');
        const id = req.params.id;
        console.log(id);

        const usuario = await UsuarioModels.findOne({
            where: { id_usuario: id },
        });

        // Compara la contraseña proporcionada con la contraseña almacenada
        const contrasenaValida = await bcrypt.compare(
            contrasenaActual,
            usuario.contrasena
        );

        if (!contrasenaValida) {
            return res.json({ message: 'Contraseña actual incorrecta' });
        }

        // Cifra la contraseña utilizando bcrypt
        const hashedContrasena = await bcrypt.hash(contrasenaNueva, 10);

        usuario.contrasena = hashedContrasena;

        usuario.save();

        res.json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la contraseña' });
    }
};

//! Actualizar un cliente

const cambiarEstado = async (req, res) => {
    try {
        console.log('Se hizo unn estado');
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
};

module.exports = {
    consultar,
    agregar,
    actualizar,
    cambiarEstado,
    login,
    actualizarContrasena,
};
