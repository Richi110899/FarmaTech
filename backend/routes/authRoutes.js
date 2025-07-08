const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken, esAdministrador } = require('../middleware/auth');

// Rutas públicas
router.post('/login', authController.login);
router.post('/login-google', authController.loginGoogle);
router.post('/verify-google', authController.verifyGoogleUser);

// Rutas protegidas
router.get('/profile', verificarToken, authController.obtenerPerfil);

// Rutas solo para administradores
router.get('/users', verificarToken, esAdministrador, authController.obtenerUsuarios);
router.post('/users', verificarToken, esAdministrador, authController.crearUsuario);
router.get('/users/:id', verificarToken, esAdministrador, authController.obtenerUsuario);
router.put('/users/:id', verificarToken, esAdministrador, authController.actualizarUsuario);
router.delete('/users/:id', verificarToken, esAdministrador, authController.eliminarUsuario);

module.exports = router; 