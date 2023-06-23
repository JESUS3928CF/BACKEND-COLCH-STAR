const express = require("express");
const {consu} = require('../controllers/proveedorController');
const router = express.Router();

/// peticiones para Proveedor
router.get("/", consu );

module.exports = router;