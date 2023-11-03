const Sequelize = require('sequelize');
const db = require ('../config/db')

const colorModels = db.define(
    'color',
    {
        id_color:{
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,

        },
        color: {
            type: Sequelize.STRING

        },
        codigo:{
            type: Sequelize.STRING
        }
},{
    tableName : 'color'
}
)

module.exports={colorModels}