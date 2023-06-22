const Sequelize = require("sequelize");

const db = new Sequelize('colch_star', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql',
    define: {
        timesTamps: false,
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