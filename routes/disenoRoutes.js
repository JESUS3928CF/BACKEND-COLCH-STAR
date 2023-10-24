const express = require("express");
const {consultar, agregar, actualizar, cambiarEstado} = require('../controllers/disenoController.js');
const router = express.Router();

/// peticiones para diseños

//* Find all
router.get("/", consultar );

//* Insert One
router.post("/", agregar );

//* Update
// router.patch('/:id', actualizar);

//* Cambiar estado
// router.patch('/estado/:id', cambiarEstado);

module.exports = router;