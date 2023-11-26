const {DetalleCompraModels} = require('../models/compraDetallesModel.js')
const {PrendasModels} = require('../models/PrendasModel.js')
const {CompraModels} = require('../models/CompraModel.js')


const consult = async (req,res)=>{
    try{
        
        const comprasDetalles= await DetalleCompraModels.findAll({
            include:[
                {
                    model: PrendasModels,
                    as:'prenda',
                    attributes: ['nombre'],

                },
                {
                    model: CompraModels,
                    as:'compra',
                    attributes: ['fecha'],

                },

            ]
        })
        res.status(200).json(comprasDetalles)

    }catch(error){
        res.status(500).json({message: 'Error al consultar los detalles d elas prendas'})
    }
}


const agregar = async (req, res) => {
    try {
        const { cantidad, precio, diseno, fk_compra, fk_prenda } = req.body;

        // Crea el nuevo detalle de compra
        await DetalleCompraModels.create({
            cantidad,
            precio,
            diseno,
            fk_compra,
            fk_prenda,
        });

        // Mensaje de respuesta
        res.json({
            message: 'Detalle de compra agregado exitosamente',
        });
    } catch (error) {
        console.error(error);
        // Envía una respuesta al cliente indicando el error
        res.status(500).json({ message: 'Error al agregar el detalle de compra' });
    }
};

const actualizar = async (req, res) => {
    try {
        const {cantidad, precio, diseno, fk_compra, fk_prenda } = req.body;

        const id = req.params.id;

        const detalle_compra = await DetalleCompraModels.findOne({
            where: { id_detalle_compra: id },
        });

        // Realiza la actualización de los campos deseados
        detalle_compra.cantidad = cantidad;
        detalle_compra.precio = precio;
        detalle_compra.diseno = diseno;
        detalle_compra.fk_compra = fk_compra;
        detalle_compra.fk_prenda = fk_prenda;
        detalle_compra.save();

        res.json({
            message: 'Detalle de compra actualizado exitosamente',
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el detalle de compra' });
    }
};


module.exports = {consult, agregar, actualizar}
