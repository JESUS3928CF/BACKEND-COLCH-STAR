const { DetalleDiseñoModels } = require("../models/DetalleDiseñoModel");
const { DisenoModels } = require("../models/DisenoModel");
const { PrecioDisenoModels } = require("../models/PrecioDisenoModel");
const { PrendasModels } = require("../models/PrendasModel");
const { ProductoModels } = require("../models/ProductoModel");

const fs = require('fs')


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

        /// Consultando los diseños
        const detalle_diseno = await DetalleDiseñoModels.findAll({
            include: [
                {
                    model: DisenoModels, // Modelo de Prendas
                    attributes: ['imagen', 'nombre' ], // Selecciona los atributos que necesitas, en este caso, solo la imagen
                },
                {
                    model: PrecioDisenoModels, // Modelo de Prendas
                    attributes: [ 'tamano','precio' ], // Selecciona los atributos que necesitas, en este caso, solo la imagen
                },
            
            ],
        });

        const productosConDisenos = new Map();

        detalle_diseno.forEach((diseno) => {

            // console.log(diseno);
            if (!productosConDisenos.has(diseno.fk_producto)) {
                productosConDisenos.set(diseno.fk_producto, []);
            }
            console.log(diseno);
            console.log(
                productosConDisenos.get(diseno.fk_producto).push({
                    nombre: diseno.diseno.nombre,
                    imagen: diseno.diseno.imagen,
                    precio: diseno.precio_diseno.precio,
                    tamano: diseno.precio_diseno.tamano,
                })
            );
        });

         console.log(productosConDisenos);


        //- Forma de inviar un JSON-
        // res.status(200).json(productos);
        const productoConDisenos = productos.map((producto) => ({
            id_producto: producto.id_producto,
            nombre: producto.nombre,
            cantidad: producto.cantidad,
            precio: producto.precio,
            estado: producto.estado,
            imagen: producto.imagen,
            publicado: producto.publicado,
            fk_prenda: producto.fk_prenda,
            prenda: producto.prenda,
            disenos: productosConDisenos.get(producto.id_producto) || [],
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
        const { nombre, cantidad, fk_prenda, publicado, disenos } = req.body;

        if (!req.file) {
            return res.json({ message: `Error la imagen del diseño es requerida` });
        }

        //! Obtener el precio de la prenda
        const prenda = await PrendasModels.findByPk(fk_prenda);
        const precioPrenda = parseFloat(prenda.precio);

        //! Calcular el precio total sumando el precio de la prenda y los precios de los diseños
        const disenosArray = JSON.parse(disenos);

        const promises = disenosArray.map(async (value) => {
            // Obtener el precio de cada diseño
            const precioDiseno = await PrecioDisenoModels.findByPk(value.id_precio_diseno);
            return parseFloat(precioDiseno.precio);
        });

        const preciosDiseños = await Promise.all(promises);
        const precioTotal = preciosDiseños.reduce((total, precio) => total + precio, precioPrenda);

        //! Insertar un nuevo producto en la base de datos con el precio total calculado
        const nuevoProducto = await ProductoModels.create({
            nombre,
            cantidad,
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

        /// Mensaje de respuesta
        res.json({
            message: 'Producto agregado exitosamente',
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

        const { nombre, cantidad, precio, fk_prenda, publicado,disenos } = req.body;

        const id = req.params.id;
        console.log(id);

        const producto = await ProductoModels.findOne({
            where: { id_producto: id },
        });

        // Actualizar los valores del registro
        producto.nombre = nombre;
        producto.cantidad = cantidad;
        producto.precio = precio;
        producto.fk_prenda = fk_prenda
        producto.publicado = publicado

        /// Verificar si se subió una imagen nueva
        if(req.file){
            /// Eliminar la imagen anterior
            const imagenPath = 'uploads/productos/' + producto.imagen; //- ruta de la imagen
            if (imagenPath && fs.existsSync(imagenPath)) {
                //- fs.existsSync(imagenPath) Para verificar que exista el archivo en esa ruta
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

        await DetalleDiseñoModels.destroy({ where: { fk_diseno: id } });
        await DetalleDiseñoModels.destroy({ where: { fk_precio_diseno: id } });
        await DetalleDiseñoModels.destroy({ where: { fk_producto: id } });




        disenosArray = JSON.parse(disenos)
        for (let value of disenosArray) {
            await DetalleDiseñoModels.create({
                fk_producto: producto.id_producto,
                fk_diseno: value.id_diseno,
                fk_precio_diseno: value.id_precio_diseno
            });
        }    

        

        res.json({ message: 'Actualización exitosa' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error al actualizar el producto ' });
    }
}
//! Actualizar un cliente

const cambiarEstado = async (req, res) => {
    try {

        const { estado } = req.body;

        console.log('actualizar esto');
        const id = req.params.id;
        // console.log(id);

        const producto = await ProductoModels.findOne({
            where: { id_producto: id },
        });
        // Actualizar los valores del registro
        producto.estado = !estado;

        producto.save();

        res.json({ message: 'Cambio de estado' });
    } catch (error) {
        res.status(500).json({ message: 'no se cambio el estado' });
    }
}

const cambiarPublicacion = async (req, res)=>{
    try{
        const {estado}=req.body;
        const id = req.params.id

        const producto =await ProductoModels.findOne({

            where: {id_producto: id},

        })
        // Actualizar el estado contrario al que se le envía 
        producto.publicado=!estado

        producto.save()

        res.status(200).json({ message: 'Se cambio el estado de publicación' });

    }catch (error){
        res.status(500).json({message: 'No se cambio el estado de la publicación'})
    }
}


module.exports = { consultar, agregar, actualizar, cambiarEstado, cambiarPublicacion };

