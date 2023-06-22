const express = require('express');
const routerCliente = require('./clienteRoutes');

function routerApi(app){
    const router = express.Router();
    app.use("/api", router)
    router.use('/clientes', routerCliente);

}


module.exports = routerApi; 