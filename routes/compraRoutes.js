const express = require("express");
const {consultar, constOne,agregar, actualizar, cambiarEstado} = require('../controllers/compraController');
const router = express.Router();
 
/// peticiones para clientes

//* Find all
router.get("/", consultar );

//* Insert One
router.post("/", agregar );

//* Update
router.patch('/:id', actualizar);

//* Cambiar estado
router.patch('/estado/:id', cambiarEstado);

module.exports = router;