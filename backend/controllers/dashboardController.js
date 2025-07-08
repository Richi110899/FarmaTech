const { Op, sequelize } = require('sequelize');
const OrdenVenta = require('../models/ordenVenta');
const DetalleOrdenVta = require('../models/detalleOrdenVta');
const OrdenCompra = require('../models/ordenCompra');
const DetalleOrdenCompra = require('../models/detalleOrdenCompra');

// Función auxiliar para obtener el día correcto de una fecha
const getDayFromDate = (dateString) => {
  const date = new Date(dateString);
  // Convertir a fecha local sin tiempo
  const localDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return localDate.getDate();
};

// Endpoint de debug para ver qué datos existen
const getDebugData = async (req, res) => {
  try {
    // Obtener todas las órdenes de venta con sus fechas
    const todasLasVentas = await OrdenVenta.findAll({
      attributes: ['NroOrdenVta', 'fechaEmision'],
      order: [['fechaEmision', 'ASC']]
    });

    // Agrupar por año y mes
    const datosPorMes = {};
    todasLasVentas.forEach(venta => {
      const fecha = new Date(venta.fechaEmision);
      const anio = fecha.getFullYear();
      const mes = fecha.getMonth();
      const key = `${anio}-${mes + 1}`;
      
      if (!datosPorMes[key]) {
        datosPorMes[key] = [];
      }
      datosPorMes[key].push({
        NroOrdenVta: venta.NroOrdenVta,
        fecha: fecha.toISOString().split('T')[0],
        dia: getDayFromDate(venta.fechaEmision)
      });
    });

    res.json({
      totalOrdenes: todasLasVentas.length,
      datosPorMes: datosPorMes,
      fechasUnicas: Object.keys(datosPorMes).sort()
    });

  } catch (error) {
    console.error('Error en debug data:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Dashboard de Ventas
const getDashboardVentas = async (req, res) => {
  try {
    const { mes, anio } = req.query;
    const mesNum = parseInt(mes) || new Date().getMonth();
    const anioNum = parseInt(anio) || new Date().getFullYear();
    
    console.log(`Consultando ventas para mes: ${mesNum}, año: ${anioNum}`);
    
    // Fechas del mes
    const fechaInicio = new Date(anioNum, mesNum, 1);
    const fechaFin = new Date(anioNum, mesNum + 1, 0);
    
    // Ventas del mes
    const ventasMes = await OrdenVenta.findAll({
      where: {
        fechaEmision: {
          [Op.between]: [fechaInicio, fechaFin]
        }
      }
    });

    console.log(`Encontradas ${ventasMes.length} órdenes de venta`);

    // Detalles de ventas del mes
    const detallesVentas = await DetalleOrdenVta.findAll({
      include: [{
        model: OrdenVenta,
        where: {
          fechaEmision: {
            [Op.between]: [fechaInicio, fechaFin]
          }
        }
      }]
    });

    console.log(`Encontrados ${detallesVentas.length} detalles de venta`);

    // Ventas por día usando la función auxiliar
    const ventasPorDia = {};
    const diasEnMes = fechaFin.getDate();
    
    for (let dia = 1; dia <= diasEnMes; dia++) {
      const ventasDelDia = ventasMes.filter(v => {
        const diaVenta = getDayFromDate(v.fechaEmision);
        return diaVenta === dia;
      });
      
      const totalDelDia = ventasDelDia.reduce((acc, venta) => {
        const detallesVenta = detallesVentas.filter(d => d.NroOrdenVta === venta.NroOrdenVta);
        return acc + detallesVenta.reduce((sum, detalle) => 
          sum + (detalle.cantidadRequerida || 0), 0
        );
      }, 0);
      
      ventasPorDia[dia] = totalDelDia;
    }

    // Últimos 12 días para la gráfica (o todos si hay menos de 12)
    const ultimos12Dias = Object.entries(ventasPorDia)
      .slice(-12)
      .map(([dia, valor]) => ({ dia: parseInt(dia), valor }));

    // KPIs
    const totalVentas = Object.values(ventasPorDia).reduce((acc, v) => acc + v, 0);
    const promedioDiario = diasEnMes > 0 ? totalVentas / diasEnMes : 0;
    
    // Calcular venta del día actual (solo si estamos en el mes/año seleccionado)
    const hoy = new Date();
    const ventaHoy = (hoy.getFullYear() === anioNum && hoy.getMonth() === mesNum) 
      ? ventasPorDia[hoy.getDate()] || 0 
      : 0;
    
    const ticketPromedio = ventasMes.length > 0 ? totalVentas / ventasMes.length : 0;

    // Top productos del mes
    const productosCount = {};
    
    detallesVentas.forEach(detalle => {
      const nombre = detalle.descripcionMed || 'Sin descripción';
      productosCount[nombre] = (productosCount[nombre] || 0) + detalle.cantidadRequerida;
    });
    
    const topProductos = Object.entries(productosCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([nombre, cantidad]) => ({
        nombre,
        actual: cantidad,
        anterior: 0 // Por ahora sin comparación
      }));

    console.log('KPIs calculados:', {
      promedioDiario,
      totalVentas,
      ventaHoy,
      ticketPromedio
    });

    res.json({
      kpis: {
        promedioDiario,
        totalVentas,
        ventaHoy,
        ticketPromedio
      },
      ventasDiarias: ultimos12Dias,
      topProductos: topProductos
    });

  } catch (error) {
    console.error('Error en dashboard ventas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Dashboard de Compras
const getDashboardCompras = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    console.log(`Consultando compras desde: ${fechaInicio} hasta: ${fechaFin}`);

    // Compras del período
    const comprasPeriodo = await OrdenCompra.findAll({
      where: {
        fechaEmision: {
          [Op.between]: [inicio, fin]
        }
      }
    });

    console.log(`Encontradas ${comprasPeriodo.length} órdenes de compra`);

    // Detalles de compras del período
    const detallesCompras = await DetalleOrdenCompra.findAll({
      include: [{
        model: OrdenCompra,
        where: {
          fechaEmision: {
            [Op.between]: [inicio, fin]
          }
        }
      }]
    });

    console.log(`Encontrados ${detallesCompras.length} detalles de compra`);

    // === LÓGICA IGUAL A VENTAS ===
    // Compras por día usando la función auxiliar
    const comprasPorDia = {};
    const diasEnMes = new Date(fin.getFullYear(), fin.getMonth() + 1, 0).getDate();

    for (let dia = 1; dia <= diasEnMes; dia++) {
      const comprasDelDia = comprasPeriodo.filter(c => {
        const diaCompra = getDayFromDate(c.fechaEmision);
        return diaCompra === dia;
      });

      const totalDelDia = comprasDelDia.reduce((acc, compra) =>
        acc + parseFloat(compra.Total || 0), 0
      );

      comprasPorDia[dia] = totalDelDia;
    }

    // Últimos 12 días para la gráfica (o todos si hay menos de 12)
    const ultimos12Dias = Array.from({ length: diasEnMes }, (_, i) => ({
      dia: i + 1,
      valor: comprasPorDia[i + 1] || 0
    })).slice(-12);

    // KPIs
    const totalCompras = Object.values(comprasPorDia).reduce((acc, v) => acc + v, 0);
    const promedioDiario = diasEnMes > 0 ? totalCompras / diasEnMes : 0;

    // Calcular compra del día actual (solo si estamos en el período seleccionado)
    const hoy = new Date();
    const compraHoy = (hoy >= inicio && hoy <= fin)
      ? comprasPorDia[hoy.getDate()] || 0
      : 0;

    const ticketPromedio = comprasPeriodo.length > 0 ? totalCompras / comprasPeriodo.length : 0;
    const cantidadCompras = comprasPeriodo.length;

    // Top productos más comprados
    const productosCount = {};

    detallesCompras.forEach(detalle => {
      const nombre = detalle.descripcion || 'Sin descripción';
      productosCount[nombre] = (productosCount[nombre] || 0) + detalle.cantidad;
    });

    const topProductos = Object.entries(productosCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([nombre, cantidad]) => ({
        nombre,
        actual: parseInt(cantidad),
        anterior: 0 // Si quieres comparar con el mes anterior, aquí puedes poner el valor real
      }));

    console.log('KPIs calculados:', {
      promedioDiario,
      totalCompras,
      compraHoy,
      ticketPromedio,
      cantidadCompras
    });

    res.json({
      kpis: {
        promedioDiario,
        compraHoy,
        totalCompras,
        ticketPromedio,
        cantidadCompras
      },
      comprasDiarias: ultimos12Dias,
      topProductos: topProductos
    });

  } catch (error) {
    console.error('Error en dashboard compras:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getDashboardVentas,
  getDashboardCompras,
  getDebugData
}; 