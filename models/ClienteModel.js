//! Necesitamos importar esto
const Sequelize = require('sequelize');
const db = require('../config/db');

const ClienteModels = db.define(
    'cliente',
    {
        id_cliente: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: Sequelize.STRING,
        },
        apellido: {
            type: Sequelize.STRING,
        },
        telefono: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        direccion: {
            type: Sequelize.STRING,
        },
        cedula: {
            type: Sequelize.STRING,
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true, //! Establece el valor por defecto del estado como true
        },
    },
    {
        tableName: 'cliente', 
    }
);


/// Consultas personalizadas para clientes

const findOneCliente = async (id) => {
    try {

        const consulta = `SELECT * FROM cliente where id_cliente = ${id}`;
        const resultado = await db.query(consulta, {
            type: Sequelize.QueryTypes.SELECT,
        });

        return resultado;
        
    } catch (error) {
        console.log(error);
    }
}


module.exports = { ClienteModels, findOneCliente };

