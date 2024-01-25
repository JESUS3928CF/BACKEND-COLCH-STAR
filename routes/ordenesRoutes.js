const express = require("express");
const {consultar, agregar } = require('../controllers/ordenesController');
const router = express.Router();


//* Find all
router.get("/", consultar );

//* Insert One
router.post("/", agregar );





module.exports = router;