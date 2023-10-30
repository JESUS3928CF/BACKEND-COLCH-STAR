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

/// peticiones para diseños

//* Find all
router.get('/', consultar);

//* Insert One
router.post('/', subirArchivoDiseno, agregar);

//* Update
router.put( 
    '/:id',
    subirArchivoDiseno, //- Tener listo el middleware en caso de querer actualizar la imagen
    actualizar
);

//* Cambiar estado
router.patch('/estado/:id', cambiarEstado);

//* Cambiar estado
router.patch('/publicado/:id', cambiarPublicacion);

module.exports = router;
