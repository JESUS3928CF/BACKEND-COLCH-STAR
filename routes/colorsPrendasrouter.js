const express = require("express");
const {consultPrendasColors}= require('../controllers/prendasColorsController')
const router = express.Router()


router.get('/',consultPrendasColors)

module.exports=router
