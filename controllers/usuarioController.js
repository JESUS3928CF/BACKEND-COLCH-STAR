const { UsuarioModels } = require('../models/UsuariosModel.js');
const { RolModels } = require('../models/RolModel.js');

//! Importamos la dependencia
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helpers/generarJWT.js');
const { ConfiguracionModels } = require('../models/ConfiguracionModel.js');
const shortid = require('shortid');
const emailRecuperarPassword = require('../helpers/emailRecuperarPassword.js');
const { MovimientosModels } = require('../models/MovimientosModels.js');
const { capitalizarPrimeraLetras } = require('../helpers/formatearDatos.js');
//! autenticar un usuario con JWT
const autenticar = async (req, res) => {
    const { email, contrasena } = req.body;

    try {
        /// Consultar el registro
        const usuario = await UsuarioModels.findOne({
            where: { email: email },
            attributes: {
                exclude: ['token'],
            },
            include: [{ model: RolModels, attributes: ['nombre', 'estado'] }],
        });

        /// Verificar si no se encontró el registro
        if (!usuario) {
            const error = new Error('Usuario o Contraseña son incorrectos');
            return res.status(403).json({ message: error.message });
        }

        /// validar la contraseña
        const contrasenaValida = await bcrypt.compare(
            contrasena,
            usuario.contrasena
        );
        if (!contrasenaValida || !usuario) {
            const error = new Error('Usuario o Contraseña son incorrectos');
            return res.status(403).json({ message: error.message });
        }

        /// Consultando todos los registros de permisos
        const permisos = await ConfiguracionModels.findAll();

        const permisosUsuario = new Map();
        permisosUsuario.set(usuario.fk_rol, []);

        permisos.forEach((permiso) => {
            if (permiso.fk_rol === usuario.fk_rol) {
                permisosUsuario.get(usuario.fk_rol).push(permiso.permiso);
            }
        });

        /// Verificar que este habilitado
        if (!usuario.estado) {
            const error = new Error('Tu cuenta se encuentra inhabilitada');
            return res.status(403).json({ message: error.message });
        }

        /// Verificar que el rol este habilitado
        if (!usuario.rol.estado) {
            const error = new Error(
                `El rol de ${usuario.rol.nombre} se encuentra inhabilitado`
            );
            return res.status(403).json({ message: error.message });
        }

        res.json({
            /// Quitar la info no deseada y solo mostrar la necesaria
            usuario: {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                rol: usuario.rol,
                permisos: permisosUsuario.get(usuario.fk_rol) || [],
                token: generarJWT(usuario.id_usuario),
            },
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
    console.log(usuario);
    res.json({ usuario });
};

/// Recuperar contraseña

const passwordPerdida = async (req, res) => {
    const { email } = req.body;

    const usuario = await UsuarioModels.findOne({
        where: { email: email },
    });

    if (!usuario) {
        const error = new Error('El usuario no existe');
        return res.status(403).json({ message: error.message });
    }

    try {
        usuario.token = shortid.generate() + shortid.generate();
        usuario.save();

        //* Enviar email con las instrucciones
        emailRecuperarPassword({
            email,
            nombre: usuario.nombre,
            token: usuario.token,
        });

        res.json({
            message:
                'Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña, si no encuentras el mensaje recuerda revisar en la bandeja de spam.',
        });
    } catch (error) {
        console.log(error);
    }
};

/// Comprobar el token de la contraseña
const checkToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await UsuarioModels.findOne({
        where: { token: token },
    });

    if (tokenValido) return res.json({ message: 'El Token es valido' });

    console.log(tokenValido);
    res.status(403).json({ message: 'El Token no es valido' });
};

const newPassword = async (req, res) => {
    const { token } = req.params;
    const { contrasena } = req.body;

    const usuario = await UsuarioModels.findOne({
        where: { token: token },
    });

    if (!usuario) {
        const error = new Error('Hubo un error');
        return res.status(403).json({ message: error.message });
    }

    try {
        usuario.token = null;
        usuario.contrasena = await bcrypt.hash(contrasena, 10);
        usuario.save();

        res.json({ message: 'Contraseña modificada correctamente' });
    } catch (error) {
        console.log(error);
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
            return res.status(403).json({
                message: 'Ya exite este teléfono',
                telOcupado,
            });
        }

        const correoOcupado = await UsuarioModels.findOne({
            where: { email: email },
        });

        if (correoOcupado) {
            return res.status(403).json({
                message: 'Ya existe este correo electrónico',
                correoOcupado,
            });
        }

        await UsuarioModels.create({
            nombre: capitalizarPrimeraLetras(nombre),
            apellido: capitalizarPrimeraLetras(apellido),
            telefono,
            email: email.toLowerCase(),
            contrasena: hashedContrasena, /// Guarda la contraseña cifrada en la base de datos
            fk_rol,
        });

        await MovimientosModels.create({ descripcion: `El usuario: ${req.usuario.nombre} registro un nuevo usuario` });

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
                return res.status(403).json({
                    message: 'Ya existe este teléfono',
                    telOcupado,
                });
            }
        }

        if (email !== usuario.email) {
            const correoOcupado = await UsuarioModels.findOne({
                where: { email: email },
            });

            if (correoOcupado) {
                return res.status(403).json({
                    message: 'Ya existe este correo electrónico',
                    correoOcupado,
                });
            }
        }

        if (usuario == null)
            return res.json({ message: 'Usuario no encontrado' });
        // Actualizar los valores del registro
        (usuario.nombre = capitalizarPrimeraLetras(nombre)),
            (usuario.apellido = capitalizarPrimeraLetras(apellido)),
            (usuario.telefono = telefono);
        usuario.email = email;
        usuario.fk_rol = fk_rol;

        usuario.save();
        await MovimientosModels.create({
            descripcion: `El usuario: ${req.usuario.nombre} actualizo el usuario  #${id}`,
        });

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
        await MovimientosModels.create({
            descripcion: `El usuario: ${req.usuario.nombre} cambio el estado del usuario #${id}`,
        });

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
    passwordPerdida,
    checkToken,
    newPassword,
};
