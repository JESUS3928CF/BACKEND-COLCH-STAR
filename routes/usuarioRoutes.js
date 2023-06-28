const express = require("express");
const {consultar, agregar, actualizar, cambiarEstado, consultarRegistro} = require('../controllers/usuarioController');
const router = express.Router();

/// peticiones para clientes

//* Find one
router.get("/findOne/:id", consultarRegistro );

//* Find all
router.get("/", consultar );

//* Insert One
router.post("/", agregar );


router.patch('/:id', actualizar);


//* Cambiar estado
router.patch('/estado/:id', cambiarEstado);


module.exports = router;