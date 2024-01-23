//! Necesitamos importar esto
const Sequelize = require('sequelize');
const db = require('../config/db');
const { ClienteModels } = require('./ClienteModel');

const OrdenesModels = db.define(
    'orden',
    {
        id_orden: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        fecha_entrega: {
            type: Sequelize.STRING,
        },
        precio_total: {
            type: Sequelize.FLOAT,
        },
        estado_de_orden: {
            type: Sequelize.STRING,
        },
        fk_cliente: {
            type: Sequelize.INTEGER,
            field: 'fk_cliente', // Nombre correcto de la columna en la tabla usuario
        },
        
    },
    {
        tableName: 'orden',
    }
);

OrdenesModels.belongsTo(ClienteModels, { foreignKey: 'fk_cliente' }); /// Establecer la relación

module.exports = { OrdenesModels };