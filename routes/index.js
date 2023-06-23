const express = require('express');
const routerCliente = require('./clienteRoutes');
const routerProveedor = require('./proveedorRoutes');
const routerUsuario = require('./usuarioRoutes');

function routerApi(app){
    const router = express.Router();
    app.use("/api", router)
    router.use('/clientes', routerCliente);
    router.use('/proveedor', routerProveedor);
    router.use('/usuario', routerUsuario)

}


module.exports = routerApi; 