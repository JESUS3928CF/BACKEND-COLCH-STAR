const express = require('express')
const {consultar,agregar,update,cambiarEstado,cambiarPublicacion,consultarOne}= require('../controllers/prendasControllers.js')
const router = express.Router()
const {subirArchivoPrenda} = require('../middleware/subirArchivoMiddleware.js')



router.get('/',consultar);
router.get('/:id',consultarOne)
router.post('/',subirArchivoPrenda,agregar);
router.put('/:id',subirArchivoPrenda,update);
router.patch('/estado/:id' , cambiarEstado)
router.patch('/publicado/:id' , cambiarPublicacion)


module.exports= router