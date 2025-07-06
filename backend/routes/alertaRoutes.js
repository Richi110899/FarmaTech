const express = require('express');
const router = express.Router();
const alertaController = require('../controllers/alertaController');
const { verificarToken, esVendedor } = require('../middleware/auth');

// Rutas protegidas - Vendedores y administradores pueden ver alertas
router.get('/stock', verificarToken, esVendedor, alertaController.obtenerAlertasStock);
router.get('/vencimiento', verificarToken, esVendedor, alertaController.obtenerAlertasVencimiento);
router.get('/todas', verificarToken, esVendedor, alertaController.obtenerTodasAlertas);
router.get('/resumen', verificarToken, esVendedor, alertaController.obtenerResumenAlertas);

// Configuración de alertas (solo administradores)
router.put('/configuracion/:id', verificarToken, require('../middleware/auth').esAdministrador, alertaController.actualizarConfiguracionAlertas);

module.exports = router; 