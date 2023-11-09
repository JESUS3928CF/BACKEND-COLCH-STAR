const express = require('express')
const {consultar,agregar,update,cambiarEstado,cambiarPublicacion}= require('../controllers/prendasControllers.js')
const router = express.Router()
const {subirArchivoPrenda} = require('../middleware/subirArchivoMiddleware.js')



router.get('/',consultar);
router.post('/',subirArchivoPrenda,agregar);
router.put('/:id',subirArchivoPrenda,update);
router.patch('/estado/:id' , cambiarEstado)
router.patch('/publicado/:id' , cambiarPublicacion)


module.exports= router