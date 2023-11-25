const {DetalleCompraModels} = require('../models/compraDetallesModel.js')
const {PrendasModels} = require('../models/PrendasModel.js')
const {CompraModels} = require('../models/CompraModel.js')


const consult = async (req,res)=>{
    try{
        
        const comprasDetalles= await DetalleCompraModels.findAll({
            include:[
                {
                    model: PrendasModels,
                    as:'prenda',
                    attributes: ['nombre'],

                },
                {
                    model: CompraModels,
                    as:'compra',
                    attributes: ['fecha'],

                },

            ]
        })
        res.status(200).json(comprasDetalles)

    }catch(error){
        res.status(500).json({message: 'Error al consultar los detalles d elas prendas'})
    }
}

module.exports = {consult}
