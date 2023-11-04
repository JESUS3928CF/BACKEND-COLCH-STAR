const Sequelize = require('sequelize');
const db = require('../config/db');
const { RolModels } = require('./RolModel');

const ConfiguracionModels = db.define(
    'configuracion',
    {
        id_configuracion: {
            type: Sequelize.INTEGER(5),
            primaryKey: true,
            autoIncrement: true,
        },
        permiso: {
            type: Sequelize.STRING(200),
        },
        fk_rol: {
            type: Sequelize.INTEGER(5),
            field: 'fk_rol',
        },
    },
    {
        tableName: 'configuracion',
    }
);


ConfiguracionModels.belongsTo(RolModels, {
    foreignKey: 'fk_rol',
});


module.exports = { ConfiguracionModels };
