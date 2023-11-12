const Sequelize = require('sequelize');
const db = require('../config/db');
const {PrendasModels}= require('./PrendasModel')



const TallaModels = db.define(
    'prenda_talla',
    {
        id_prenda_talla:{
            type: Sequelize.INTEGER(5),
            primaryKey: true,
            autoIncrement: true,

        },talla:{
            type: Sequelize.STRING(6),
            allowNyll: false,
            unique: true

        },fk_prenda:{
            type: Sequelize.INTEGER,
            fiel: 'fk_prenda'
        }
    },{
        tableName: 'prenda_talla'
    }

);

TallaModels.belongsTo(PrendasModels,{foreignKey:'fk_prenda'})

module.exports={TallaModels}
