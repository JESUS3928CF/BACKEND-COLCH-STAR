const express = require('express')


const {consultar,agregar,update,cambiarEstado}= require('../controllers/prendasControllers.js')


const router = express.Router()
router.use(express.urlencoded({extended: true}))



router.get('/',consultar);
router.post('/',agregar);
router.patch('/:id',update);
router.patch('/estado/:id', cambiarEstado)

module.exports= router