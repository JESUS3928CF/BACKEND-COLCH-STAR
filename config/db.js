const Sequelize = require('sequelize');
const dotenv = require('dotenv/config');

/// Configuración para la base de datos local (elimina esto si no lo necesitas)
const dbLocal = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        define: {
            timestamps: false,
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        operatorAliases: false
    }
);

const dbRemote = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        define: {
            timestamps: false,
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
        operatorAliases: false,

        dialectOptions: {
            ssl: {
                rejectUnauthorized: true,
            },
        },
    }
);

// Exporta el objeto db que desees usar en tu aplicación
module.exports = process.env.USE_REMOTE_DB == "true" ? dbRemote : dbLocal;

