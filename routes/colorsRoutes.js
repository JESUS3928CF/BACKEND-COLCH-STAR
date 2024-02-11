const express = require('express')
const {consult,addColors,updateColors} = require('../controllers/ColorsController.js')
const { checkAut } = require("../middleware/authMidlleware");
const router= express.Router()

router.get('/', consult);
router.post('/', checkAut,addColors)
router.put('/:id',checkAut,updateColors)


module.exports= router