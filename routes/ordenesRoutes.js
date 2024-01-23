const express = require("express");
const {consultar, agregar, actualizar } = require('../controllers/ordenesController');
const router = express.Router();


//* Find all
router.get("/", consultar );

//* Insert One
router.post("/", agregar );

//* Update
router.patch('/:id', actualizar);



module.exports = router;