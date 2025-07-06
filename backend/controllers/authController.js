const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

// Generar token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario.id, 
      username: usuario.username, 
      rol: usuario.rol 
    },
    process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro',
    { expiresIn: '24h' }
  );
};

// Registro de usuario
const registrar = async (req, res) => {
  try {
    const { username, password, nombre, apellido, email, rol } = req.body;

    // Validar que el usuario no exista
    const usuarioExistente = await Usuario.findOne({
      where: { username }
    });

    if (usuarioExistente) {
      return res.status(400).json({
        mensaje: 'El nombre de usuario ya existe'
      });
    }

    // Validar que el email no exista
    const emailExistente = await Usuario.findOne({
      where: { email }
    });

    if (emailExistente) {
      return res.status(400).json({
        mensaje: 'El email ya está registrado'
      });
    }

    // Crear nuevo usuario
    const nuevoUsuario = await Usuario.create({
      username,
      password,
      nombre,
      apellido,
      email,
      rol: rol || 'Vendedor'
    });

    // Generar token
    const token = generarToken(nuevoUsuario);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      token,
      usuario: {
        id: nuevoUsuario.id,
        username: nuevoUsuario.username,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Buscar usuario
    const usuario = await Usuario.findOne({
      where: { username }
    });

    if (!usuario) {
      return res.status(401).json({
        mensaje: 'Credenciales inválidas'
      });
    }

    // Verificar si el usuario está activo
    if (!usuario.activo) {
      return res.status(401).json({
        mensaje: 'Usuario inactivo'
      });
    }

    // Validar contraseña
    const passwordValida = await usuario.validarPassword(password);
    if (!passwordValida) {
      return res.status(401).json({
        mensaje: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generarToken(usuario);

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.id,
        username: usuario.username,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

// Obtener perfil del usuario actual
const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['password'] }
    });

    res.json({
      usuario
    });

  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

// Obtener todos los usuarios (solo administradores)
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] },
      order: [['fechaCreacion', 'DESC']]
    });

    res.json({
      usuarios
    });

  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

// Obtener un usuario específico (solo administradores)
const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password'] }
    });

    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      usuario
    });

  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, rol, activo } = req.body;

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });
    }

    // Solo administradores pueden cambiar roles
    if (rol && req.usuario.rol !== 'Administrador') {
      return res.status(403).json({
        mensaje: 'No tienes permisos para cambiar roles'
      });
    }

    await usuario.update({
      nombre,
      apellido,
      email,
      rol: req.usuario.rol === 'Administrador' ? rol : usuario.rol,
      activo
    });

    res.json({
      mensaje: 'Usuario actualizado exitosamente',
      usuario: {
        id: usuario.id,
        username: usuario.username,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        activo: usuario.activo
      }
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

// Eliminar usuario (solo administradores)
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // No permitir eliminar el propio usuario
    if (parseInt(id) === req.usuario.id) {
      return res.status(400).json({
        mensaje: 'No puedes eliminar tu propia cuenta'
      });
    }

    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });
    }

    // En lugar de eliminar físicamente, desactivar el usuario
    await usuario.update({ activo: false });

    res.json({
      mensaje: 'Usuario desactivado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

// Cambiar contraseña
const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;
    const usuario = await Usuario.findByPk(req.usuario.id);

    // Validar contraseña actual
    const passwordValida = await usuario.validarPassword(passwordActual);
    if (!passwordValida) {
      return res.status(400).json({
        mensaje: 'Contraseña actual incorrecta'
      });
    }

    // Actualizar contraseña
    await usuario.update({ password: passwordNueva });

    res.json({
      mensaje: 'Contraseña actualizada exitosamente'
    });

  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({
      mensaje: 'Error interno del servidor'
    });
  }
};

module.exports = {
  registrar,
  login,
  obtenerPerfil,
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario,
  cambiarPassword
}; 