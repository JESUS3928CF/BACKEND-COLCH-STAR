const { ClienteModels } = require("../models/ClienteModel");
const { MovimientosModels } = require("../models/MovimientosModels");
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

const agregar = async (req, res) => {

    try {
        const {
            producto,
            cantidad_producto,
            monto_total,
            fecha_entrega,
            descripcion,
            fk_cliente,
        } = req.body;

        await VentaModels.create({
            producto,
            cantidad_producto,
            monto_total,
            fecha_entrega,
            descripcion,
            fk_cliente,
        });

        await MovimientosModels.create({descripcion:'Nueva venta agregada'})

        /// Respuesta
        res.json({ "message " : "Venta Agregada Exitosamente"})
    } catch (error) {
        res.status(500).json({ error : 'Error al agregar la venta' });
    }

   
}

const actualizar = async (req, res) => {
    try {
        /// Objeto actualizado
        const {
            producto,
            cantidad_producto,
            monto_total,
            fecha_entrega,
            descripcion,
            fk_cliente,
        } = req.body;

        console.log('actualizar esto');
        const id = req.params.id;
        console.log(id);

        const venta = await VentaModels.findOne({
            where: { id_venta: id },
        });
        // Actualizar los valores del registro
        venta.producto = producto;
        venta.cantidad_producto = cantidad_producto;
        venta.monto_total = monto_total;
        venta.fecha_entrega = fecha_entrega;
        venta.descripcion = descripcion;
        venta.fk_cliente = fk_cliente;

        venta.save();
        await MovimientosModels.create({descripcion:`Se actualizo la venta #${id}`})


        res.json({ message: 'Actualización exitosa' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el la venta' });
    }
};

const cambiarEstado = async (req, res) => {
    try {
        const { estado } = req.body;
        const { id } = req.params; // Corregido: solo necesitas req.params.id

        const venta = await VentaModels.findOne({
            where: { id_venta: id },
        });

        if (!venta) {
            return res.status(404).json({ message: 'Venta no encontrada' });
        }

        // Ahora puedes actualizar el estado de la venta
        venta.estado = !estado;
        await venta.save();

        await MovimientosModels.create({descripcion:`Se cambio el estado de la venta #${id}`})


        res.status(200).json({
            message: 'Estado de la venta actualizado exitosamente'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al cambiar el estado de la venta',
        });
    }
};

module.exports = {consultar, agregar, actualizar, cambiarEstado};
