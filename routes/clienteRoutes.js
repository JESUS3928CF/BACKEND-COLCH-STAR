const express = require("express");
const {consultar, agregar, actualizar} = require('../controllers/clienteController');
const router = express.Router();

/// peticiones para clientes

//* Find all
router.get("/", consultar );

//* Insert One
router.post("/", agregar );


router.patch('/:id', actualizar);



module.exports = router;