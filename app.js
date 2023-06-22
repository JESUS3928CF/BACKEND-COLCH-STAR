const express = require("express");
const db = require("./config/db");

const app = express();

db.authenticate()
    .then( () => { console.log("Base de datos conectada") })
        .catch( error => { console.log(error)});

port = 3000;

app.use("/", (req, res) => {
    res.send("Hola Mundo");
});


app.listen(port, () => {
    console.log(`Servidor funcionando en http://localhost:${port}`);
});
