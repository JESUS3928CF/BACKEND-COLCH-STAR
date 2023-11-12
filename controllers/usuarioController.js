const { UsuarioModels } = require('../models/UsuariosModel.js');
const { RolModels } = require('../models/RolModel.js');

//! Importamos la dependencia
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/generarJWT.js');

//! autenticar un usuario con JWT
const autenticar = async (req, res) => {
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

        /// Verificar si no se encontró el registro
        if (!usuario) {
            const error = new Error('El usuario no existe');
            return res.status(403).json({ message: error.message });
        }

        /// Verificar que este habilitado
        if (!usuario.estado) {
            const error = new Error('Tu cuenta se encuentra deshabilitada');
            return res.status(403).json({ message: error.message });
        }

        /// validar la contraseña
        const contrasenaValida = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );
        if (!contrasenaValida) {
            const error = new Error('Contraseña incorrecta');
            return res.status(403).json({ message: error.message });
        }

        // res.json({
        //     /// Quitar la info no deseada y solo mostrar la necesaria
        //     profile: {
        //         id_usuario: usuario.id_usuario,
        //         nombre: usuario.nombre,
        //         email: usuario.email,
        //         token: generarJWT(usuario.id_usuario),
        //     },
        // });

        res.json({
            token: generarJWT(usuario.id_usuario),
        });
    } catch (error) {
        console.log('Error al consultar el registro del usuario:', error);
        res.status(500).json({
            error: 'Error al consultar el registro del usuario',
        });
    }
};

const perfil = (req, res) => {
    const { usuario } = req;
    res.json({ usuario });
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
            return res.status(403).json({
                message: 'Ya existe este Email',
                correoOcupado,
            });
        }

        await UsuarioModels.create({
            nombre,
            apellido,
            telefono,
            email: email.toLowerCase(),
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

        if (telefono !== usuario.telefono) {
            const telOcupado = await UsuarioModels.findOne({
                where: { telefono: telefono },
            });
            if (telOcupado) {
                return res.status(400).json({
                    message: 'Ya Existe este Teléfono',
                    telOcupado,
                });
            }
        }

        if (email !== usuario.email) {
            const correoOcupado = await UsuarioModels.findOne({
                where: { email: email },
            });

            if (correoOcupado) {
                return res.status(400).json({
                    message: 'Ya Existe este Email',
                    correoOcupado,
                });
            }
        }

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
    actualizarContrasena,
    autenticar,
    perfil,
};
