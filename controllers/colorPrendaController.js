const {colorsPrendasmodel} = require('../models/ColorsPrendasModels.js')

const consult = async (req,res)=>{
    try{
        const prendaColor= await colorsPrendasmodel.findAll()

        res.status(200).json(prendaColor)
    }catch(e){
        res.status(500).json({e: 'Error al buscar el color d ela prenda'})
    }
}

module.exports = {consult}