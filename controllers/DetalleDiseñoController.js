const { DetalleDiseñoModels } = require("../models/DetalleDiseñoModel");


const consultar = async (req, res) => {
    try {

        /// Consultando todos los registros
        const detalleDiseno = await DetalleDiseñoModels.findAll();

        //- Forma de inviar un JSON
        res.status(200).json(detalleDiseno);


    } catch (error) {
        console.log('Error al consultar la tabla proveedor:', error);
        res.status(500).json({ error: 'Error al consultar la tabla proveedor' });
    }
};


module.exports = { consultar, };

