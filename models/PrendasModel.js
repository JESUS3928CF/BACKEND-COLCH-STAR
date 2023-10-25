const Sequelize = require('sequelize')
const db = require('../config/db');

const PrendasModels = db.define(
    'prenda',
    {
        id_prenda:{
            type: Sequelize.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },

        nombre: {
            type:Sequelize.STRING,
        },
        cantidad:{
            type: Sequelize.INTEGER,
        },
        precio:{
            type: Sequelize.DOUBLE,
        },
        tipo_de_tela:{
            type:Sequelize.STRING,
        },
        imagen:{
            type:Sequelize.STRING,
        },
        genero: {
            type: Sequelize.STRING,
        },
        publicado:{
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
            
        },
        estado:{
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,            
        },
    },{
        tableName: 'prenda'

    }
);

module.exports={PrendasModels}