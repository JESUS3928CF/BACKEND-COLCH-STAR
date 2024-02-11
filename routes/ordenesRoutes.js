const express = require("express");
const {
    consultar,
    agregar,
    cambiarEstadoOrden,
    actualizar,
} = require('../controllers/ordenesController');
const { checkAut } = require("../middleware/authMidlleware");

const router = express.Router();


//* Find all
router.get("/", consultar );

//* Insert One
router.post("/",checkAut, agregar );

//* Update One State
router.patch('/:id',checkAut, actualizar );


//* Update One State
router.patch('/estado/:id',checkAut, cambiarEstadoOrden );


module.exports = router;