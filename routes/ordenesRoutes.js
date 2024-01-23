const express = require("express");
const {consultar } = require('../controllers/ordenesController');
const router = express.Router();


//* Find all
router.get("/", consultar );





module.exports = router;