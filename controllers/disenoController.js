const {DisenoModels} = require('../models/DisenoModel.js');
const fs = require('fs');
const { MovimientosModels } = require('../models/MovimientosModels.js');
const { capitalizarPrimeraLetras } = require('../helpers/formatearDatos.js');

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

        // Verificar si el nombre ya está ocupado
        const nombreOcupado = await DisenoModels.findOne({
            where: { nombre: capitalizarPrimeraLetras(nombre) },
        });

        if (nombreOcupado) {
            return res.status(403).json({
                message: 'Ya existe este Diseño',
                nombreOcupado,
            });
        }

        //* Validar que se haya cargado el archivo
        if(!req.file) {
            return res.json({ message: `Error la imagen del diseño es requerida` });
        }

        //!  Insertar un nuevo diseño en la base de datos
        const nuevoDiseno = await DisenoModels.create({
            nombre: capitalizarPrimeraLetras(nombre),
            imagen : req.file.filename,
            publicado
        });

        await MovimientosModels.create({descripcion: `El usuario: ${req.usuario.nombre} registro un nuevo diseño`})


        /// Mensaje de respuesta
        res.json({
            message: 'Diseño agregado exitosamente', nuevoDiseno
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

        // Si el nombre ha cambiado, verifica si el nuevo nombre ya está ocupado
        if (nombre !== diseno.nombre) {
            const nombreOcupado = await DisenoModels.findOne({
                where: { nombre: capitalizarPrimeraLetras(nombre) },
            });

            if (nombreOcupado) {
                return res.status(403).json({
                    message: 'Ya existe este Diseño',
                    nombreOcupado,
                });
            }
        }

        /// Actualizar los valores del registro
        diseno.nombre = capitalizarPrimeraLetras(nombre);
        
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
        await MovimientosModels.create({descripcion: `El usuario: ${req.usuario.nombre} actualizo el diseño #${id}`})


        res.json({ message: 'Actualización exitosa' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el diseño' });
        console.log(error)
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

        await MovimientosModels.create({descripcion:`El usuario: ${req.usuario.nombre} cambio el estado al diseño # ${id}`})


        res.json({ message: 'Cambio de estado' });
    } catch (error) {
        res.status(500).json({ message: 'No se cambio el estado' });
    }
}

//! cambiar el estado de publicación de un diseño
const cambiarPublicacion = async (req, res) => {
    try {
        const { estado } = req.body;
        const id = req.params.id;

        const diseno = await DisenoModels.findOne({
            where: { id_diseno: id },
        });
        // Actualizar el estado contrario al que se le envía 
        diseno.publicado = !estado;

        diseno.save();

        await MovimientosModels.create({descripcion:`El usuario: ${req.usuario.nombre} cambio el estado de publicación del diseño #${id}`})


        res.status(200).json({ message: 'Se cambio el estado de publicación' });
    } catch (error) {
        res.status(500).json({ message: 'No se cambio el estado de publicación' });
    }
}


module.exports = { agregar, consultar, actualizar, cambiarEstado, cambiarPublicacion };