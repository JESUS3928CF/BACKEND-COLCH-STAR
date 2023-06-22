const Sequelize = require("sequelize");
const db = require("../config/db");

/// Conectando con la tabla de clientes y pasando el esquema
const ClienteModels = db.define("cliente", {
    nombre: {
        type: Sequelize.STRING
    },
    apellido:{
        type: Sequelize.STRING
    },
    telefono:{
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    direccion: {
        type: Sequelize.STRING
    },
    estado: {
        type: Sequelize.BOOLEAN
    }
});

module.exports = ClienteModels;