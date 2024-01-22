const express = require("express");
const {
    consultar,
    agregar,
    actualizar,
    cambiarEstado,
    actualizarContrasena,
    autenticar,
    perfil,
    passwordPerdida,
    checkToken,
    newPassword
} = require('../controllers/usuarioController');
const { checkAut } = require("../middleware/authMidlleware");
const router = express.Router();

/// peticiones para clientes
//* Restablecer contraseña
router.post("/password-perdida", passwordPerdida )

//* verificar el token para poder restablecer la contraseña
router.get("/password-perdida/:token", checkToken )

router.post('/password-perdida/:token', newPassword );

//* Autenticar un usuario
router.post('/login', autenticar);


//* Find all
router.get('/', checkAut, consultar);

//* Insert One
router.post('/', checkAut , agregar);

//* actualizar
router.patch('/:id', checkAut, actualizar);


//* actualizar
router.patch('/cambiarContrasena/:id', checkAut, actualizarContrasena);


//* Cambiar estado
router.patch('/estado/:id',checkAut,  cambiarEstado);

//* Obtener el perfil de un usuario
router.get("/perfil", checkAut ,perfil)


module.exports = router;