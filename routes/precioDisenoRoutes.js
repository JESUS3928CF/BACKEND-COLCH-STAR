const express = require('express');
const {
    consultar,
    actualizar,
} = require('../controllers/precioDisenoController');
const router = express.Router();

/// peticiones para diseños

//* Find all
router.get('/', consultar);

//* Update parcial element
router.put('/:id', actualizar);

module.exports = router;
