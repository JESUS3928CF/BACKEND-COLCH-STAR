const {PrendasModels}= require('../models/PrendasModel.js')



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


        const{nombre,cantidad,precio,tipo_de_tela,imagen,genero}= req.body
        console.log(req.body)
        const prendas = await PrendasModels.create(
            {nombre:nombre,cantidad,precio,tipo_de_tela,imagen,genero});
            
        res.status(200).json({menssage:'Prenda agregada exitosamente'})
        console.log(prendas)
    } catch(error){
        res.status(500).json({message: 'Error al agregar prenda'})
        console.log(error)
    }

};


const update= async(req,res)=>{
    try{
        const{nombre,cantidad,precio,tipo_de_tela,imagen,genero}=req.body
        const id = req.params.id

        const prenda = await PrendasModels.findOne({
            where:{id_prenda:id},
        });

        //Actualiza los valores registrados
        prenda.nombre= nombre;
        prenda.cantidad=cantidad;
        prenda.precio=precio;
        prenda.tipo_de_tela=tipo_de_tela;
        prenda.imagen=imagen;
        prenda.genero=genero;

        prenda.save();

        res.json({
            message:'Actualizacion exitosa'
        });

    } catch (error){
        res.status(500).json({massge: 'Error al actualizar la prendas'})
        console.log(error)
    }
}


const cambiarEstado= async(req, res)=>{

    try{

        const {estado}= req.body;
        const id = req.params.id
        const prenda= await PrendasModels.findOne(
            {where: { id_prenda:id} }); 
        prenda.estado=!estado;
        prenda.save()

        res.json({message:'Cambio el estado'})
    }catch(error){
        res.status(500).json({message: 'Error al cambiar el estado'})
    }
}

module.exports={consultar,agregar,update,cambiarEstado};
