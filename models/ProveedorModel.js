//! Necesitamos importar esto
const Sequelize = require('sequelize');
const db = require('../config/db');

const ProveedorModels = db.define(
    'proveedor',
    {
        id_proveedor: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: Sequelize.STRING,
        },
        telefono: {
            type: Sequelize.STRING,
        },
        direccion: {
            type: Sequelize.STRING,
        },
        identificador: {
            type: Sequelize.STRING,
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true, //! Establece el valor por defecto del estado como true
        },
        tipoIdentificacion: {
            type: Sequelize.STRING,

        }
    },
    {
        tableName: 'proveedor',
    }
);


module.exports = { ProveedorModels };