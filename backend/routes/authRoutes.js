const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken, esAdministrador } = require('../middleware/auth');

// Rutas públicas
router.post('/registrar', authController.registrar);
router.post('/login', authController.login);

// Rutas protegidas
router.get('/perfil', verificarToken, authController.obtenerPerfil);
router.put('/cambiar-password', verificarToken, authController.cambiarPassword);

// Rutas solo para administradores
router.get('/usuarios', verificarToken, esAdministrador, authController.obtenerUsuarios);
router.put('/usuarios/:id', verificarToken, esAdministrador, authController.actualizarUsuario);

module.exports = router; 