const express = require("express");
const db = require("./config/db");
// const clienteRoutes = require('./routes/clienteRoutes');
// const proveedorRoutes = require('./routes/proveedorRoutes');
const dotenv = require('dotenv/config');
const routerApi = require("./routes/index");


const app = express();




db.authenticate()
    .then( () => { console.log("Base de datos conectada") })
        .catch( error => { console.log(error)});


port = process.env.PORT || 4000;


// app.use("/api/clientes", clienteRoutes);
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




