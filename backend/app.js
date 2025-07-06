const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');

const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'https://pibu-nine.vercel.app',
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

app.get('/', (req, res) => res.send('API PibuFarma funcionando'));

// Sincronizar base de datos (sin force para no perder datos)
sequelize.sync().then(() => {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
    console.log('Base de datos sincronizada');
  });
}).catch(error => {
  console.error('Error al sincronizar la base de datos:', error);
});