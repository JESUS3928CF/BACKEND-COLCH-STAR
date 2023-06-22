const express = require("express");
const router = express.Router();

/// peticiones para clientes
router.get("/", (req, res) => {
    res.status(200).send("Desde Clientes ...");
    console.log("Porque no puedo llegar aquí");
});

module.exports = router;