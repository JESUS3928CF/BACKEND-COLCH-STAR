const { error } = require("console");
const { PrendasModels } = require("../models/PrendasModel.js");
const fs = require("fs");

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
    const { nombre, cantidad, precio, tipo_de_tela, genero } = req.body;

    console.log("Datos que se enviaran a la db", req.body);
    console.log("img", req.file);

    if (!req.file) {
      return res.json({
        message: `Error la imajen de la prenda es obligatoria`,
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
    });

    res.status(200).json({ menssage: "Prenda agregada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar prenda" });
    console.log(error);
  }
};

const update = async (req, res) => {
  try {
    const { nombre, cantidad, precio, tipo_de_tela,genero } = req.body;
    const id = req.params.id;

    const prenda = await PrendasModels.findOne({
      where: { id_prenda: id },
    });

    prenda.nombre = nombre;
    prenda.cantidad = cantidad;
    prenda.precio = precio;
    prenda.tipo_de_tela = tipo_de_tela;
    prenda.imagen = imagen;
    prenda.genero = genero;

    if(req.file){
        const imagenPath = 'uploads/prendas/'+ prenda.imagen;
        if(imagenPath && fs.existsSync(imagenPath)){
            fs.unlink(imagenPath,(error)=>{
                console.log('Error al eliminar la imagen')
            });
            return nextTick();
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

module.exports = { consultar, agregar, update, cambiarEstado };
