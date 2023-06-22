const express = require("express");
const {consultar} = require('../controllers/clienteController');
const router = express.Router();

/// peticiones para proveedor


//find
router.get('/', async(req,res)=>{

    const resultado = await service.find();

    if (resultado.length>0){
        res.status(200).send(resultado);
    }else{
        res.status(404).send("Not found")
    }
    
        
})







module.exports = router;