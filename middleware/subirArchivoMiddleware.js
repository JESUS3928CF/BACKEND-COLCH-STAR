const multer = require('multer');

/// Importamos la configuración del multer
const configurarMulter = require('../config/multerConfig.js');


//* Función para subir un archivo a la carpeta 'disenos'
const subirArchivoDiseno = (req, res, next) => {

    //- Pasar la configuración y el nombre del campo como se llama en la tabla
    const upload = multer(configurarMulter('disenos')).single('imagen');

    upload(req, res, function (error) {
        if (error) {
            return res.json({ mensaje: error });
        }
        return next();
    });
};

//* Función para subir un archivo a la carpeta 'prendas'
const subirArchivoPrenda = (req, res, next) => {
    const upload = multer(configurarMulter('prenda')).single('imagen');
    upload(req, res, function (error) {
        if (error) {
            res.json({ mensaje: error });
        } 

        return next();
    });
};

//* Función para subir un archivo a la carpeta 'prendas'
const subirArchivoProducto = (req, res, next) => {
    const upload = multer(configurarMulter('productos')).single('imagen');
    upload(req, res, function (error) {
        if (error) {
            res.json({ mensaje: error });
        } 

        return next();
    });
};

module.exports = { subirArchivoDiseno, subirArchivoPrenda, subirArchivoProducto}