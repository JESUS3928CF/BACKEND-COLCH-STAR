//! Necesitamos importar esto
const Sequelize = require('sequelize');
const db = require('../config/db');

const ProveedorModels = db.define(
    'proveedor',
    {
        id_proveedor: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: Sequelize.STRING,
        },
        telefono: {
            type: Sequelize.STRING,
        },
        direccion: {
            type: Sequelize.STRING,
        },
        contacto: {
            type: Sequelize.STRING,
        },
        estado: {
            type: Sequelize.BOOLEAN,
            defaultValue: true, //! Establece el valor por defecto del estado como true
        },
    },
    {
        tableName: 'proveedor',
    }
);


// Consultas personalizadas para clientes

const findOneProveedor = async (id) => {
    try {

        const consulta = `SELECT * FROM proveedor where id_proveedor = ${id}`;
        const resultado = await db.query(consulta, {
            type: Sequelize.QueryTypes.SELECT,
        });

        return resultado;

    } catch (error) {
        console.log(error);
    }
}
module.exports = { ProveedorModels, findOneProveedor };