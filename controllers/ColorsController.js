const{colorModels}= require('../models/colorModel')
const { MovimientosModels } = require('../models/MovimientosModels.js');

const { capitalizarPrimeraLetras } = require('../helpers/formatearDatos.js');





const consult= async(req,res)=>{

    try{
        const colors = await colorModels.findAll()
        
        res.status(200).json(colors)
    } catch (error){
        res.status(500).json({ error: 'Error al consultar el color' });
        console.log(error)

    }

}


const addColors = async(req,res)=>{
    try{
        const {color,codigo}=req.body
        const  repeatedColors = await colorModels.findOne({
            where: {color: capitalizarPrimeraLetras(color)}
        })

        if(repeatedColors){
            return res.status(403).json({
                message:'Ya existe el color',
                repeatedColors
            })
        }

        const  repeatedColorsCode = await colorModels.findOne({
            where: {codigo:codigo}
        })

        if(repeatedColorsCode){
            return res.status(403).json({
                message:'Ya existe el codigo del color',
                repeatedColorsCode
            })
        }

         await colorModels.create({
            color : capitalizarPrimeraLetras(color),
            codigo
        });

        await MovimientosModels.create({descripcion:`El usuario: ${req.usuario.nombre} registro un nuevo color`})



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
        await MovimientosModels.create({descripcion: `El usuario: ${req.usuario.nombre} actualizo el color # ${id}`})

    
        res.status(200).json({message: 'Actualizacion de color exitosa'})
    

    } catch(e){
        res.status(500).json({e:'Error al actualizar el color'})
    }
   


}

module.exports={consult, addColors,updateColors}