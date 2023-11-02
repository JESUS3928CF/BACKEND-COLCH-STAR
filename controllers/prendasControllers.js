const { PrendasModels } = require("../models/PrendasModel.js");
const fs = require("fs");


const consultarOne= async ( req, res) =>{

  try{

    const id = req.params.id

    const prendasOne =await PrendasModels.findOne({where: {id_prenda:id}});
    res.status(200).json(prendasOne)
  } catch(e){
    console.log("error a consultar la tabla prendas:", e);
    res.status(500).json({ e: "Error al consultar la tabla prendas" });
  }


}

const consultar = async (req, res) => {
  try {
    //Consulatr los registros de las prendas
    const prendas = await PrendasModels.findAll();
    res.status(200).json(prendas);
  } catch (error) {
    console.log("error a consultar la tabla prendas:", error);
    res.status(500).json({ error: "Error al consultar la tabla prendas" });
  }
};

//Agregar una prenda

const agregar = async (req, res) => {
  try {
    const { nombre, cantidad, precio, tipo_de_tela, genero, publicado } = req.body;

    console.log("Datos que se enviaran a la db", req.body);
    console.log("img", req.file);

    if (!req.file) {
      return res.json({
        message: `Error la imagen de la prenda es obligatoria`,
      });
    }
    console.log(req.body);

    await PrendasModels.create({
      nombre,
      cantidad,
      precio,
      tipo_de_tela,
      imagen: req.file.filename,
      genero,
      publicado
    });

    res.status(200).json({ menssage: "Prenda agregada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar prenda" });
    console.log(error);
  }
};

const update = async (req, res) => {
  try {
    const { nombre, cantidad, precio, tipo_de_tela,genero,publicado} = req.body;
    const id = req.params.id;
    console.log(id)
    const prenda = await PrendasModels.findOne({
      where: { id_prenda: id },
    });

    prenda.nombre = nombre;
    prenda.cantidad = cantidad;
    prenda.precio = precio;
    prenda.tipo_de_tela = tipo_de_tela;
    prenda.genero = genero;
    prenda.publicado=publicado;

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

    prenda.save()

   


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

module.exports = { consultar, agregar, update, cambiarEstado, cambiarPublicacion, consultarOne};
