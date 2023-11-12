const { PrendasModels } = require("../models/PrendasModel.js");
const {colorModels}=require('../models/colorModel.js')
const {colorsPrendasmodel} = require('../models/ColorsPrendasModels.js')

const fs = require("fs");
const { where } = require("sequelize");

const consultar = async (req, res) => {
  try {
    //Consulatr los registros de las prendas
    const prendas = await PrendasModels.findAll();
    const colors = await colorModels.findAll();
    const colorsPrenda = await colorsPrendasmodel.findAll();


    const TablaIntermedia= new Map()
    const nombreColors=new Map()


    colors.forEach((color)=>{
      if(!nombreColors.has(color.id_color)){
        nombreColors.set(color.id_color,[])
      }
      nombreColors.get(color.id_color).push(color.color)
    })



    colorsPrenda.forEach((fk_color)=>{

      if(!TablaIntermedia.has(fk_color.fk_prenda)){
          TablaIntermedia.set(fk_color.fk_prenda,[])

      }
      TablaIntermedia.get(fk_color.fk_prenda).push(fk_color.fk_color)
  })


  const ColoresDelaPrenda= prendas.map((colors)=>({

    id_prenda: colors.id_prenda,
    nombre:   colors.nombre,
    cantidad: colors.cantidad,
    precio: colors.precio,
    tipo_de_tela: colors.tipo_de_tela,  
    imagen: colors.imagen,
    genero: colors.genero,
    publicado: colors.publicado,
    estado: colors.estado,
    color : (()=>{
      const result = [];
      TablaIntermedia.get(colors.id_prenda).forEach((fk_color)=>{
        result.push(nombreColors.get(fk_color)||[]);
      });
      return result||[];

    })(),
 
}))


    res.status(200).json(ColoresDelaPrenda);


  } catch (error) {
    console.log("error a consultar la tabla prendas:", error);
    res.status(500).json({ error: "Error al consultar la tabla prendas" });
  }
};

//Agregar una prenda

const agregar = async (req, res) => {
  try {




    const { nombre, cantidad, precio, tipo_de_tela, genero, publicado, colores } = req.body;

    console.log("Datos que se enviaran a la db", req.body);
    console.log("img", req.file);

    if (!req.file) {
      return res.json({
        message: `Error la imagen de la prenda es obligatoria`,
      });
    }

    const newPrenda= await PrendasModels.create({
      nombre,
      cantidad,
      precio,
      tipo_de_tela,
      imagen: req.file.filename,
      genero,
      publicado,
      
    });

    console.log('Colores',colores)

    for (let id_color of colores.split(',')) {
     await colorsPrendasmodel.create({
          fk_color:parseInt(id_color),
          fk_prenda: newPrenda.id_prenda,


          
      });
  }


    res.status(200).json({ menssage: "Prenda agregada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar prenda" });
    console.log(error);
  }
};

const update = async (req, res) => {
  try {
    const { nombre, cantidad, precio, tipo_de_tela,genero,publicado,colores} = req.body;
    const id_prenda = req.params.id;
    const prenda= await PrendasModels.findOne({
      where: {id_prenda:id_prenda}
    })


    const actualizadoPrenda = await PrendasModels.update({
      nombre,
        cantidad,
        precio,
        tipo_de_tela,
        genero,
        publicado,
    },{where: {id_prenda:id_prenda}}
    );


    if(req.file){
        const imagenPath = 'uploads/prenda/'+ prenda.imagen;
        if(imagenPath && fs.existsSync(imagenPath)){
            fs.unlink(imagenPath,(error)=>{
              if(error){
                console.error('Error al eliminar la imagen',error)
                return next();
                
              }
            });
            
        }
        prenda.imagen=req.file.filename
    }
   

    

    await colorsPrendasmodel.destroy({where:{fk_prenda: id_prenda}})

    for (let id_color of colores.split(',')) {
      await colorsPrendasmodel.create({
           fk_color:parseInt(id_color),
           fk_prenda: id_prenda,
           
       });
   }


    res.json({
      message: "Actualizacion exitosa",
    });
  } catch (error) {
    res.status(500).json({ massge: "Error al actualizar la prendas" });
    console.log(error);
  }
};

const cambiarEstado = async (req, res) => {
  try {
    const { estado } = req.body;
    const id = req.params.id;
    const prenda = await PrendasModels.findOne({ where: { id_prenda: id } });
    prenda.estado = !estado;
    prenda.save();

    res.json({ message: "Cambio el estado" });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar el estado" });
  }
};


const cambiarPublicacion = async (req, res)=>{
    try{
        const {estado}=req.body;
        const id = req.params.id

        const prenda =await PrendasModels.findOne({

            where: {id_prenda: id},

        })
        prenda.publicado=!estado
        prenda.save()

        res.json({message: 'Se cambio el estado de la publicacion de la prendas'})
    }catch (error){
        res.status(500).json({message: 'No se cambio el estado de la publicacion'})
    }
}

module.exports = { consultar, agregar, update, cambiarEstado, cambiarPublicacion};