const { RolModels } = require('../models/RolModel.js');
const { ConfiguracionModels } = require('../models/ConfiguracionModel.js');
const { constants } = require('buffer');

const consultar = async (req, res) => {
    try {
        /// Consultando todos los registros
        const roles = await RolModels.findAll();

        /// Consultando todos los registros de permisos
        const configuraciones = await ConfiguracionModels.findAll();

        // Crear un mapa para almacenar los permisos por rol
        const permisosPorRol = new Map();

        // Organizar los permisos en el mapa
        configuraciones.forEach((permiso) => {
            if (!permisosPorRol.has(permiso.fk_rol)) {
                permisosPorRol.set(permiso.fk_rol, []);
            }
            permisosPorRol.get(permiso.fk_rol).push(permiso.permiso);
        });

        

        // Formatear los resultados para incluir los permisos en los roles
        const rolesConPermisos = roles.map((rol) => ({
            id_rol: rol.id_rol,
            nombre: rol.nombre,
            fecha_creacion: rol.fecha_creacion,
            estado: rol.estado,
            permisos: permisosPorRol.get(rol.id_rol) || [],
        }));

        // Enviar la respuesta JSON
        res.status(200).json(rolesConPermisos);
    } catch (error) {
        console.log('Error al consultar la tabla roles:', error);
        res.status(500).json({ error: 'Error al consultar la tabla roles' });
    }
};

//! Agregar un rol y sus permisos
const agregar = async (req, res) => {
    try {
        const { nombre, permisos } = req.body;

        console.log('Datos recibidos:', { nombre, permisos });

        //!  Insertar un nuevo rol en la base de datos
        const nuevoRol = await RolModels.create({
            nombre,
        });

        /// Inserta los permisos de ese rol
        for (let value of permisos) {
            await ConfiguracionModels.create({
                fk_rol: nuevoRol.id_rol,
                permiso: value,
            });
        }

        /// Mensaje de respuesta
        res.json({
            message: 'Rol agregado exitosamente',
        });
    } catch (error) {
        // Envía una respuesta al cliente indicando el error
        res.status(500).json({ message: 'Error al agregar el rol' });
    }
};


// //! Actualizar un rol y sus permisos
const actualizar = async (req, res) => {
    try {
        const { nombre, permisos } = req.body;
        const id_rol = req.params.id; // Obtiene el ID desde la ruta

        console.log('Datos recibidos:', { id_rol, nombre, permisos });

        // Actualiza el rol en la base de datos
        const rolActualizado = await RolModels.update(
            { nombre },
            { where: { id_rol: id_rol } }
        );

        // Elimina los permisos existentes para este rol
        await ConfiguracionModels.destroy({ where: { fk_rol: id_rol } });

        // Inserta los nuevos permisos para el rol
        for (let value of permisos) {
            await ConfiguracionModels.create({
                fk_rol: id_rol,
                permiso: value,
            });
        }

        // Mensaje de respuesta
        res.json({
            message: 'Rol actualizado exitosamente',
        });
    } catch (error) {
        // Envía una respuesta al cliente indicando el error
        res.status(500).json({ message: 'Error al actualizar el rol' });
    }
};


//! Actualizar un estado de rol

const cambiarEstado = async (req, res) => {
    try {
        console.log('Se hizo una estado');
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
};

module.exports = { consultar, agregar, actualizar, cambiarEstado };
