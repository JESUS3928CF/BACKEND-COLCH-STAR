const {MovimientosModels} = require('../models/MovimientosModels')



const consultar = async (req, res)=>{

    try{
        const movimientos = await MovimientosModels.findAll()
        res.status(200).json(movimientos)
    }catch(eror){
        res.status(500).json({eror: 'Error al consultar los movimientos'})
    }
   
}

const agregar = async(req,res)=>{
    try{

        const {descripcion}= req.body
        const agregarMovimientos = await MovimientosModels.create({

            descripcion: descripcion
        })

        res.status(200).json(agregarMovimientos)

    }catch (error){
        res.status(500).json({error: 'Error al agregar los movimientos'})
    }
}


module.exports={consultar, agregar};