const express = require('express')
const {consultTalla}=require('../controllers/TallasController.js')
const router = express.Router()

router.get('/',consultTalla)

module.exports= router