const { ProveedorModels } = require("../models/ProveedorModel");



const consu = async (req, res) => {
    try {
        const resultado = await ProveedorModels.findAll();

    res.status(200).json(resultado)
    } catch (e) {
        res.status(500).json({e:"no se consulto la tabla"})
    } 
      
}

module.exports = consu;

