const {CompraModels}  = require("../models/CompraModel");
const { ProveedorModels } = require("../models/ProveedorModel");
const {DetalleCompraModels} = require('../models/compraDetallesModel.js')


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
        const { total_de_compra, fecha, fk_proveedor,DetallesCompras } = req.body;

        console.log(req.body)



        const compras = await CompraModels.create({
            total_de_compra,
            fecha,
            fk_proveedor,
        });




        for (let value of DetallesCompras) {

            await  DetalleCompraModels.create({
                fk_compra: compras.id_compra,
                cantidad: value.cantidad,
                precio: value.precio,
                diseno: value.diseno,
                fk_prenda: value.fk_prenda || null
                
            })
           
        }
           

        
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



const actualizar = async (req, res) => {
    try {
        const { total_de_compra, fecha, fk_proveedor, DetallesCompras } = req.body;
        const id_compra = req.params.id

        
        // Verifica si la compra existe
        const compraExistente = await CompraModels.findByPk(id_compra);


        // Actualiza los campos de la compra
        compraExistente.total_de_compra = total_de_compra;
        compraExistente.fecha = fecha;
        compraExistente.fk_proveedor = fk_proveedor;

        // Guarda los cambios en la base de datos
        await compraExistente.save();

        // Actualiza o agrega nuevos detalles de la compra
        for (let value of DetallesCompras) {
            if (value.id_detalle_compra) {
                // Si tiene un ID, intenta actualizar el detalle existente
                const detalleCompraExistente = await DetalleCompraModels.findByPk(value.id_detalle_compra);

                if (!detalleCompraExistente) {
                    // Trata el caso donde el detalle de compra no existe
                    console.log(`El detalle de compra con ID ${value.id_detalle_compra} no existe.`);
                    continue;
                }

                // Actualiza los campos del detalle de compra
                detalleCompraExistente.cantidad = value.cantidad;
                detalleCompraExistente.precio = value.precio;
                detalleCompraExistente.diseno = value.diseno;
                detalleCompraExistente.fk_prenda = value.fk_prenda;

                // Guarda los cambios en la base de datos
                await detalleCompraExistente.save();
            } else {
                // Si no tiene un ID, crea un nuevo detalle de compra
                await DetalleCompraModels.create({
                    fk_compra: id_compra,
                    cantidad: value.cantidad,
                    precio: value.precio,
                    diseno: value.diseno,
                    fk_prenda: value.fk_prenda
                });
            }
        }

        // Mensaje de respuesta
        res.json({
            message: 'Compra actualizada exitosamente',
        });
    } catch (error) {
        console.error(error);
        // Envía una respuesta al cliente indicando el error
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
