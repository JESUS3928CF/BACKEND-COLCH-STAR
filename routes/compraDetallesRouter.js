const express= require('express')
const router =  express.Router()
const {consult} = require('../controllers/comprasDetallesController')


router.get('/',consult);


module.exports =router