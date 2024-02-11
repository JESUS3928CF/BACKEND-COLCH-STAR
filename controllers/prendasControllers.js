const { PrendasModels } = require('../models/PrendasModel.js');
const { colorModels } = require('../models/colorModel.js');
const { colorsPrendasmodel } = require('../models/ColorsPrendasModels.js');
const { TallaModels } = require('../models/TallaModel.js');
const {
    formatMoney,
    capitalizarPrimeraLetras,
} = require('../helpers/formatearDatos.js');

const fs = require('fs');
const { where } = require('sequelize');
const { MovimientosModels } = require('../models/MovimientosModels.js');

const consultar = async (req, res) => {
    try {
        //Consular los registros de las prendas
        const prendas = await PrendasModels.findAll();
        const colors = await colorModels.findAll();
        const colorsPrenda = await colorsPrendasmodel.findAll();
        const Tallas = await TallaModels.findAll();

        const TablaIntermedia = new Map();
        const nombreColors = new Map();
        const tallas = new Map();

        Tallas.forEach((talla) => {
            if (!tallas.has(talla.fk_prenda)) {
                tallas.set(talla.fk_prenda, []);
            }
            tallas.get(talla.fk_prenda).push(talla.talla);
        });

        colors.forEach((color) => {
            if (!nombreColors.has(color.id_color)) {
                nombreColors.set(color.id_color, []);
            }
            nombreColors.get(color.id_color).push({
                color: color.color,
                id_color: color.id_color,
                codigo: color.codigo,
            });
        });

        colorsPrenda.forEach((fk_color) => {
            if (!TablaIntermedia.has(fk_color.fk_prenda)) {
                TablaIntermedia.set(fk_color.fk_prenda, []);
            }
            TablaIntermedia.get(fk_color.fk_prenda).push(fk_color.fk_color);
        });

        const ColoresDelaPrenda = prendas.map((colors) => ({
            id_prenda: colors.id_prenda,
            nombre: colors.nombre,
            cantidad: colors.cantidad,
            precio: colors.precio,
            tipo_de_tela: colors.tipo_de_tela,
            imagen: colors.imagen,
            genero: colors.genero,
            publicado: colors.publicado,
            estado: colors.estado,
            color: (() => {
                const result = [];
                TablaIntermedia.get(colors.id_prenda).forEach((fk_color) => {
                    // Use spread (...) operator to merge arrays
                    result.push(...(nombreColors.get(fk_color) || []));
                });
                return result || [];
            })(),

            Talla: tallas.get(colors.id_prenda) || [],
        }));

        res.status(200).json(ColoresDelaPrenda);
    } catch (error) {
        console.log('error a consultar la tabla prendas:', error);
        res.status(500).json({ error: 'Error al consultar la tabla prendas' });
    }
};

//Agregar una prenda

const agregar = async (req, res) => {
    try {
        const {
            nombre,
            cantidad,
            precio,
            tipo_de_tela,
            genero,
            publicado,
            colores,
            tallas,
        } = req.body;

        // Verificar si el nombre ya está ocupado
        const nombreOcupado = await PrendasModels.findOne({
            where: { nombre: nombre },
        });

        if (nombreOcupado) {
            return res.status(403).json({
                message: 'Ya existe esta prenda',
                nombreOcupado,
            });
        }

        if (!req.file) {
            return res.json({
                message: `Error la imagen de la prenda es obligatoria`,
            });
        }

        const newPrenda = await PrendasModels.create({
            nombre: capitalizarPrimeraLetras(nombre),
            cantidad,
            precio,
            tipo_de_tela: capitalizarPrimeraLetras(tipo_de_tela),
            imagen: req.file.filename,
            genero,
            publicado,
        });

        coloresArray = JSON.parse(colores);

        for (let value of coloresArray) {
            await colorsPrendasmodel.create({
                fk_color: value.id_color,
                fk_prenda: newPrenda.id_prenda,
            });
        }

        for (let value of tallas) {
            await TallaModels.create({
                talla: value,
                fk_prenda: newPrenda.id_prenda,
            });
        }

        await MovimientosModels.create({ descripcion: 'Nuevo prenda creada' });

        res.status(200).json({ menssage: 'Prenda agregada exitosamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar prenda' });
        console.log(error);
    }
};

const update = async (req, res) => {
    try {
        const {
            nombre,
            precio,
            tipo_de_tela,
            genero,
            publicado,
            colores,
            tallas,
        } = req.body;

        console.log(nombre);

        const id = req.params.id;

        const prenda = await PrendasModels.findOne({
            where: { id_prenda: id },
        });

        // Si el nombre ha cambiado, verifica si el nuevo nombre ya está ocupado
        if (nombre !== prenda.nombre) {
            const nombreOcupado = await PrendasModels.findOne({
                where: { nombre: nombre },
            });

            if (nombreOcupado) {
                return res.status(403).json({
                    message: 'Ya existe esta prenda',
                    nombreOcupado,
                });
            }
        }

        prenda.nombre = capitalizarPrimeraLetras(nombre);
        prenda.precio = precio;
        prenda.tipo_de_tela = capitalizarPrimeraLetras(tipo_de_tela);
        prenda.genero = genero;
        prenda.publicado = publicado;

        if (req.file) {
            const imagenPath = 'uploads/prenda/' + prenda.imagen;
            if (imagenPath && fs.existsSync(imagenPath)) {
                fs.unlink(imagenPath, (error) => {
                    if (error) {
                        console.error('Error al eliminar la imagen', error);
                        return next();
                    }
                });
            }
            prenda.imagen = req.file.filename;
        }

        await colorsPrendasmodel.destroy({ where: { fk_color: id } });
        await colorsPrendasmodel.destroy({ where: { fk_prenda: id } });
        await TallaModels.destroy({ where: { fk_prenda: id } });
        await TallaModels.destroy({ where: { talla: id } });
        await MovimientosModels.create({
            descripcion: `Se actualizo la prenda #${id}`,
        });

        coloresArray = JSON.parse(colores);
        for (let value of coloresArray) {
            await colorsPrendasmodel.create({
                fk_color: value.id_color,
                fk_prenda: prenda.id_prenda,
            });
        }

        for (let value of tallas) {
            await TallaModels.create({
                talla: value,
                fk_prenda: prenda.id_prenda,
            });
        }

        prenda.save();

        res.json({
            message: 'Actualización exitosa',
        });
    } catch (error) {
        res.status(500).json({ massge: 'Error al actualizar la prendas' });
        console.log(error);
    }
};

const cambiarEstado = async (req, res) => {
    try {
        const { estado } = req.body;
        const id = req.params.id;
        const prenda = await PrendasModels.findOne({
            where: { id_prenda: id },
        });
        prenda.estado = !estado;
        prenda.save();

        await MovimientosModels.create({
            descripcion: `Se cambio el estado a la prenda #${id}`,
        });

        res.json({ message: 'Cambio el estado' });
    } catch (error) {
        res.status(500).json({ message: 'Error al cambiar el estado' });
    }
};

const cambiarPublicacion = async (req, res) => {
    try {
        const { estado } = req.body;
        const id = req.params.id;

        const prenda = await PrendasModels.findOne({
            where: { id_prenda: id },
        });
        prenda.publicado = !estado;
        prenda.save();

        await MovimientosModels.create({
            descripcion: `Se cambio el estado de la publicación a la prenda #${id}`,
        });

        res.json({
            message: 'Se cambio el estado de la publicación de la prendas',
        });
    } catch (error) {
        res.status(500).json({
            message: 'No se cambio el estado de la publicación',
        });
    }
};

module.exports = {
    consultar,
    agregar,
    update,
    cambiarEstado,
    cambiarPublicacion,
};
