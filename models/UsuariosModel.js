//! Necesitamos importar esto
const Sequelize = require('sequelize');
const db = require('../config/db');
const { RolModels } = require('./RolModel');


const UsuarioModels = db.define(
    'usuario',
    {
        id_usuario: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: Sequelize.STRING,
        },
        apellido: {
            type: Sequelize.STRING,
        },
        telefono: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
            unique: true
        },
        contrasena: {
            type: Sequelize.STRING,
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true, //! Establece el valor por defecto del estado como true
        },
        token: {
            type: Sequelize.STRING(20)
        },
        fk_rol: {
            type: Sequelize.INTEGER(5),
            field: 'fk_rol', // Nombre correcto de la columna en la tabla usuario
        },
    },
    {
        tableName: 'usuario', //- para definir el nombre de la tabla tiene que ser el mismo de la db para evitar errores
    }
);

UsuarioModels.belongsTo(RolModels, { foreignKey: 'fk_rol' }); /// Establecer la relación

module.exports = { UsuarioModels };
