const {colorsPrendasmodel} = require('../models/ColorsPrendasModels.js')
const {PrendasModels}=require('../models/PrendasModel.js')
const {colorModels}=require('../models/colorModel.js')

const consult = async (req,res)=>{
    try{

        const prendaColor= await colorsPrendasmodel.findAll();


        // const prendas = await PrendasModels.findAll();
        // const coloresDeLaprenda= new Map();

        // prendaColor.forEach((fk_prenda)=>{
        //     if(!coloresDeLaprenda.has(fk_prenda.id_prenda)){
        //         coloresDeLaprenda.set(fk_prenda.id_prenda,[]);
        //     }
        //     coloresDeLaprenda.get(fk_prenda.id_prenda).push(fk_prenda.fk_prenda)
        // })

        // const colosPrendas = prendas.map((p) => ({
        //     id_prenda: p.id_prenda,
        //     nombre: p.nombre,
        //     colorPrenas: colosPrendas.get(p.id_prenda) || [],
        // }));


        res.status(200).json(prendaColor)
    }catch(e){
        res.status(500).json({e: 'Error al buscar el color dela prenda'})
    }
}

const addPrendaColor= async (req,res)=>{
    try{
        const {fk_prenda, fk_color}= req.body

        await colorsPrendasmodel.create({
            fk_prenda,
            fk_color
        });
        res.status(200).json({message: 'agregado'})
    } catch(e){
        res.status(500).json({e: 'error en la prenda_color'})
        console.log(e)
    }
}

module.exports = {consult,addPrendaColor}