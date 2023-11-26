const express= require('express')
const router =  express.Router()
const {consult, agregar, actualizar} = require('../controllers/comprasDetallesController')


router.get('/',consult);

//* Insert One
router.post("/", agregar );

//* Update
router.patch('/:id', actualizar);

module.exports = router