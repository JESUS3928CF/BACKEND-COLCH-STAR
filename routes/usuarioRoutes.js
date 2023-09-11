const express = require("express");
const {consultar, agregar, actualizar, cambiarEstado, login, actualizarContrasena} = require('../controllers/usuarioController');
const router = express.Router();

/// peticiones para clientes

//* Find one
router.post("/login", login );

//* Find all
router.get("/", consultar );

//* Insert One
router.post("/", agregar );

//* actualizar
router.patch('/:id', actualizar);


//* actualizar
router.patch('/cambiarContrasena/:id', actualizarContrasena);


//* Cambiar estado
router.patch('/estado/:id', cambiarEstado);


module.exports = router;