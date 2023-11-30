const express= require('express')
const router =  express.Router()
const {consult, constOne, agregar, actualizar} = require('../controllers/comprasDetallesController')


router.get('/',consult);
router.get('/:id', constOne);


//* Insert One
router.post("/", agregar );

//* Update
router.patch('/:id', actualizar);

module.exports = router