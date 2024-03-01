const { DetalleDiseñoModels } = require('../models/DetalleDiseñoModel');
const { DisenoModels } = require('../models/DisenoModel');
const { PrecioDisenoModels } = require('../models/PrecioDisenoModel');
const { PrendasModels } = require('../models/PrendasModel');
const { ProductoModels } = require('../models/ProductoModel');
const {
    formatMoney,
    capitalizarPrimeraLetras,
} = require('../helpers/formatearDatos.js');
const fs = require('fs');
const { MovimientosModels } = require('../models/MovimientosModels.js');
const {
    consultar: consultarPrendas,
} = require('../controllers/prendasControllers');
const { TallaModels } = require('../models/TallaModel.js');
const { colorModels } = require('../models/colorModel.js');
const { colorsPrendasmodel } = require('../models/ColorsPrendasModels.js');

const consultar = async (req, res) => {
    try {
        /// Consultando todos los registros
        const productos = await ProductoModels.findAll({
            include: [
                {
                    model: PrendasModels, // Modelo de Prendas
                    attributes: [
                        'imagen',
                        'nombre',
                        'precio',
                        'genero',
                        'tipo_de_tela',
                    ], // Selecciona los atributos que necesitas, en este caso, solo la imagen
                },
            ],
        });

        const Tallas = await TallaModels.findAll();
        const colors = await colorModels.findAll();
        const colorsPrenda = await colorsPrendasmodel.findAll();

        const TablaIntermedia = new Map();
        const tallas = new Map();
        const nombreColors = new Map();

        Tallas.forEach((talla) => {
            if (!tallas.has(talla.fk_prenda)) {
                tallas.set(talla.fk_prenda, []);
            }
            tallas.get(talla.fk_prenda).push(talla.talla);
        });

        colors.forEach((color) => {
            if (!nombreColors.has(color.id_color)) {
                nombreColors.set(color.id_color, []);
            }
            nombreColors.get(color.id_color).push({
                color: color.color,
                id_color: color.id_color,
                codigo: color.codigo,
            });
        });

        colorsPrenda.forEach((fk_color) => {
            if (!TablaIntermedia.has(fk_color.fk_prenda)) {
                TablaIntermedia.set(fk_color.fk_prenda, []);
            }
            TablaIntermedia.get(fk_color.fk_prenda).push(fk_color.fk_color);
        });

        console.log(TablaIntermedia, ' map tabla');

        /// Consultando los diseños
        const detalle_diseno = await DetalleDiseñoModels.findAll({
            include: [
                {
                    model: DisenoModels, // Modelo de Prendas
                    attributes: ['id_diseno', 'imagen', 'nombre'], // Selecciona los atributos que necesitas, en este caso, solo la imagen
                },
                {
                    model: PrecioDisenoModels, // Modelo de Prendas
                    attributes: ['id_precio_diseno', 'tamano', 'precio'], // Selecciona los atributos que necesitas, en este caso, solo la imagen
                },
            ],
        });

        const productosConDisenos = new Map();

        detalle_diseno.forEach((diseno) => {
            if (!productosConDisenos.has(diseno.fk_producto)) {
                productosConDisenos.set(diseno.fk_producto, []);
            }

            productosConDisenos.get(diseno.fk_producto).push({
                id_diseno: diseno.diseno.id_diseno,
                nombre: diseno.diseno.nombre,
                imagen: diseno.diseno.imagen,
                id_precio_diseno: diseno.precio_diseno.id_precio_diseno,
                precio: diseno.precio_diseno.precio,
                tamano: diseno.precio_diseno.tamano,
            });
        });

        //- Forma de inviar un JSON-
        // res.status(200).json(productos);
        const productoConDisenos = productos.map((producto) => ({
            id_producto: producto.id_producto,
            nombre: producto.nombre,
            // cantidad: producto.cantidad,
            precio: formatMoney(producto.precio),
            estado: producto.estado,
            imagen: producto.imagen,
            publicado: producto.publicado,
            fk_prenda: producto.fk_prenda,
            prenda: producto.prenda,
            disenos: productosConDisenos.get(producto.id_producto) || [],
            tallas: tallas.get(producto.fk_prenda) || [],
            colores: (() => {
                const result = [];
                const tablaIntermediaData = TablaIntermedia.get(
                    producto.fk_prenda
                );
                if (tablaIntermediaData) {
                    tablaIntermediaData.forEach((fk_color) => {
                        result.push(...(nombreColors.get(fk_color) || []));
                    });
                } else {
                    console.log(
                        'La tabla intermedia no contiene datos para el producto'
                    );
                }
                return result || [];
            })(),
        }));

        res.status(200).json(productoConDisenos);
    } catch (error) {
        console.log('Error al consultar la tabla producto:', error);
        res.status(500).json({ error: 'Error al consultar la tabla producto' });
    }
};

//! Agregar producto

const agregar = async (req, res) => {
    try {
        // cantidad
        const { nombre, fk_prenda, publicado, disenos } = req.body;
        console.log(req.file);
        if (!req.file) {
            return res.json({
                message: `Error la imagen del diseño es requerida`,
            });
        }

        // Verificar si el nombre ya está ocupado
        const nombreOcupado = await ProductoModels.findOne({
            where: { nombre: capitalizarPrimeraLetras(nombre) },
        });

        if (nombreOcupado) {
            return res.status(403).json({
                message: 'Ya existe este Producto',
                nombreOcupado,
            });
        }

        //! Obtener el precio de la prenda
        const prenda = await PrendasModels.findByPk(fk_prenda);
        const precioPrenda = parseFloat(prenda.precio);

        //! Calcular el precio total sumando el precio de la prenda y los precios de los diseños
        const disenosArray = JSON.parse(disenos);

        const promises = disenosArray.map(async (value) => {
            // Obtener el precio de cada diseño
            const precioDiseno = await PrecioDisenoModels.findByPk(
                value.id_precio_diseno
            );
            return parseFloat(precioDiseno.precio);
        });

        const preciosDiseños = await Promise.all(promises);
        const precioTotal = preciosDiseños.reduce(
            (total, precio) => total + precio,
            precioPrenda
        );

        // //CONDICIONAL PARA VALIDAR LAS UNIDADES EN STOCK SI HAY LAS SUFICIENTES LO DEJA GUARDAR SI NO MANDA ELMMESJAE
        // if (fk_prenda) {
        //     const prenda = await PrendasModels.findOne({
        //         where: { id_prenda: fk_prenda },
        //     });

        //     const resultado = Number(prenda.cantidad) - Number(cantidad);

        //     // Verificar si la cantidad resultante es menor que cero
        //     if (resultado < 0) {
        //         return res.status(404).json({
        //             message: 'No hay suficientes unidades en stock',
        //             resultado,
        //         });
        //     }

        //     prenda.cantidad = resultado;
        //     prenda.save();

        // }

        //! Insertar un nuevo producto en la base de datos
        const nuevoProducto = await ProductoModels.create({
            nombre: capitalizarPrimeraLetras(nombre),
            // cantidad,
            precio: precioTotal, // Utilizar el precio total calculado
            imagen: req.file.filename,
            fk_prenda,
            publicado,
        });

        for (let value of disenosArray) {
            await DetalleDiseñoModels.create({
                fk_producto: nuevoProducto.id_producto,
                fk_diseno: value.id_diseno,
                fk_precio_diseno: value.id_precio_diseno,
            });
        }

        await MovimientosModels.create({
            descripcion: `El usuario: ${req.usuario.nombre} registro un nuevo producto`,
        });

        /// Mensaje de respuesta
        res.json({
            message: 'Producto agregado exitosamente',
            nuevoProducto,
        });
    } catch (error) {
        console.log(error);
        // Envía una respuesta al cliente indicando el error
        res.status(500).json({ message: 'Error al agregar el Producto' });
    }
};

// ! Actualizar un proveedor

const actualizar = async (req, res) => {
    try {
        // cantidad,
        const { nombre, fk_prenda, publicado, disenos } = req.body;
        const id = req.params.id;

        const producto = await ProductoModels.findOne({
            where: { id_producto: id },
        });

        // Si el nombre ha cambiado, verifica si el nuevo nombre ya está ocupado
        if (nombre !== producto.nombre) {
            const nombreOcupado = await ProductoModels.findOne({
                where: { nombre: capitalizarPrimeraLetras(nombre) },
            });

            if (nombreOcupado) {
                return res.status(403).json({
                    message: 'Ya existe este Producto',
                    nombreOcupado,
                });
            }
        }

        // Obtener el precio de la prenda seleccionada
        const prenda = await PrendasModels.findByPk(fk_prenda);
        const precioPrenda = parseFloat(prenda.precio);

        // Calcular el precio total sumando el precio de la prenda y los precios de los diseños
        const disenosArray = JSON.parse(disenos);
        const promises = disenosArray.map(async (value) => {
            const precioDiseno = await PrecioDisenoModels.findByPk(
                value.id_precio_diseno
            );
            return parseFloat(precioDiseno.precio);
        });

        const preciosDiseños = await Promise.all(promises);
        const precioTotal = preciosDiseños.reduce(
            (total, precio) => total + precio,
            precioPrenda
        );

        //condicional para calcular la cantidad de prendas dependiento  del producto
        // if (fk_prenda) {
        //     const prenda = await PrendasModels.findOne({
        //         where: { id_prenda: fk_prenda },
        //     });

        //     //si la cantidad de producto anterior es menor a la actualizada del producto
        //     if (producto.cantidad < cantidad) {

        //         //la cantidad actualizada se le resta la cantidad vieja y el resultado
        //         const cantidadRestante = cantidad - producto.cantidad;

        //         //el resultado de la cantidad actualiza y la cantidad vieja se le resta a prenda
        //         const resultado = Number(prenda.cantidad) - Number(cantidadRestante);

        //         // Verificar si la cantidad resultante es menor que cero
        //         if (resultado < 0) {
        //             return res.status(404).json({
        //                 message: 'No hay suficientes unidades en stock',
        //                 resultado,
        //             });
        //         }

        //         prenda.cantidad = resultado
        //         await prenda.save();

        //         //en el caso cotrario se le suma
        //     } else {

        //         const cantidadRestante = producto.cantidad - cantidad

        //         prenda.cantidad = Number(prenda.cantidad) + Number(cantidadRestante);
        //         await prenda.save();

        //         // No necesitamos modificar 'cantidad' en este caso, ya que no hay cantidad sobrante
        //     }
        // }

        // Actualizar los valores del registro
        producto.nombre = capitalizarPrimeraLetras(nombre);
        // producto.cantidad = cantidad;
        producto.precio = precioTotal; // Utilizar el precio total calculado
        producto.fk_prenda = fk_prenda;
        producto.publicado = publicado;

        /// Verificar si se subió una imagen nueva
        if (req.file) {
            /// Eliminar la imagen anterior
            const imagenPath = 'uploads/productos/' + producto.imagen;
            if (imagenPath && fs.existsSync(imagenPath)) {
                fs.unlink(imagenPath, (error) => {
                    if (error) {
                        console.error(
                            'Error al eliminar el archivo de imagen:',
                            error
                        );
                        return next();
                    }
                });
            }
            /// Agregar la nueva ruta de la imagen al diseño
            producto.imagen = req.file.filename;
        }

        producto.save();

        // estas líneas se encargan de eliminar los registros existentes en la tabla DetalleDiseñoModels
        // asociados al producto identificado por el id antes de que se añadan nuevos registros Esto asegura que los detalles de los diseños
        // (DetalleDiseñoModels) asociados al producto se actualicen según la nueva información proporcionada en la solicitud.
        await DetalleDiseñoModels.destroy({ where: { fk_diseno: id } });
        await DetalleDiseñoModels.destroy({ where: { fk_precio_diseno: id } });
        await DetalleDiseñoModels.destroy({ where: { fk_producto: id } });
        await MovimientosModels.create({
            descripcion: `El usuario: ${req.usuario.nombre} actualizo el producto #${id}`,
        });

        for (let value of disenosArray) {
            await DetalleDiseñoModels.create({
                fk_producto: producto.id_producto,
                fk_diseno: value.id_diseno,
                fk_precio_diseno: value.id_precio_diseno,
            });
        }

        res.json({ message: 'Actualización exitosa', producto });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el producto ' });
    }
};

const cambiarEstado = async (req, res) => {
    try {
        const { estado } = req.body;

        // console.log('actualizar esto');
        const id = req.params.id;
        // console.log(id);

        const producto = await ProductoModels.findOne({
            where: { id_producto: id },
        });
        // Actualizar los valores del registro
        producto.estado = !estado;

        producto.save();

        await MovimientosModels.create({
            descripcion: `El usuario: ${req.usuario.nombre} cambio el estado al producto #${id}`,
        });

        res.json({ message: 'Cambio de estado' });
    } catch (error) {
        res.status(500).json({ message: 'no se cambio el estado' });
    }
};

const cambiarPublicacion = async (req, res) => {
    try {
        const { estado } = req.body;
        const id = req.params.id;

        const producto = await ProductoModels.findOne({
            where: { id_producto: id },
        });
        // Actualizar el estado contrario al que se le envía
        producto.publicado = !estado;

        producto.save();
        await MovimientosModels.create({
            descripcion: `El usuario: ${req.usuario.nombre} actualizo la publicacion al producto #${id}`,
        });

        res.status(200).json({ message: 'Se cambio el estado de publicación' });
    } catch (error) {
        res.status(500).json({
            message: 'No se cambio el estado de la publicación',
        });
    }
};

module.exports = {
    consultar,
    agregar,
    actualizar,
    cambiarEstado,
    cambiarPublicacion,
};
