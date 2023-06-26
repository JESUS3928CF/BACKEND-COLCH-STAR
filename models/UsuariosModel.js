//! Necesitamos importar esto
const Sequelize = require('sequelize');
const db = require('../config/db');
const { RolModels } = require('./RolModels');

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
        },
        contrasena: {
            type: Sequelize.STRING,
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true, //! Establece el valor por defecto del estado como true
        },
        fk_rol: {
            type: Sequelize.INTEGER(5),
            allowNull: false,
            field: 'fk_rol', // Nombre correcto de la columna en la tabla usuario
        },
    },
    {
        tableName: 'usuario',
    }
);

UsuarioModels.belongsTo(RolModels, { foreignKey: 'fk_rol' });
// UsuarioModels.belongsTo(RolModels);

module.exports = { UsuarioModels };