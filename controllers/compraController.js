const CompraModels  = require("../models/CompraModel");
const { ProveedorModels } = require("../models/ProveedorModel");

const consultar = async (req, res) => {
    try {

        /// Consultando todos los registros
        const compra = await CompraModels.findAll({
        include: [
            {
                model: ProveedorModels,
                as: 'proveedor',
                attributes: ['nombre'],
            },
        ],
    });

        //- Forma de inviar un JSON
        res.status(200).json(compra);


    } catch (error) {
        console.log('Error al consultar la tabla compras:', error);
        res.status(500).json({ error: 'Error al consultar la tabla compras' });
    }
};

//! Agregar una compra

const agregar = async (req, res) => {
    try {
        const { total_de_compra, fecha, fk_proveedor } = req.body;

        await CompraModels.create({
            total_de_compra,
            fecha,
            fk_proveedor,
        });

        /// Mensaje de respuesta
        res.json({
            message: 'Compra agregada exitosamente',
        });
    } catch (error) {
        console.log(error);
        // Envía una respuesta al cliente indicando el error
        res.status(500).json({ message: 'Error al agregar la compra' });
    }
};

//! Actualizar una compra

const actualizar = async (req, res) => {
    try {
        const { total_de_compra, fecha, fk_proveedor} = req.body;

        const id = req.params.id;
        console.log(id);

        const compra = await CompraModels.findOne({
            where: { id_compra: id },
        });

        // Actualizar los valores del registro
        compra.total_de_compra = total_de_compra,
        compra.fecha = fecha,
        compra.fk_proveedor = fk_proveedor,

        compra.save();

        res.json({ message: 'Actualización exitosa' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar la compra' });
    }
};

//! Actualizar un cliente

const cambiarEstado = async (req, res) => {
    try {

        console.log("Se hizo una estado");
        const { estado } = req.body;

        console.log('actualizar esto');
        const id = req.params.id;
        console.log(id);

        const compra = await CompraModels.findOne({
            where: { id_compra: id },
        });
        // Actualizar los valores del registro
        compra.estado = !estado;

        compra.save();

        res.json({ message: 'Cambio de estado' });
    } catch (error) {
        res.status(500).json({ message: 'no se cambio el estado' });
    }
}

module.exports = { consultar, agregar, actualizar, cambiarEstado};
