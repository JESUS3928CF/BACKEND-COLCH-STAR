const express = require('express');
const { consultar, agregar, actualizar , cambiarEstado } = require('../controllers/ventaController');
const { checkAut } = require("../middleware/authMidlleware");



const router = express.Router();

router.get('/', consultar);

router.post('/',checkAut, agregar);

router.patch('/:id', checkAut, actualizar )

router.patch('/estado/:id', checkAut, cambiarEstado);

module.exports = router;
