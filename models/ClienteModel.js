//! Necesitamos importar esto
const Sequelize = require('sequelize');
const db = require('../config/db');

const ClienteModels = db.define(
    'cliente',
    {
        id_cliente: {
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
        direccion: {
            type: Sequelize.STRING,
        },
        cedula: {
            type: Sequelize.STRING,
        },
        estado: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true, //! Establece el valor por defecto del estado como true
        },
    },
    {
        tableName: 'cliente', 
    }
);



module.exports = { ClienteModels };

