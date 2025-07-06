const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken, esAdministrador } = require('../middleware/auth');

// Rutas protegidas - Solo administradores pueden gestionar usuarios
router.get('/', verificarToken, esAdministrador, authController.obtenerUsuarios);
router.get('/:id', verificarToken, esAdministrador, authController.obtenerUsuario);
router.put('/:id', verificarToken, esAdministrador, authController.actualizarUsuario);
router.delete('/:id', verificarToken, esAdministrador, authController.eliminarUsuario);

module.exports = router; 