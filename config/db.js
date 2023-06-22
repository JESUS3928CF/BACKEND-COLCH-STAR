const Sequelize = require("sequelize");
const dotenv = require('dotenv/config');


const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    define: {
        timestamps: false,
    },
    pool: {
        max: 10, //- Máximo de conexiones simultaneas permitidas
        min: 0, /// Minino de conexiones simultaneas permitidas
        acquire: 30000, //- Tiempo máximo de adquisición
        idle: 10000, /// Tiempo maxima de inactividad antes de que una conexión sea serrada
    },
    operatorAliases: false,
});


module.exports = db;