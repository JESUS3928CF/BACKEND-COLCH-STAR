const express = require("express");
const {consultar, agregar, actualizar, cambiarEstado, cambiarPublicacion} = require('../controllers/productoController');
const { subirArchivoProducto } = require("../middleware/subirArchivoMiddleware");
const router = express.Router();
const { checkAut } = require("../middleware/authMidlleware");



//* Find all
router.get("/", consultar );

//* Insert One
router.post("/",checkAut,subirArchivoProducto, agregar );

//* Update
router.patch('/:id',checkAut,subirArchivoProducto, actualizar);

//* Cambiar estado
router.patch('/estado/:id', checkAut,cambiarEstado);
//* Cambiar estado
router.patch('/publicado/:id', checkAut,cambiarPublicacion);


module.exports = router;

