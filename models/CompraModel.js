//! Necesitamos importar esto
const Sequelize = require('sequelize')
const db = require('../config/db');
const {ProveedorModels} = require('../models/ProveedorModel');

const CompraModels = db.define('compra', {
    id_compra: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    total_de_compra: {
        type: Sequelize.FLOAT,
    },
    fecha: {
        type: Sequelize.STRING,
    },
    estado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    fk_proveedor: {
        type: Sequelize.INTEGER,
        references: {
            model: ProveedorModels,
            key: 'id_proveedor',
        },
    },
}, {
    tableName: 'compra',
});

CompraModels.belongsTo(ProveedorModels, { foreignKey: 'fk_proveedor', as: 'proveedor' });
ProveedorModels.hasMany(CompraModels, { foreignKey: 'fk_proveedor', as: 'compra' });

module.exports = {CompraModels};