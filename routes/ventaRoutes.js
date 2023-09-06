const express = require('express');
const { consultar, agregar, actualizar , cambiarEstado } = require('../controllers/ventaController');


const router = express.Router();

router.get('/', consultar);

router.post('/', agregar);

router.patch('/:id', actualizar )

router.patch('/estado/:id', cambiarEstado);

module.exports = router;
