const {ClienteModels} = require("../models/ClienteModel");

const consultar = async (req, res) => {
    try {
        const clientes = await ClienteModels.findAll();

    res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({error: "No se pudo hacer la consulta a la tabla clientes"}); 
    }
    
}

module.exports = consultar;