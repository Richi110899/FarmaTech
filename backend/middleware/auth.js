const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// Middleware para verificar el token JWT
const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        mensaje: 'Token de acceso requerido' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro');
    const usuario = await Usuario.findByPk(decoded.id);
    
    if (!usuario || !usuario.activo) {
      return res.status(401).json({ 
        mensaje: 'Usuario no válido o inactivo' 
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({ 
      mensaje: 'Token inválido' 
    });
  }
};

// Middleware para verificar roles específicos
const verificarRol = (roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({ 
        mensaje: 'Usuario no autenticado' 
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ 
        mensaje: 'No tienes permisos para realizar esta acción' 
      });
    }

    next();
  };
};

// Roles específicos
const esAdministrador = verificarRol(['Administrador']);
const esVendedor = verificarRol(['Administrador', 'Vendedor']);
const esComprador = verificarRol(['Administrador', 'Comprador']);

module.exports = {
  verificarToken,
  verificarRol,
  esAdministrador,
  esVendedor,
  esComprador
}; 