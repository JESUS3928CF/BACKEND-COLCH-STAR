const express= require('express')
const {consult,addPrendaColor} = require('../controllers/colorPrendaController')
const router = express.Router()

router.get("/",consult)
router.post("/",addPrendaColor)


module.exports=router