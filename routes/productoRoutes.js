const express = require("express");
const {consultar, agregar, actualizar, cambiarEstado, cambiarPublicacion} = require('../controllers/productoController');
const { subirArchivoProducto } = require("../middleware/subirArchivoMiddleware");
const router = express.Router();


//* Find all
router.get("/", consultar );

//* Insert One
router.post("/",subirArchivoProducto, agregar );

//* Update
router.patch('/:id',subirArchivoProducto, actualizar);

//* Cambiar estado
router.patch('/estado/:id', cambiarEstado);
//* Cambiar estado
router.patch('/publicado/:id', cambiarPublicacion);


module.exports = router;

