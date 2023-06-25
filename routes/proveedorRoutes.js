const express = require("express");
const {consu, agregar, actualizar, cambiarEstado} = require('../controllers/proveedorController');
const router = express.Router();


//* Find all
router.get("/", consu );

//* Insert One
router.post("/", agregar );

//* Uddate
router.patch('/:id', actualizar);

//* Cambiar estado
router.patch('/estado/:id', cambiarEstado);


module.exports = router;




