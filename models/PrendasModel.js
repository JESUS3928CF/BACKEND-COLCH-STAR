const sequelize = require('sequelize')
const db = require('../config/db');

const PrendasModels = db.define(
    'prenda',
    {
        id_prenda:{
            type: sequelize.Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },

        nombre: {
            type:sequelize.STRING,
        },
        cantidad:{
            type: sequelize.INTEGER,
        },
        precio:{
            type: sequelize.DOUBLE,
        },
        tipo_de_tela:{
            type:sequelize.STRING,
        },
        imagen:{
            type:sequelize.STRING,
        },
        genero: {
            type: sequelize.STRING,
        },
        publicado:{
            type:sequelize.BOOLEAN,
        },
        estado:{
            type: sequelize.BOOLEAN,
        },
    },{
        tableName: 'prenda'

    }
);

module.exports={PrendasModels}