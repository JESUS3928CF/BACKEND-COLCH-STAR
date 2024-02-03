const express = require("express");
const {
    consultar,
    agregar,
    cambiarEstadoOrden,
    actualizar,
} = require('../controllers/ordenesController');
const router = express.Router();


//* Find all
router.get("/", consultar );

//* Insert One
router.post("/", agregar );

//* Update One State
router.patch('/:id', actualizar );


//* Update One State
router.patch('/estado/:id', cambiarEstadoOrden );


module.exports = router;