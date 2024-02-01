const Sequelize = require('sequelize')
const db = require ('../config/db')

const MovimientosModels = db.define(
    'movimientos',{
        ID:{
             type: Sequelize.INTEGER,
             primaryKey: true,
             autoIncrement: true,
        },
        fecha: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal(
                "CONVERT_TZ(NOW(), '+00:00', '-05:00')"
            ),        },
        descripcion:{
            type: Sequelize.STRING
        }
    },{
        tableName: 'movimientos'
    }
)

module.exports={MovimientosModels}