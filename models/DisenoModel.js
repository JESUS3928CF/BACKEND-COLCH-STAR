//! Necesitamos importar el ORM
const Sequelize = require('sequelize');
const db = require('../config/db');


//* Definimos el schema de la tabla diseño
const DisenoModels = db.define(
    'diseno',
    {
        id_diseno: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: Sequelize.STRING,
        },
        imagen: {
            type: Sequelize.STRING,
        },
        publicado: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false, //! Establece el valor por defecto del estado como false
        },
        estado: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true, //! Establece el valor por defecto del estado como true
        },
    },
    {
        tableName: 'diseno', 
    }
);

module.exports = { DisenoModels };   