const Sequelize = require('sequelize');
const db = require('../config/db');

const RolModels = db.define(
    'rol',
    {
        id_rol: {
            type: Sequelize.INTEGER(5),
            allowNull: false,
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
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'), // Establece la fecha de creación actual
        },
        estado: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        tableName: 'rol',
    }
);

module.exports = { RolModels };
