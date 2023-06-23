const express = require("express");
const {consultar, agregar} = require('../controllers/clienteController');
const router = express.Router();

/// peticiones para clientes

//* Find all
router.get("/", consultar );

//* Insert One
router.post("/", agregar );


module.exports = router;