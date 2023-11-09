const{colorModels}= require('../models/colorModel')
const {colorsPrendasmodel} = require('../models/ColorsPrendasModels.js')
const { PrendasModels } = require("../models/PrendasModel.js");





const consult= async(req,res)=>{

    try{
        const colors = await colorModels.findAll()
        const prendaColors = await colorsPrendasmodel.findAll()
        const prenda= await PrendasModels.findAll()



        const colorConLaPrenda= new Map()

        prendaColors.forEach((fk_prenda)=>{
            console.log(colorConLaPrenda)
            if(!colorConLaPrenda.has(fk_prenda.fk_color)){
                colorConLaPrenda.set(fk_prenda.fk_color,[])
            }
            colorConLaPrenda.get(fk_prenda.fk_color).push(fk_prenda.fk_prenda);
        })

        const prendasYColor= colors.map((color)=>({
            id_color: color.id_color,
            codigo: color.codigo,
            prendaColor: colorConLaPrenda.get(color.id_color)||[],
        }))


        res.status(200).json(prendasYColor)
    } catch (error){
        res.status(500).json({ error: 'Error al consultar el color' });
        console.log(error)

    }

}


const addColors = async(req,res)=>{
    try{
        const {color,codigo}=req.body
         await colorModels.create({
            color,
            codigo
        });
        res.status(200).json('Color agregado correctamente')
    }catch(e){
        res.status(500).json({e: 'Error al agregar'})
    }
}

const updateColors = async(req,res)=>{


    try{
        const {color,codigo}=req.body
        const id= req.params.id
    
        const colorsUpdate = await colorModels.findOne({
            where: {id_color: id}
        })
    
        colorsUpdate.color=color,
        colorsUpdate.codigo=codigo
    
        colorsUpdate.save()
    
        res.status(200).json({message: 'Actualizacion de color exitosa'})
    

    } catch(e){
        res.status(500).json({e:'Error al actualizar el color'})
    }
   


}

module.exports={consult, addColors,updateColors}