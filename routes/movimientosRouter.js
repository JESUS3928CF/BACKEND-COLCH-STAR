const express = require('express')
const {consultar, agregar} = require('../controllers/movimientosController')
const router = express.Router()


router.get('/',consultar)
router.post('/',agregar)

module.exports=router;