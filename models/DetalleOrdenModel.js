//! Necesitamos importar esto
const Sequelize = require('sequelize');
const db = require('../config/db');
const { ProductoModels } = require('./ProductoModel');
const { OrdenesModels } = require('./OrdenesModel');






const DetalleOrdenModels = db.define(
    'detalle_orden',
    {
        id_detalle_orden: {
            type: Sequelize.INTEGER,

            primaryKey: true,
            autoIncrement: true,
        },
        cantidad: {
            type: Sequelize.INTEGER,
        },
        subtotal: {
            type: Sequelize.FLOAT,
        },
        descripcion: {
            type: Sequelize.STRING,
        },
        fk_producto: {
            type: Sequelize.INTEGER,
            field: 'fk_producto', // Nombre correcto de la columna en la tabla usuario
        },
        talla: {
            type: Sequelize.STRING,
        },
        color: {
            type: Sequelize.STRING,
        },
        fk_orden: {
            type: Sequelize.INTEGER,
            field: 'fk_orden', // Nombre correcto de la columna en la tabla usuario
        },
        
    },
    {
        tableName: 'detalle_orden',
    }
);

DetalleOrdenModels.belongsTo(ProductoModels, { foreignKey: 'fk_producto' }); /// Establecer la relación
DetalleOrdenModels.belongsTo(OrdenesModels, { foreignKey: 'fk_orden' }); /// Establecer la relación

module.exports = { DetalleOrdenModels };