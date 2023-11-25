const { Sequelize } = require('sequelize');
const db = require('../config/db');
const {CompraModels} = require('./CompraModel');
const {PrendaModels} = require('./PrendasModel');

const DetalleCompraModels = db.define('detalle_compra', {
    id_detalle_compra: {
        type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true,
    },
    cantidad: {
        type: Sequelize.INTEGER,
    },
    precio: {
        type: Sequelize.FLOAT,
    },
    diseno: {
        type: Sequelize.STRING,
    },
    fk_compra: {
        type: Sequelize.INTEGER,
        references: {
            model: CompraModels,
            key: 'id_compra',
        },
    },
    fk_prenda: {
        type: Sequelize.INTEGER,
        references: {
            model: PrendaModels,
            key: 'id_prenda',
        },
    },
}, {
    tableName: 'detalle_compra',
});

DetalleCompraModels.belongsTo(CompraModels, { foreignKey: 'fk_compra', as: 'compra' });
CompraModels.hasMany(DetalleCompraModels, { foreignKey: 'fk_compra', as: 'detalle_compra' });

DetalleCompraModels.belongsTo(PrendaModels, { foreignKey: 'fk_prenda', as: 'prenda' });
PrendaModels.hasMany(DetalleCompraModels, { foreignKey: 'fk_prenda', as: 'detalle_compra' });

module.exports = DetalleCompraModels;