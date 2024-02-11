const express = require("express");
const {consultar, agregar, actualizar, cambiarEstado} = require('../controllers/proveedorController');

const router = express.Router();const { checkAut } = require("../middleware/authMidlleware");



//* Find all
router.get("/",consultar );

//* Insert One
router.post("/", checkAut,agregar );

//* Uddate
router.patch('/:id', checkAut,actualizar);

//* Cambiar estado
router.patch('/estado/:id', checkAut,cambiarEstado);


module.exports = router;

