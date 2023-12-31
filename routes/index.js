const express = require('express');

const routerCliente = require('./clienteRoutes');
const routerProveedor = require('./proveedorRoutes');
const routerProducto = require('./productoRoutes');
const routerUsuario = require('./usuarioRoutes');
const routerVenta = require('./ventaRoutes');
const routerPrendas = require('./prendasRouter')
const routerDiseno = require('./disenoRoutes');
const routerPrecioDiseno = require('./precioDisenoRoutes');
const routerRol = require('./rolRoutes');
const routerColors= require('./colorsRoutes')
const routerDetalleDiseno = require('./DetalleDiseñoRouter')
const routerTallas= require('./tallasRouter')
const routerPrendasColors = require('./colorsPrendasrouter')
const routerCompra = require('./compraRoutes')
const routerCompraDetalles = require('./compraDetallesRouter')

const { checkAut } = require('../middleware/authMidlleware');

function routerApi(app){
    const router = express.Router();
    app.use("/api", router)
    router.use('/clientes', routerCliente);
    router.use('/proveedores', routerProveedor);
    router.use('/productos', routerProducto);
    router.use('/usuarios', routerUsuario);
    router.use('/ventas', routerVenta);
    router.use('/prendas',routerPrendas)
    router.use('/disenos',routerDiseno);
    router.use('/precio_disenos', routerPrecioDiseno);
    router.use('/rol' , checkAut , routerRol);
    router.use('/colors',routerColors)
    router.use('/detalle_diseno',routerDetalleDiseno)
    router.use('/tallas', routerTallas)
    router.use('/colorsPrendas', routerPrendasColors)
    router.use('/compras', checkAut , routerCompra)
    router.use('/compraDetalles',routerCompraDetalles)

}


module.exports = routerApi; 