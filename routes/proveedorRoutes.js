const express = require("express");
const {consu, agregar, actualizar, cambiarEstado} = require('../controllers/proveedorController');
const router = express.Router();

/// peticiones para Proveedor
router.get("/", consu );


//* Insert One
router.post("/", agregar );

//* Uddate
router.patch('/:id', actualizar);

//* Cambiar estado
router.patch('/estado/:id', cambiarEstado);


module.exports = router;




