const express = require("express");
const {consultar, agregar, actualizar, cambiarEstado} = require('../controllers/rolController');
const { checkAut } = require("../middleware/authMidlleware");
const router = express.Router();

/// peticiones para roles

//* Find all
router.get('/' , consultar);

//* Insert One
router.post('/', agregar);

//* Update
router.patch('/:id', actualizar);

//* Cambiar estado
router.patch('/estado/:id', cambiarEstado);

module.exports = router;