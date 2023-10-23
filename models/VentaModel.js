const Sequelize = require('sequelize')
const {ClienteModels} = require('../models/ClienteModel');
const db = require('../config/db');

const VentaModels = db.define('ventas', {
    id_venta: {
        type: Sequelize.INTEGER(5),
        primaryKey: true,
        autoIncrement: true,
    },
    producto: {
        type: Sequelize.STRING,
    },
    cantidad_producto: {
        type: Sequelize.INTEGER,
    },
    monto_total: {
        type: Sequelize.DOUBLE,
    },
    fecha_entrega: {
        type: Sequelize.DATE,
    },
    descripcion: {
        type: Sequelize.STRING,
    },
    estado: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
    },
    fk_cliente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'fk_cliente',
    },
});

VentaModels.belongsTo(ClienteModels, { foreignKey: "fk_cliente"})

module.exports = { VentaModels }