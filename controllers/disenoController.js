const {DisenoModels} = require('../models/DisenoModel.js');
const fs = require('fs')

const consultar = async (req, res) => {
    try {
        /// Consultando todos los registros
        const disenos = await DisenoModels.findAll();

        //- Forma de inviar un JSON
        res.status(200).json(disenos);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar la tabla diseños' });
    }
};

//! Agregar un diseño
const agregar = async (req, res) => {

    try {
        const { nombre, publicado} = req.body;

        console.log(req.body);

        //* Validar que se haya cargado el archivo
        if(!req.file) {
            return res.json({ message: `Error la imagen del diseño es requerida` });
        }

        //!  Insertar un nuevo diseño en la base de datos
        await DisenoModels.create({
            nombre,
            imagen : req.file.filename,
            publicado
        });

        /// Mensaje de respuesta
        res.json({
            message: 'Diseño agregado exitosamente',
        });       
    } catch (error) {
        // Envía una respuesta al cliente indicando el error
        res.status(500).json({ message: `Error al agregar el diseño ${error}` });
    }
};

//! Actualizar un diseño
const actualizar = async (req, res) => {
    try {

        const { nombre, publicado } = req.body;

        const id = req.params.id;
        console.log(id);

        const diseno = await DisenoModels.findOne({
            where: { id_diseno: id },
        });
        /// Actualizar los valores del registro
        diseno.nombre = nombre;
        diseno.publicado = publicado;

        /// Verificar si se subió una imagen nueva
        if(req.file){
            /// Eliminar la imagen anterior
            const imagenPath = 'uploads/disenos/' + diseno.imagen; //- ruta de la imagen
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
            diseno.imagen = req.file.filename;
        }

        diseno.save();

        res.json({ message: 'Actualización exitosa' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el diseño' });
    }
}


//! cambiar el estado de un diseño
const cambiarEstado = async (req, res) => {
    try {
        const { estado } = req.body;
        const id = req.params.id;

        const diseno = await DisenoModels.findOne({
            where: { id_diseno: id },
        });
        // Actualizar el estado contrario al que se le envía 
        diseno.estado = !estado;

        diseno.save();

        res.json({ message: 'Cambio de estado' });
    } catch (error) {
        res.status(500).json({ message: 'No se cambio el estado' });
    }
}


module.exports = { agregar, consultar, actualizar, cambiarEstado };