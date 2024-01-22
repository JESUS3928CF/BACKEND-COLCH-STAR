//! Necesitamos importar el ORM
const Sequelize = require('sequelize');
const db = require('../config/db');


//* Definimos el schema de la tabla precio de diseños
const PrecioDisenoModels = db.define(
    'precio_diseno',
    {
        id_precio_diseno: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        tamano: {
            type: Sequelize.STRING,
        },
        precio : {
            type : Sequelize.FLOAT,  
        }
    },
    {
        tableName: 'precio_diseno',
    }
);

module.exports = { PrecioDisenoModels };   