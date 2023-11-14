const express = require('express');
const {
    consultar,
    agregar,
    actualizar,
    cambiarEstado,
    cambiarPublicacion,
} = require('../controllers/disenoController.js');
const router = express.Router();

/// Middlewares
const {
    subirArchivoDiseno,
} = require('../middleware/subirArchivoMiddleware.js');
const { checkAut } = require('../middleware/authMidlleware.js');

/// peticiones para diseños

//* Find all
router.get('/', consultar);

//* Insert One
router.post('/', checkAut , subirArchivoDiseno, agregar);

//* Update
router.put(
    '/:id',
    checkAut,
    subirArchivoDiseno, //- Tener listo el middleware en caso de querer actualizar la imagen
    actualizar
);

//* Cambiar estado
router.patch('/estado/:id', checkAut, cambiarEstado);

//* Cambiar estado
router.patch('/publicado/:id', checkAut, cambiarPublicacion);

module.exports = router;
