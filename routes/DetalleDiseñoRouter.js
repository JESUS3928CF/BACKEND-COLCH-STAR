const express = require("express");
const {consultar } = require('../controllers/DetalleDiseñoController');
const router = express.Router();


//* Find all
router.get("/", consultar );

// //* Insert One
// router.post("/", agregar );

// //* Uddate
// router.patch('/:id', actualizar);

// //* Cambiar estado
// router.patch('/estado/:id', cambiarEstado);


module.exports = router;

