// const Sequelize = require('sequelize');
// const db = require('../config/db');
// const { RolModels } = require('./RolModel');


// const ConfiguracionModels = db.define(
//     'configuracion',
//     {
//         id_configuracion: {
//             type: Sequelize.INTEGER,
//             primaryKey: true,
//             autoIncrement: true,
//         },
//         permiso: {
//             type: Sequelize.STRING,
//         },
//         fk_rol: {
//             type: Sequelize.INTEGER(5),
//             field: 'fk_rol', // Nombre correcto de la columna en la tabla usuario
//         },
//     },
//     {
//         tableName: 'configuracion', //- para definir el nombre de la tabla tiene que ser el mismo de la db para evitar errores
//     }
// );


// module.exports = { ConfiguracionModels };


const Sequelize = require('sequelize');
const db = require('../config/db');
const { RolModels } = require('./RolModel');

const ConfiguracionModels = db.define(
    'configuracion',
    {
        id_configuracion: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        permiso: {
            type: Sequelize.STRING,
        },
        fk_rol: {
            type: Sequelize.INTEGER(5),
            field: 'fk_rol',
        },
    },
    {
        tableName: 'configuracion',
    }
);


ConfiguracionModels.belongsTo(RolModels, {
    foreignKey: 'fk_rol',
});


module.exports = { ConfiguracionModels };
