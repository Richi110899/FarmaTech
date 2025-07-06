const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Medicamento = sequelize.define('Medicamento', {
  CodMedicamento: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  descripcionMed: DataTypes.STRING,
  fechaFabricacion: DataTypes.DATE,
  fechaVencimiento: DataTypes.DATE,
  Presentacion: DataTypes.STRING,
  stock: DataTypes.INTEGER,
  stockMinimo: { 
    type: DataTypes.INTEGER, 
    defaultValue: 10,
    allowNull: false 
  },
  precioVentaUni: DataTypes.DECIMAL(10,2),
  CodTipoMed: DataTypes.INTEGER,
  Marca: DataTypes.STRING,
  CodEspec: DataTypes.INTEGER,
  alertaStock: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  alertaVencimiento: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  diasAlertaVencimiento: { 
    type: DataTypes.INTEGER, 
    defaultValue: 30 
  }
}, { tableName: 'Medicamento', timestamps: false });

module.exports = Medicamento;