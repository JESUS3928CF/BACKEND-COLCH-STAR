const express = require('express');
const {
    consultar,
    actualizar,
} = require('../controllers/precioDisenoController');
const { checkAut } = require("../middleware/authMidlleware");
const router = express.Router();

/// peticiones para diseños

//* Find all
router.get('/', consultar);

//* Update parcial element
router.put('/:id',checkAut, actualizar);

module.exports = router;
