const express = require("express");
const db = require("./config/db");
const cors = require('cors');
const dotenv = require('dotenv/config');
const routerApi = require("./routes/index");
const bodyParser = require("body-parser");


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


db.authenticate()
    .then(() => { console.log("Base de datos conectada") })
    .catch(error => { console.log(error)});


const port = process.env.PORT || 4000;

///Middlewares
app.use(cors());

routerApi(app);

app.get("/api", (req, res) => {
    res.status(200).send('API DE COLCH STAR');
});

app.use('/*', (req, res) => {
    res.status(404).send('Paso algo inesperado');
});

app.listen(port, () => {
    console.log(`Servidor funcionando en http://localhost:${port}`);
});
