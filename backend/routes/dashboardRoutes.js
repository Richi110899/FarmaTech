const express = require('express');
const router = express.Router();
const { getDashboardVentas, getDashboardCompras, getDebugData } = require('../controllers/dashboardController');
const { verificarToken } = require('../middleware/auth');

// Rutas para dashboards
router.get('/ventas', verificarToken, getDashboardVentas);
router.get('/compras', verificarToken, getDashboardCompras);
router.get('/debug', verificarToken, getDebugData);

module.exports = router; 