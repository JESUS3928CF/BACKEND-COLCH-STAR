const { ProductoModels } = require("../models/ProductoModel");
const fs = require('fs')


const consultar = async (req, res) => {
    try {

        /// Consultando todos los registros
        const productos = await ProductoModels.findAll();

        //- Forma de inviar un JSON
        res.status(200).json(productos);


    } catch (error) {
        console.log('Error al consultar la tabla producto:', error);
        res.status(500).json({ error: 'Error al consultar la tabla producto' });
    }
};

//! Agregar producto

const agregar = async (req, res) => {

    try {
        const { nombre, cantidad, precio, fk_prenda } = req.body;


        if(!req.file) {
            return res.json({ message: `Error la imagen del diseño es requerida` });
        }


        //!  Insertar un nuevo cliente en la base de datos
        await ProductoModels.create({
            nombre,
            cantidad,
            precio,
            imagen : req.file.filename,
            fk_prenda
            

        });

        /// Mensaje de respuesta
        res.json({
            message: 'Producto agregado exitosamente',
        });

    } catch (error) {
        // Envía una respuesta al cliente indicando el error
        res.status(500).json({ message: 'Error al agregar el Producto' });
    }
}

// ! Actualizar un proveedor

const actualizar = async (req, res) => {
    try {

        const { nombre, cantidad, precio, fk_prenda } = req.body;

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



        res.json({ message: 'Actualización exitosa' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el producto ' });
    }
}
//! Actualizar un cliente

const cambiarEstado = async (req, res) => {
    try {

        const { estado } = req.body;

        console.log('actualizar esto');
        const id = req.params.id;
        console.log(id);

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
        producto.publicado=!estado
        producto.save()

        res.status(200).json({ message: 'Se cambio el estado de publicación' });

    }catch (error){
        res.status(500).json({message: 'No se cambio el estado de la publicación'})
    }
}


module.exports = { consultar, agregar, actualizar, cambiarEstado, cambiarPublicacion };
