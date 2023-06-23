const express = require("express");
const {consultar, agregar, actualizar, cambiarEstado} = require('../controllers/usuarioController');
const router = express.Router();

/// peticiones para clientes

//* Find all
router.get("/", consultar );

//* Insert One
router.post("/", agregar );


router.patch('/:id', actualizar);


//* Cambiar estado
router.patch('/estado/:id', cambiarEstado);


module.exports = router;