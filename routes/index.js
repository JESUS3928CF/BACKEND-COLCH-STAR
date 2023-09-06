const express = require('express');
const routerCliente = require('./clienteRoutes');
const routerProveedor = require('./proveedorRoutes');
const routerUsuario = require('./usuarioRoutes');
const routerVenta = require('./ventaRoutes');

function routerApi(app){
    const router = express.Router();
    app.use("/api", router)
    router.use('/clientes', routerCliente);
    router.use('/proveedores', routerProveedor);
    router.use('/usuarios', routerUsuario);
    router.use('/ventas', routerVenta);

}


module.exports = routerApi; 