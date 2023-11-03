const express= require('express')
const {consult} = require('../controllers/colorPrendaController')
const router = express.Router()

router.get("/",consult)


module.exports=router