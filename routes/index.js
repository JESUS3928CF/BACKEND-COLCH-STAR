const express = require('express');
const routerCliente = require('./clienteRoutes');
const routerProveedor = require('./proveedorRoutes');

function routerApi(app){
    const router = express.Router();
    app.use("/api", router)
    router.use('/clientes', routerCliente);
    router.use('/proveedor',routerProveedor)

}


module.exports = routerApi; 