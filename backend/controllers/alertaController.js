const { Medicamento } = require('../models');
const { Op } = require('sequelize');

// Obtener alertas de stock mínimo
const obtenerAlertasStock = async (req, res) => {
  try {
    const medicamentos = await Medicamento.findAll({
      where: {
        alertaStock: true,
        stock: {
          [Op.lte]: sequelize.col('stockMinimo')
        }
      },
      include: [
        {
          model: require('./especialidad'),
          as: 'Especialidad',
          attributes: ['descripcionEsp']
        },
        {
          model: require('./tipoMedic'),
          as: 'TipoMedic',
          attributes: ['descripcion']
        }
      ]
    });

    const alertas = medicamentos.map(med => ({
      id: med.CodMedicamento,
      descripcion: med.descripcionMed,
      stockActual: med.stock,
      stockMinimo: med.stockMinimo,
      diferencia: med.stockMinimo - med.stock,
      especialidad: med.Especialidad?.descripcionEsp,
      tipo: med.TipoMedic?.descripcion,
      marca: med.Marca,
      presentacion: med.Presentacion
    }));

    res.json({
      alertas,
      total: alertas.length,
      mensaje: `Se encontraron ${alertas.length} medicamentos con stock bajo`
    });

  } catch (error) {
    console.error('Error al obtener alertas de stock:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

// Obtener alertas de vencimiento
const obtenerAlertasVencimiento = async (req, res) => {
  try {
    const { dias = 30 } = req.query;
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + parseInt(dias));

    const medicamentos = await Medicamento.findAll({
      where: {
        alertaVencimiento: true,
        fechaVencimiento: {
          [Op.lte]: fechaLimite
        },
        stock: {
          [Op.gt]: 0
        }
      },
      include: [
        {
          model: require('./especialidad'),
          as: 'Especialidad',
          attributes: ['descripcionEsp']
        },
        {
          model: require('./tipoMedic'),
          as: 'TipoMedic',
          attributes: ['descripcion']
        }
      ],
      order: [['fechaVencimiento', 'ASC']]
    });

    const alertas = medicamentos.map(med => {
      const diasRestantes = Math.ceil((new Date(med.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24));
      
      return {
        id: med.CodMedicamento,
        descripcion: med.descripcionMed,
        fechaVencimiento: med.fechaVencimiento,
        diasRestantes: diasRestantes,
        stock: med.stock,
        especialidad: med.Especialidad?.descripcionEsp,
        tipo: med.TipoMedic?.descripcion,
        marca: med.Marca,
        presentacion: med.Presentacion,
        estado: diasRestantes < 0 ? 'VENCIDO' : diasRestantes <= 7 ? 'CRÍTICO' : 'ADVERTENCIA'
      };
    });

    res.json({
      alertas,
      total: alertas.length,
      diasConsultados: dias,
      mensaje: `Se encontraron ${alertas.length} medicamentos próximos a vencer`
    });

  } catch (error) {
    console.error('Error al obtener alertas de vencimiento:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

// Obtener todas las alertas (stock y vencimiento)
const obtenerTodasAlertas = async (req, res) => {
  try {
    const [alertasStock, alertasVencimiento] = await Promise.all([
      obtenerAlertasStock(req, res),
      obtenerAlertasVencimiento(req, res)
    ]);

    res.json({
      stock: alertasStock,
      vencimiento: alertasVencimiento,
      total: alertasStock.total + alertasVencimiento.total
    });

  } catch (error) {
    console.error('Error al obtener todas las alertas:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

// Actualizar configuración de alertas de un medicamento
const actualizarConfiguracionAlertas = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockMinimo, alertaStock, alertaVencimiento, diasAlertaVencimiento } = req.body;

    const medicamento = await Medicamento.findByPk(id);
    if (!medicamento) {
      return res.status(404).json({
        mensaje: 'Medicamento no encontrado'
      });
    }

    await medicamento.update({
      stockMinimo: stockMinimo || medicamento.stockMinimo,
      alertaStock: alertaStock !== undefined ? alertaStock : medicamento.alertaStock,
      alertaVencimiento: alertaVencimiento !== undefined ? alertaVencimiento : medicamento.alertaVencimiento,
      diasAlertaVencimiento: diasAlertaVencimiento || medicamento.diasAlertaVencimiento
    });

    res.json({
      mensaje: 'Configuración de alertas actualizada exitosamente',
      medicamento: {
        id: medicamento.CodMedicamento,
        descripcion: medicamento.descripcionMed,
        stockMinimo: medicamento.stockMinimo,
        alertaStock: medicamento.alertaStock,
        alertaVencimiento: medicamento.alertaVencimiento,
        diasAlertaVencimiento: medicamento.diasAlertaVencimiento
      }
    });

  } catch (error) {
    console.error('Error al actualizar configuración de alertas:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

// Obtener resumen de alertas para dashboard
const obtenerResumenAlertas = async (req, res) => {
  try {
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() + 30);

    const [stockBajo, proximosVencer, vencidos] = await Promise.all([
      // Stock bajo
      Medicamento.count({
        where: {
          alertaStock: true,
          stock: {
            [Op.lte]: sequelize.col('stockMinimo')
          }
        }
      }),
      // Próximos a vencer
      Medicamento.count({
        where: {
          alertaVencimiento: true,
          fechaVencimiento: {
            [Op.lte]: fechaLimite,
            [Op.gt]: new Date()
          },
          stock: {
            [Op.gt]: 0
          }
        }
      }),
      // Vencidos
      Medicamento.count({
        where: {
          fechaVencimiento: {
            [Op.lt]: new Date()
          },
          stock: {
            [Op.gt]: 0
          }
        }
      })
    ]);

    res.json({
      resumen: {
        stockBajo,
        proximosVencer,
        vencidos,
        total: stockBajo + proximosVencer + vencidos
      },
      fechaConsulta: new Date()
    });

  } catch (error) {
    console.error('Error al obtener resumen de alertas:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

module.exports = {
  obtenerAlertasStock,
  obtenerAlertasVencimiento,
  obtenerTodasAlertas,
  actualizarConfiguracionAlertas,
  obtenerResumenAlertas
}; 