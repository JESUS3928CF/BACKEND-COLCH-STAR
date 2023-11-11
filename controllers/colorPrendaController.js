const {colorsPrendasmodel} = require('../models/ColorsPrendasModels.js')
const { PrendasModels } = require("../models/PrendasModel.js");
const {colorModels}=require('../models/colorModel.js')

const consult = async (req,res)=>{
    try{

        const colorsPrenda= await colorsPrendasmodel.findAll()

       

        res.status(200).json(colorsPrenda)
    }catch(e){

        res.status(500).json({e: 'Error al buscar el color dela prenda'})
    }
}

const addPrendaColor= async (req,res)=>{
    try{

        const prendas = await PrendasModels.findAll();
        const colors = await colorModels.findAll();

        const {fk_prenda, fk_color}= req.body
        const id = req.params.id
        
        const idColors = new Map()
        const idPrenda= new Map()

        prendas.forEach((id_prenda)=> {
            if(!idPrenda.has(id_prenda.id_prenda)){
                idPrenda.set(id_prenda.id_prenda,[])
            }

            idPrenda.get(id_prenda.id_prenda).push(id_prenda.id_prenda)
            
        });

        colors.forEach((id_color)=>{
            if(!idColors.has(id_color.id_color)){
                idColors.set(id_color.id_color,[])
            }
            idColors.get(id_color.id_color).push(id_color.id_color)
        })

        await colorsPrendasmodel.create({

            fk_prenda: idPrenda.get(id),
            fk_color: idColors.get(id)
        });
        res.status(200).json({message: 'agregado'})
    } catch(e){
        res.status(500).json({e: 'error en la prenda_color'})
        console.log(e)
    }
}

module.exports = {consult,addPrendaColor}