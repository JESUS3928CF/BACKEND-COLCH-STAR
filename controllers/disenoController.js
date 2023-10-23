const {DisenoModels} = require('../models/DisenoModel.js');

//! Agregar un diseño
const agregar = async (req, res) => {

    try {
        const { nombre, imagen, publicado} = req.body;

        console.log(req.body);

        //!  Insertar un nuevo diseño en la base de datos
        await DisenoModels.create({
            nombre,
            imagen,
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

module.exports = { agregar };