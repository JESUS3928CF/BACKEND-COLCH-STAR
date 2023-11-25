const {ComprasDetallesModels} = require('../models/compraDetallesModel.js')


const consult = async (req,res)=>{
    try{
        
        const comprasDetalles= await ComprasDetallesModels.findAll()
        res.status(200).json(comprasDetalles)

    }catch(error){
        res.status(500).json({message: 'Error al consultar los detalles d elas prendas'})
    }
}

module.exports = {consult}
