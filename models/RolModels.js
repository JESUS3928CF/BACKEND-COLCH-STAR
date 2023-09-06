//! Necesitamos importar esto
const Sequelize = require('sequelize');
const db = require('../config/db');

const RolModels = db.define(
    'roles',
    {
        id_rol: {
            type: Sequelize.INTEGER(5),
            allowNull: false, //- No puede tener valores nulos
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: Sequelize.STRING(50),
            allowNull: false,
            unique: true,
        },
        fecha_creacion: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        estado: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
        },
    },
    {
        tableName: 'roles', // Nombre de la tabla en la base de datos
    }
);

module.exports = { RolModels };
