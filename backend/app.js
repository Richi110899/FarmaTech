const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { sequelize } = require('./models');

const app = express();
app.use(cors({
  origin: 'https://farma-tech.vercel.app', // tu dominio de Vercel
  credentials: true
}));
app.use(express.json());

// Rutas de autenticación
app.use('/api/auth', require('./routes/authRoutes'));

// Rutas de la aplicación
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/medicamentos', require('./routes/medicamentoRoutes'));
app.use('/api/especialidades', require('./routes/especialidadRoutes'));
app.use('/api/tipos', require('./routes/tipoMedicRoutes'));
app.use('/api/laboratorios', require('./routes/laboratorioRoutes'));
app.use('/api/ordenes-venta', require('./routes/ordenVentaRoutes'));
app.use('/api/detalles-venta', require('./routes/detalleOrdenVtaRoutes'));
app.use('/api/ordenes-compra', require('./routes/ordenCompraRoutes'));
app.use('/api/detalles-compra', require('./routes/detalleOrdenCompraRoutes'));
app.use('/api/alertas', require('./routes/alertaRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.get('/', (req, res) => res.send('API PibuFarma funcionando'));

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
