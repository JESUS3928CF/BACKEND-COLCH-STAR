const express = require("express");
const {consultar, agregar, actualizar, cambiarEstado, actualizarContrasena, autenticar, perfil} = require('../controllers/usuarioController');
const { checkAut } = require("../middleware/authMidlleware");
const router = express.Router();

/// peticiones para clientes

//* Autenticar un usuario
router.post('/login', autenticar);



//* Find all
router.get("/" , consultar );

//* Insert One
router.post('/', agregar);

//* actualizar
router.patch('/:id', actualizar);


//* actualizar
router.patch('/cambiarContrasena/:id', actualizarContrasena);


//* Cambiar estado
router.patch('/estado/:id', cambiarEstado);

//* Obtener el perfil de un usuario
router.get("/perfil", checkAut ,perfil)


module.exports = router;