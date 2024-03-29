const { formatDate, formatMoney } = require('../helpers/formatearDatos.js');

const { OrdenesModels } = require('../models/OrdenesModel.js');
const { ClienteModels } = require('../models/ClienteModel.js');
const { ProductoModels } = require('../models/ProductoModel.js');
const { DetalleOrdenModels } = require('../models/DetalleOrdenModel.js');
const { MovimientosModels } = require('../models/MovimientosModels.js');
const { PrendasModels } = require('../models/PrendasModel.js');
const { DetallePrendaModels } = require('../models/DetallePrendaModel.js');
const { colorsPrendasmodel } = require('../models/ColorsPrendasModels.js');
const { colorModels } = require('../models/colorModel.js');






const consultar = async (req, res) => {
    try {
        /// Consultando todos los registros
        const ordenes = await OrdenesModels.findAll({
            include: [
                {
                    model: ClienteModels,
                    attributes: [
                        'nombre',
                        'apellido',
                        'identificacion',
                        'direccion',
                    ],
                },
            ],
        });

        // Consultando todos los detalles orden, productos
        const detalleOrden = await DetalleOrdenModels.findAll({
            include: [
                {
                    model: ProductoModels, //modelo de productos
                    attributes: ['nombre', 'imagen', 'precio'], // Selecciona los atributos que necesitas, en este caso, solo el nombre y la imagen
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
            orden.dataValues.detalles =
                detallesPorOrden.get(orden.id_orden) || [];




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
        console.log('Error al consultar la tabla ordenes:', error);
        res.status(500).json({ error: 'Error al consultar la tabla ordenes' });
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
        const {
            fecha_entrega,
            precio_total,
            estado_de_orden,
            fk_cliente,
            detallesOrdenes,
        } = req.body;

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


        await MovimientosModels.create({ descripcion: `El usuario: ${req.usuario.nombre} Registro una nueva orden` });

        /// Mensaje de respuesta
        res.json({
            message: 'Orden agregada exitosamente',
        });
    } catch (error) {
        console.log(error);
        // Envía una respuesta al cliente indicando el error
        res.status(500).json({ message: 'Error al agregar la orden' });
    }
};

//! Editar la orden

const actualizar = async (req, res) => {
    const { fecha_entrega, precio_total, fk_cliente, detalles } =
        req.body;

    const id = req.params.id;

    try {
        const orden = await OrdenesModels.findOne({
            where: { id_orden: id },
        });

        // Actualizar los valores del registro
        orden.fk_cliente = fk_cliente;
        orden.fecha_entrega = fecha_entrega;
        orden.precio_total = precio_total;
        orden.save();

        // Elimina los detalles existentes para esta orden
        await DetalleOrdenModels.destroy({ where: { fk_orden: id } });

        // Inserta los nuevos permisos para el rol
        for (let value of detalles) {
            await DetalleOrdenModels.create({
                fk_orden: id,
                cantidad: value.cantidad,
                subtotal: value.subtotal,
                descripcion: value.descripcion,
                fk_producto: value.fk_producto,
                talla: value.talla,
                color: value.color,
            });
        }

        await MovimientosModels.create({
            descripcion: `El usuario: ${req.usuario.nombre}  actualizo la orden #${id}`,
        });

        res.json({ message: 'Orden actualizada con éxito' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al actualizar la orden' });
    }
};

// //! Actualizar una compra
// cambiar el estado de la orden
const cambiarEstadoOrden = async (req, res) => {
    try {
        console.log('Se hizo una estado');
        const { estado } = req.body;

        console.log('actualizar esto', estado);
        const id = req.params.id;
        console.log(id);

        const orden = await OrdenesModels.findOne({
            where: { id_orden: id },
        });

        if( orden.estado_de_orden == "Creada"){
            console.log("Realizar validación")
        }
        // Actualizar los valores del registro
        orden.estado_de_orden = estado;

        // aca que busque las cantidades y las reste

        const detallesOrdenes = await DetalleOrdenModels.findAll({
            where : {
                fk_orden : id
            }
        })


        

        if(estado == "Finalizada"){
            // Iterar sobre los detalles de la orden para encontrar el ID de la prenda asociada al producto
        for (let value of detallesOrdenes) {
            const productId = value.fk_producto;
            const producto = await ProductoModels.findByPk(productId);

            

            if (producto) {
                const fk_prenda = producto.fk_prenda;

                // Buscar la prenda que coincide con el nombre del producto
                // const prenda = await PrendasModels.findOne({ where: { id_prenda: fk_prenda } });


                const id_color = await colorModels.findOne( { where : {
                    color : value.color
                }})

                console.log(id_color, " el color")

                const cantidad = await DetallePrendaModels.findOne({
                    where: {
                        fk_prenda: fk_prenda,
                        color: id_color.id_color,
                        talla: value.talla,
                    },
                });

                console.log(cantidad, " cantidad a restar")

                if (cantidad) {
                    cantidad.cantidad = Number(cantidad.cantidad) - Number(value.cantidad);

                    if(cantidad.cantidad == 0) {
                        cantidad.destroy()
                    } else {
                        cantidad.save();
                    }
                }
            } else {
                console.log(`No se encontró el producto con ID ${productId}`);
            }
        }
        }

        console.log(orden);
        orden.save();
        await MovimientosModels.create({
            descripcion: `El usuario: ${req.usuario.nombre}  actualizo el estado de la orden #${id}`,
        });

        res.json({ message: 'Se cambio el estado de la orden' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'no se cambio el estado de orden' });
    }
};

module.exports = {
    consultar,
    constOne,
    agregar,
    cambiarEstadoOrden,
    actualizar,
};
