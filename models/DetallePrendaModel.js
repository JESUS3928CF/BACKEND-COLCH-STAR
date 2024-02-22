const Sequelize = require('sequelize');
const db = require('../config/db');
const { PrendasModels } = require('./PrendasModel');

const DetallePrendaModels = db.define(
    'detalle_prenda',
    {
        id_detalle_prenda: {
            type: Sequelize.INTEGER(5),
            primaryKey: true,
            autoIncrement: true,
        },
        cantidad: {
            type: Sequelize.INTEGER(13),
            allowNull: false,
        },
        talla: {
            type: Sequelize.STRING(10),
            allowNull: false,
        },
        color: {
            type: Sequelize.INTEGER(11),
            allowNull: false,
        },
        fk_prenda: {
            type: Sequelize.INTEGER,
            fiel: 'fk_prenda',
        },
    },
    {
        tableName: 'detalle_prenda',
    }
);

DetallePrendaModels.belongsTo(PrendasModels, { foreignKey: 'fk_prenda' });

module.exports = { DetallePrendaModels };
