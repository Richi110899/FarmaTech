const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');

// Generar token JWT
const generarToken = (usuario) => {
  return jwt.sign(
    { 
      id: usuario.id, 
      email: usuario.email, 
      rol: usuario.rol 
    },
    process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro',
    { expiresIn: '24h' }
  );
};

// Login de usuario (local)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Por favor, completa todos los campos' });
    }
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Usuario no registrado' });
    }
    if (!usuario.activo) {
      return res.status(401).json({ success: false, message: 'Usuario inactivo' });
    }
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
    const token = generarToken(usuario);
    res.json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Login con Google OAuth
const loginGoogle = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Usuario no registrado' });
    }
    if (!usuario.activo) {
      return res.status(401).json({ success: false, message: 'Usuario inactivo' });
    }
    const token = generarToken(usuario);
    res.json({
      success: true,
      message: 'Login con Google exitoso',
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error en login Google:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Verificar usuario de Google (ahora también genera token)
const verifyGoogleUser = async (req, res) => {
  try {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ success: false, message: 'Usuario no registrado' });
    }
    if (!usuario.activo) {
      return res.status(401).json({ success: false, message: 'Usuario inactivo' });
    }
    const token = generarToken(usuario);
    res.json({
      success: true,
      message: 'Usuario verificado exitosamente',
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      },
      token
    });
  } catch (error) {
    console.error('Error verificando usuario Google:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Crear usuario
const crearUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol } = req.body;
    const emailExistente = await Usuario.findOne({ where: { email } });
    if (emailExistente) {
      return res.status(400).json({ success: false, message: 'El email ya está registrado' });
    }
    const nuevoUsuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      rol: rol || 'Vendedor'
    });
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      user: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol
      }
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Obtener perfil
const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id, { attributes: { exclude: ['password'] } });
    res.json({ success: true, user: usuario });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Obtener todos los usuarios
const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] },
      order: [['fechaCreacion', 'DESC']]
    });
    res.json({ success: true, users: usuarios });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Obtener un usuario específico
const obtenerUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id, { attributes: { exclude: ['password'] } });
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    res.json({ success: true, user: usuario });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Actualizar usuario
const actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, password, rol, activo } = req.body;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    if (email && email !== usuario.email) {
      const emailExistente = await Usuario.findOne({ where: { email } });
      if (emailExistente) {
        return res.status(400).json({ success: false, message: 'El email ya está registrado' });
      }
    }
    usuario.nombre = nombre || usuario.nombre;
    usuario.apellido = apellido || usuario.apellido;
    usuario.email = email || usuario.email;
    usuario.rol = rol || usuario.rol;
    usuario.activo = activo !== undefined ? activo : usuario.activo;
    if (password) {
      usuario.password = password;
    }
    await usuario.save();
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

// Eliminar usuario
const eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    usuario.activo = false;
    await usuario.save();
    res.json({ success: true, message: 'Usuario desactivado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

module.exports = {
  login,
  loginGoogle,
  verifyGoogleUser,
  crearUsuario,
  obtenerPerfil,
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  eliminarUsuario
}; 