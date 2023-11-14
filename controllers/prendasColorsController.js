const {colorsPrendasmodel} = require('../models/ColorsPrendasModels.js')

const consultPrendasColors =  async (req,res)=>{

    try{
        const colorsPrendas= await colorsPrendasmodel.findAll()

        res.status(200).json(colorsPrendas)

    }catch(e){
        res.status(500).json({e: 'Error al consultar la tabla prenda_Color'})
    }

}

module.exports={consultPrendasColors}
