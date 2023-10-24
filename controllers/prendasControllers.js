const {PrendasModels} = require('../models/PrendasModel');

const consultar = async (req,res)=>{
    try{
        //Consulatr los registros de las prendas
        const prendas = await PrendasModels.findAll();
        res.status(200).json(prendas);

    }catch (error){
        console.log("error a consultar la tabla prendas:", error)
        res.status(500).json({error:'Error al consultar la tabla prendas'})

    };

};

//Agregar una prenda

const agregar = async(req,res)=>{
    try{
        const{nombre,cantidad,precio,tipo_tela,imagen,genero}=req.body;

        await PrendasModels.create(
            {nombre,cantidad,precio,tipo_tela,imagen,genero});
        res.status(200).json({menssage:'Prenda agregada exitosamente'})
    } catch(error){
        res.status(500).json({message: 'Error al agregar prenda'})
    }

};


const update= async(req,res)=>{
    try{
        const{nombre,cantidad,precio,tipo_tela,imagen,genero}=req.body
        const id = req.params.id

        const prenda = await PrendasModels.finOne({
            where:{id_prenda:id},
        });

        //Actualiza los valores registrados
        prenda.nombre= nombre;
        prenda.cantidad=cantidad;
        prenda.precio=precio;
        prenda.tipo_tela=tipo_tela;
        prenda.imagen=imagen;
        prenda.genero=genero;

        prenda.save();

        res.json({
            message:'Actualizacion exitosa'
        });

    } catch (error){
        res.status(500).json({massge: 'Error al actualizar la prendas'})
    }
}


const cambiarEstado= async(req, res)=>{

    try{

        const {estado}= req.body;
        const id = req.params.id
        const prenda= await PrendasModels.finOne({where: { id_prenda:id} }); 
        prenda.estado=!estado;
        prenda.save()

        res.json({message:'Cambio el estado'})
    }catch(error){
        res.status(500).json({message: 'Error al cambiar el estado'})
    }
}

module.exports={consultar,agregar,update,cambiarEstado};
