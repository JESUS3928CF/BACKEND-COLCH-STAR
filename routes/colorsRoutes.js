const express = require('express')
const {consult,addColors,updateColors} = require('../controllers/ColorsController.js')
const router= express.Router()

router.get('/', consult);
router.post('/', addColors)
router.put('/:id',updateColors)


module.exports= router