const { ProveedorModels } = require("../models/ProveedorModel");



const consu = async (req, res) => {
    try {
        //por el meto findAll se buscna todos los registros
        const resultado = await ProveedorModels.findAll();
        
    res.status(200).json(resultado)
    } catch (e) {
        console.e("error en la busqueda de la tabla ",e);
        res.status(500).json({e:"no se consulto la tabla"});
    } 
      
}

module.exports = {consu};

