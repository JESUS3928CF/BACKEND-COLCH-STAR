const express = require('express');
const { consultar } = require('../controllers/ventaController');


const router = express.Router();

router.get('/', consultar);

module.exports = router;
