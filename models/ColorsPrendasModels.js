// const Sequelize = require('sequelize');
// const db = require('../config/db')
// const {colorsModels}= require('./colorModel')
// const {PrendasModels}= require('./PrendasModel')

// const colorsPrendasmodel = db.define(
//     'prenda_color',
//     {
//         id_prenda_color: {
//             type: Sequelize.INTEGER,
//             primaryKey: true,
//             autoIncrement:true 

//         },

//         fk_prenda_color:{
//             type: Sequelize.INTEGER,
//             field: 'fk_prenda'
//         },

//         fk_color:{
//             type: Sequelize.INTEGER,
//             field: 'fk_color'


//         }
//     },
//     {
//         tableName: 'prenda_color'
//     }
// );

// colorsPrendasmodel.belongsTo(colorsModels, {foreignKey: 'fk_color'})
// colorsPrendasmodel.belongsTo(PrendasModels,{foreignKey:'fk_prenda'})

// module.exports={colorsPrendasmodel}