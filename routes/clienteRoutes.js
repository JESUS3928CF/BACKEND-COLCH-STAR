const express = require("express");
const {consultar} = require('../controllers/clienteController');
const router = express.Router();

/// peticiones para clientes
router.get("/", consultar );

module.exports = router;