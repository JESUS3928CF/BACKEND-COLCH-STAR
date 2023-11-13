const { UsuarioModels } = require('../models/UsuariosModel');
const { RolModels } = require('../models/RolModel');
const jwt = require('jsonwebtoken');
const { ConfiguracionModels } = require('../models/ConfiguracionModel');
const { json } = require('body-parser');

const checkAut = async (req, res, next) => {
    let token;

    // Buscar en el objeto de header la autorización
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const usuario = await UsuarioModels.findByPk(decoded.id, {
                attributes: {
                    exclude: ['contrasena', 'token'],
                },
                include: [{ model: RolModels, attributes: ['nombre'] }],
            });

            /// Consultando todos los registros de permisos
            const permisos = await ConfiguracionModels.findAll();

            const permisosUsuario = new Map();
            permisosUsuario.set(usuario.fk_rol, []);

            permisos.forEach((permiso) => {
                if (permiso.fk_rol === usuario.fk_rol) {
                    permisosUsuario.get(usuario.fk_rol).push(permiso.permiso);
                }
            });

            req.usuario = {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                rol: usuario.rol,
                permisos: permisosUsuario.get(usuario.fk_rol) || [],
            };
            return next();
        } catch (error) {
            console.log(error);
            const e = new Error('Token no valido');
            
            res.status(403).json({ message: e.message });
            // Llama a `next` con el error en lugar de enviar la respuesta directamente
            return next(e);
        }
    }

    // en caso contrario mandar un error
    if (!token) {
        // Llama a `next` con el error en lugar de enviar la respuesta directamente
         const e = new Error('Token no Válido o inexistente');

         res.status(403).json({ message: e.message });
        return next(e);
    }

    next();
};

module.exports = { checkAut };
