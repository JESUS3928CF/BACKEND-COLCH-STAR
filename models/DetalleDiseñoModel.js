//! Necesitamos importar esto
const Sequelize = require('sequelize');
const db = require('../config/db');
const { ProductoModels } = require('./ProductoModel');
const { PrecioDisenoModels } = require('./PrecioDisenoModel');
const { DisenoModels } = require('./DisenoModel');





const DetalleDiseñoModels = db.define(
    'detalle_diseno',
    {
        id_Detalle_diseno: {
            type: Sequelize.INTEGER,

            primaryKey: true,
            autoIncrement: true,
        },
        fk_diseno: {
            type: Sequelize.INTEGER,
            field: 'fk_diseno', // Nombre correcto de la columna en la tabla usuario
        },
        fk_precio_diseno: {
            type: Sequelize.INTEGER,
            field: 'fk_precio_diseno', // Nombre correcto de la columna en la tabla usuario
        },
        fk_producto: {
            type: Sequelize.INTEGER,
            field: 'fk_producto', // Nombre correcto de la columna en la tabla usuario
        },
        
    },
    {
        tableName: 'detalle_diseno',
    }
);

DetalleDiseñoModels.belongsTo(DisenoModels, { foreignKey: 'fk_diseno' }); /// Establecer la relación
DetalleDiseñoModels.belongsTo(PrecioDisenoModels, { foreignKey: 'fk_precio_diseno' }); /// Establecer la relación
DetalleDiseñoModels.belongsTo(ProductoModels, { foreignKey: 'fk_producto' }); /// Establecer la relación

module.exports = { DetalleDiseñoModels };