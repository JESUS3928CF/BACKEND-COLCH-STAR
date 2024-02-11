const { MovimientosModels } = require("../models/MovimientosModels");
const { ProveedorModels } = require("../models/ProveedorModel");
const { formatMoney, capitalizarPrimeraLetras } = require('../helpers/formatearDatos.js');


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


        // findOne se utiliza para buscar un solo registro en la base de datos que cumpla con ciertos criterios.

        // // si la busqueda anterior, se encuntra un  registro que cumple con la condicion de busqueda,
        // // se ejecuta el bloque de codigo  dentro del if

        // que establece las condiciones de búsqueda. En este caso, se está buscando un registro en la base de datos donde la propiedad 
        // identificador sea igual al valor de la variable identificador
        const identificadorRepetido = await ProveedorModels.findOne({
            where: {
                identificador: identificador,
                tipoIdentificacion: tipoIdentificacion
            }
        });

        if (identificadorRepetido) {
            return res.status(403).json({
                message: 'Ya Existe esta Identificación',
                identificadorRepetido,
            });
        }


        //!  Insertar un nuevo cliente en la base de datos
         const nuevoProveedor = await ProveedorModels.create({
            nombre:  capitalizarPrimeraLetras(nombre),
            telefono,
            direccion: capitalizarPrimeraLetras(direccion),
            identificador,
            tipoIdentificacion

        });

        await MovimientosModels.create({descripcion: `El usuario: ${req.usuario.nombre} registro un nuevo proveedor`})


        /// Mensaje de respuesta
        res.json({
            message: 'Proveedor agregado exitosamente', nuevoProveedor
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
                return res.status(403).json({
                    message: 'Ya Existe esta Identificación',
                    identificadorRepetido,
                });
            }
        }



        // Actualizar los valores del registro
        proveedor.nombre = capitalizarPrimeraLetras(nombre);
        proveedor.telefono = telefono;
        proveedor.direccion = capitalizarPrimeraLetras(direccion);
        proveedor.identificador = identificador
        proveedor.tipoIdentificacion = tipoIdentificacion

        proveedor.save();

        await MovimientosModels.create({descripcion:`El usuario: ${req.usuario.nombre} actualizo el proveedor #${id}`})




        res.json({ message: 'Actualización exitosa', proveedor});
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
        await MovimientosModels.create({descripcion:`El usuario: ${req.usuario.nombre} cambio el estado del proveedor #${id}`})


        res.json({ message: 'Cambio de estado' });
    } catch (error) {
        res.status(500).json({ message: 'no se cambio el estado' });
    }
}


module.exports = { consultar, agregar, actualizar, cambiarEstado };

