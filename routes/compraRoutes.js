const express = require("express");
const {consultar, constOne,agregar, actualizar, cambiarEstado} = require('../controllers/compraController');
const { checkAut } = require("../middleware/authMidlleware");

const router = express.Router();
 
/// peticiones para clientes

//* Find all
router.get("/", consultar );

//* Insert One
router.post("/",checkAut, agregar );

//* Update
router.patch('/:id', checkAut,actualizar);

//* Cambiar estado
router.patch('/estado/:id', checkAut,cambiarEstado);

module.exports = router;