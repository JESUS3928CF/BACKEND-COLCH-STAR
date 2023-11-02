const { ProveedorModels } = require("../models/ProveedorModel");


const consultar = async (req, res) => {
    try {

        /// Consultando todos los registros
        const proveedores = await ProveedorModels.findAll();

        //- Forma de inviar un JSON
        res.status(200).json(proveedores);


    } catch (error) {
        console.log('Error al consultar la tabla proveedor:', error);
        res.status(500).json({ error: 'Error al consultar la tabla proveedor' });
    }
};

//! Agregar proveedor

const agregar = async (req, res) => {

    try {
        const { nombre, telefono, direccion, identificador, tipoIdentificacion } = req.body;



        const identificadorRepetido = await ProveedorModels.findOne({
            where: {
                identificador: identificador,
                tipoIdentificacion: tipoIdentificacion
            }
        });


        if (identificadorRepetido) {
            return res.status(400).json({
                message: 'Ya Existe esta Identificación',
                identificadorRepetido,
            });
        }



        //!  Insertar un nuevo cliente en la base de datos
        await ProveedorModels.create({
            nombre,
            telefono,
            direccion,
            identificador,
            tipoIdentificacion

        });

        /// Mensaje de respuesta
        res.json({
            message: 'Proveedor agregado exitosamente',
        });

    } catch (error) {
        // Envía una respuesta al cliente indicando el error
        res.status(500).json({ message: 'Error al agregar el Proveedor' });
    }
}

// ! Actualizar un proveedor

const actualizar = async (req, res) => {
    try {

        const { nombre, telefono, direccion, identificador, tipoIdentificacion } = req.body;

        const id = req.params.id;
        console.log(id);

        const proveedor = await ProveedorModels.findOne({
            where: { id_proveedor: id },
        });



        if (identificador !== proveedor.identificador || tipoIdentificacion !==proveedor.tipoIdentificacion) {
            const identificadorRepetido = await ProveedorModels.findOne({
                where: {
                    identificador: identificador,
                    tipoIdentificacion: tipoIdentificacion
                },
            })

            if (identificadorRepetido) {
                return res.status(400).json({
                    message: 'Ya Existe esta Identificación',
                    identificadorRepetido,
                });
            }
        }



        // Actualizar los valores del registro
        proveedor.nombre = nombre;
        proveedor.telefono = telefono;
        proveedor.direccion = direccion;
        proveedor.identificador = identificador
        proveedor.tipoIdentificacion = tipoIdentificacion

        proveedor.save();



        res.json({ message: 'Actualización exitosa' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el proveedor ' });
    }
}
//! Actualizar un cliente

const cambiarEstado = async (req, res) => {
    try {

        const { estado } = req.body;

        console.log('actualizar esto');
        const id = req.params.id;
        console.log(id);

        const proveedor = await ProveedorModels.findOne({
            where: { id_proveedor: id },
        });
        // Actualizar los valores del registro
        proveedor.estado = !estado;

        proveedor.save();

        res.json({ message: 'Cambio de estado' });
    } catch (error) {
        res.status(500).json({ message: 'no se cambio el estado' });
    }
}


module.exports = { consultar, agregar, actualizar, cambiarEstado };

