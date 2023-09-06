const { ClienteModels } = require("../models/ClienteModel");
const { VentaModels } = require("../models/VentaModel");

//! Consultar un registro relacionado con Sequelize
const consultar = async (req, res) => {
    try {
        /// Consultando todos los registros
        // const usuario = await UsuarioModels.findAll();

        const ventas = await VentaModels.findAll({
            include: [
                {
                    model: ClienteModels,
                    attributes: ['nombre'], // Incluye solo el campo "nombre" del modelo Rol
                },
            ],
        });

        //- Forma de inviar un JSON
        res.status(200).json(ventas);
    } catch (error) {
        console.log('Error al consultar la tabla ventas:', error);
        res.status(500).json({ error: 'Error al consultar la tabla ventas' });
    }
};

module.exports = {consultar};
