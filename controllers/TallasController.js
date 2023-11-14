const {TallaModels}= require('../models/TallaModel.js')


const consultTalla = async(req,res)=>{
    try{
        const talla = await TallaModels.findAll();

        res.status(200).json(talla)
    } catch (e){
        res.status(500).json({e: 'Error al buscar las tallas'})
    }
}

module.exports={consultTalla}