const { PrecioDisenoModels } = require('../models/PrecioDisenoModel');

const consultar = async (req, res) => {
    try {
        /// Consultando todos los registros
        const precios = await PrecioDisenoModels.findAll();

        //- Forma de inviar un JSON
        res.status(200).json(precios);
    } catch (error) {
        res.status(500).json({ error: 'Error al consultar la tabla precios de los diseños' });
    }
};

//! Actualizar un diseño
const actualizar = async (req, res) => {
    try {
        const { precio } = req.body;

        const id = req.params.id;
        console.log(id);

        const precio_diseno = await PrecioDisenoModels.findOne({
            where: { id_precio_diseno: id },
        });

        /// Actualizar los valores del registro
        precio_diseno.precio = precio;
        precio_diseno.save();

        res.json({ message: 'Actualización exitosa' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el precio de los diseños' });
    }
};

module.exports = {
    consultar,
    actualizar
};
