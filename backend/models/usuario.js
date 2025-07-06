const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  id: { 
    type: DataTypes.INTEGER, 
    primaryKey: true, 
    autoIncrement: true 
  },
  username: { 
    type: DataTypes.STRING(50), 
    unique: true, 
    allowNull: false 
  },
  password: { 
    type: DataTypes.STRING(255), 
    allowNull: false 
  },
  nombre: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  apellido: { 
    type: DataTypes.STRING(100), 
    allowNull: false 
  },
  email: { 
    type: DataTypes.STRING(100), 
    unique: true, 
    allowNull: false 
  },
  rol: { 
    type: DataTypes.ENUM('Administrador', 'Vendedor', 'Comprador'), 
    allowNull: false,
    defaultValue: 'Vendedor'
  },
  activo: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  fechaCreacion: { 
    type: DataTypes.DATE, 
    defaultValue: DataTypes.NOW 
  }
}, { 
  tableName: 'Usuario', 
  timestamps: false,
  hooks: {
    beforeCreate: async (usuario) => {
      if (usuario.password) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        usuario.password = await bcrypt.hash(usuario.password, salt);
      }
    }
  }
});

// Método para comparar contraseñas
Usuario.prototype.validarPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = Usuario; 