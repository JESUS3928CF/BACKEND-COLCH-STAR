const  { ClienteModels} = require('../models/ClienteModel');

const consultar = async (req, res) => {
    try {

        /// Consultando todos los registros
        const clientes = await ClienteModels.findAll();
        
        //- Forma de inviar un JSON
        res.status(200).json(clientes);

        
    } catch (error) {
        console.error('Error al consultar la tabla cliente:', error);
        res.status(500).json({ error: 'Error al consultar la tabla cliente' });
    }
};

module.exports = { consultar };
