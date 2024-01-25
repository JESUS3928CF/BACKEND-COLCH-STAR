const { formatDate, formatMoney } = require('../helpers/formatearDatos.js');

const { OrdenesModels } = require('../models/OrdenesModel.js');
const { ClienteModels } = require('../models/ClienteModel.js');
const { ProductoModels } = require('../models/ProductoModel.js');
const { DetalleOrdenModels } = require('../models/DetalleOrdenModel.js');


const consultar = async (req, res) => {
    try {
        /// Consultando todos los registros
        const ordenes = await OrdenesModels.findAll({
            include: [
                {
                    model: ClienteModels,
                    attributes: ['nombre', 'apellido', 'identificacion', 'direccion' ],
                },
            ],
        });

        // Consultando todos los detalles orden, productos
        const detalleOrden = await DetalleOrdenModels.findAll({
            include: [
                {
                    model: ProductoModels, //modelo de productos
                    attributes: ['nombre', 'imagen'], // Selecciona los atributos que necesitas, en este caso, solo el nombre y la imagen
                },
            ],
        });



        //* Mapa para almacenar los detalles por ventas
        const detallesPorOrden = new Map();

        // * Buscar los detalles de cada venta
        detalleOrden.forEach((detalle) => {
            if (!detallesPorOrden.has(detalle.fk_orden)) {
                detallesPorOrden.set(detalle.fk_orden, []);
            }

            detallesPorOrden.get(detalle.fk_orden).push(detalle);
        });

        // Asociar detalles con cordenes
        const ordenesConDetalles = ordenes.map((orden) => {
            orden.dataValues.detalles = detallesPorOrden.get(orden.id_orden) || [];

            // Validar la fecha antes de formatear
            if (!isNaN(Date.parse(orden.fecha_entrega))) {
                orden.fecha_entrega = formatDate(orden.fecha_entrega);
            } else {
                // Manejar el caso de una fecha no válida
                console.error('Fecha no válida:', orden.fecha_entrega);
                // Puedes asignar una fecha por defecto o manejarlo de otra manera
            }

            orden.precio_total = formatMoney(orden.precio_total);

            return orden;
        });



        //- Forma de inviar un JSON
        res.status(200).json(ordenesConDetalles);
    } catch (error) {
        console.log('Error al consultar la tabla compras:', error);
        res.status(500).json({ error: 'Error al consultar la tabla compras' });
    }
};




const constOne = async (req, res) => {
    try {
        const id = req.params.id;
        const ordenesOne = await OrdenesModels.findOne({
            where: { id_orden: id },
        });

        res.status(200).json(ordenesOne);
    } catch (e) {
        res.status(500).json({ e: 'Error al consultar' });
    }
};


// //! Agregar una orden

const agregar = async (req, res) => {
    try {
        const { fecha_entrega, precio_total, estado_de_orden, fk_cliente, detallesOrdenes } =
            req.body;

        console.log(req.body);

        const ordenes = await OrdenesModels.create({
            fecha_entrega,
            precio_total,
            estado_de_orden,
            fk_cliente,
        });

        console.log(detallesOrdenes);

        let detallesOrdenesArray = detallesOrdenes;

        for (let value of detallesOrdenesArray) {
            await DetalleOrdenModels.create({
                fk_orden: ordenes.id_orden,
                cantidad: value.cantidad,
                subtotal: value.subtotal,
                descripcion: value.descripcion,
                fk_producto: value.fk_producto,
                talla: value.talla,
                color: value.color || null,
            });
        }

        /// Mensaje de respuesta
        res.json({
            message: 'Orden agregada exitosamente',
        });
    } catch (error) {
        console.log(error);
        // Envía una respuesta al cliente indicando el error
        res.status(500).json({ message: 'Error al agregar la compra' });
    }
};

// const actualizar = async (req, res) => {
//     try {
//         const { total_de_compra, fecha, fk_proveedor, DetallesCompras } =
//             req.body;
//         const id_compra = req.params.id;

//         // Verifica si la compra existe
//         const compraExistente = await CompraModels.findByPk(id_compra);

//         // Actualiza los campos de la compra
//         compraExistente.total_de_compra = total_de_compra;
//         compraExistente.fecha = fecha;
//         compraExistente.fk_proveedor = fk_proveedor;

//         // Guarda los cambios en la base de datos
//         await compraExistente.save();

//         // Actualiza o agrega nuevos detalles de la compra
//         for (let value of DetallesCompras) {
//             if (value.id_detalle_compra) {
//                 // Si tiene un ID, intenta actualizar el detalle existente
//                 const detalleCompraExistente =
//                     await DetalleCompraModels.findByPk(value.id_detalle_compra);

//                 if (!detalleCompraExistente) {
//                     // Trata el caso donde el detalle de compra no existe
//                     console.log(
//                         `El detalle de compra con ID ${value.id_detalle_compra} no existe.`
//                     );
//                     continue;
//                 }

//                 // Actualiza los campos del detalle de compra
//                 detalleCompraExistente.cantidad = value.cantidad;
//                 detalleCompraExistente.precio = value.precio;
//                 detalleCompraExistente.diseno = value.diseno;
//                 detalleCompraExistente.fk_prenda = value.fk_prenda;

//                 // Guarda los cambios en la base de datos
//                 await detalleCompraExistente.save();
//             } else {
//                 // Si no tiene un ID, crea un nuevo detalle de compra
//                 await DetalleCompraModels.create({
//                     fk_compra: id_compra,
//                     cantidad: value.cantidad,
//                     precio: value.precio,
//                     diseno: value.diseno,
//                     fk_prenda: value.fk_prenda,
//                 });
//             }
//         }

//         // Mensaje de respuesta
//         res.json({
//             message: 'Compra actualizada exitosamente',
//         });
//     } catch (error) {
//         console.error(error);
//         // Envía una respuesta al cliente indicando el error
//         res.status(500).json({ message: 'Error al actualizar la compra' });
//     }
// };

// //! Actualizar una compra

// const cambiarEstado = async (req, res) => {
//     try {
//         console.log('Se hizo una estado');
//         const { estado } = req.body;

//         console.log('actualizar esto');
//         const id = req.params.id;
//         console.log(id);

//         const compra = await CompraModels.findOne({
//             where: { id_compra: id },
//         });
//         // Actualizar los valores del registro
//         compra.estado = !estado;

//         compra.save();

//         res.json({ message: 'Cambio de estado' });
//     } catch (error) {
//         res.status(500).json({ message: 'no se cambio el estado' });
//     }
// };

module.exports = { consultar, constOne, agregar };
