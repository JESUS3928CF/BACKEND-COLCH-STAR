const {DisenoModels} = require('../models/DisenoModel.js');

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



module.exports = { agregar, consultar };