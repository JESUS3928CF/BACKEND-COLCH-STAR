const express = require('express')
const {consultar,agregar,update,cambiarEstado,cambiarPublicacion}= require('../controllers/prendasControllers.js')
const router = express.Router()
const {subirArchivoPrenda} = require('../middleware/subirArchivoMiddleware.js')
const { checkAut } = require("../middleware/authMidlleware");




router.get('/',consultar);
router.post('/',checkAut,subirArchivoPrenda,agregar);
router.put('/:id',checkAut,subirArchivoPrenda,update);
router.patch('/estado/:id' , checkAut,cambiarEstado)
router.patch('/publicado/:id' , checkAut,cambiarPublicacion)


module.exports= router