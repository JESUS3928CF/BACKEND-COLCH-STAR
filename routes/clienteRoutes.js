const express = require("express");
const {consultar, agregar, actualizar, cambiarEstado} = require('../controllers/clienteController');
const { checkAut } = require("../middleware/authMidlleware");
const router = express.Router();

/// peticiones para clientes

//* Find all
router.get("/",checkAut, consultar );

//* Insert One
router.post("/",checkAut, agregar );

//* Update
router.patch('/:id',checkAut, actualizar);

//* Cambiar estado
router.patch('/estado/:id',checkAut, cambiarEstado);

module.exports = router;