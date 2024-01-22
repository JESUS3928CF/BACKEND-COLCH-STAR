//! Necesitamos importar esto
const Sequelize = require('sequelize');
const db = require('../config/db');
const { PrendasModels } = require('./PrendasModel');

const ProductoModels = db.define(
    'producto',
    {
        id_producto: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: Sequelize.STRING,
        },
        cantidad: {
            type: Sequelize.INTEGER,
        },
        precio: {
            type: Sequelize.FLOAT,
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true, //! Establece el valor por defecto del estado como true
        },
        imagen: {
            type: Sequelize.STRING,
        },
        publicado: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false, //! Establece el valor por defecto del estado como false
        },
        fk_prenda: {
            type: Sequelize.INTEGER,
            field: 'fk_prenda', // Nombre correcto de la columna en la tabla usuario
        },
        
    },
    {
        tableName: 'producto',
    }
);

ProductoModels.belongsTo(PrendasModels, { foreignKey: 'fk_prenda' }); /// Establecer la relación

module.exports = { ProductoModels };