// Configuración de permisos por rol
const permisos = {
  Administrador: {
    // Gestión de usuarios
    usuarios: ['crear', 'leer', 'actualizar', 'eliminar'],
    
    // Gestión de medicamentos
    medicamentos: ['crear', 'leer', 'actualizar', 'eliminar'],
    especialidades: ['crear', 'leer', 'actualizar', 'eliminar'],
    tipos: ['crear', 'leer', 'actualizar', 'eliminar'],
    
    // Gestión de laboratorios
    laboratorios: ['crear', 'leer', 'actualizar', 'eliminar'],
    
    // Órdenes de venta
    ordenesVenta: ['crear', 'leer', 'actualizar', 'eliminar', 'anular'],
    detallesVenta: ['crear', 'leer', 'actualizar', 'eliminar'],
    
    // Órdenes de compra
    ordenesCompra: ['crear', 'leer', 'actualizar', 'eliminar', 'anular'],
    detallesCompra: ['crear', 'leer', 'actualizar', 'eliminar'],
    
    // Alertas
    alertas: ['leer', 'configurar'],
    
    // Reportes
    reportes: ['ventas', 'compras', 'inventario', 'usuarios'],
    
    // Configuración del sistema
    configuracion: ['general', 'backup', 'restore']
  },
  
  Vendedor: {
    // Solo puede ver medicamentos
    medicamentos: ['leer'],
    especialidades: ['leer'],
    tipos: ['leer'],
    
    // Gestión de ventas
    ordenesVenta: ['crear', 'leer', 'actualizar'],
    detallesVenta: ['crear', 'leer', 'actualizar'],
    
    // Solo puede ver compras
    ordenesCompra: ['leer'],
    detallesCompra: ['leer'],
    
    // Alertas
    alertas: ['leer'],
    
    // Reportes limitados
    reportes: ['ventas']
  },
  
  Comprador: {
    // Solo puede ver medicamentos
    medicamentos: ['leer'],
    especialidades: ['leer'],
    tipos: ['leer'],
    
    // Solo puede ver ventas
    ordenesVenta: ['leer'],
    detallesVenta: ['leer'],
    
    // Gestión de compras
    ordenesCompra: ['crear', 'leer', 'actualizar'],
    detallesCompra: ['crear', 'leer', 'actualizar'],
    
    // Alertas
    alertas: ['leer'],
    
    // Reportes limitados
    reportes: ['compras']
  }
};

// Función para verificar si un rol tiene un permiso específico
const tienePermiso = (rol, recurso, accion) => {
  if (!permisos[rol]) return false;
  if (!permisos[rol][recurso]) return false;
  return permisos[rol][recurso].includes(accion);
};

// Función para obtener todos los permisos de un rol
const obtenerPermisosRol = (rol) => {
  return permisos[rol] || {};
};

// Función para verificar acceso a rutas
const verificarAccesoRuta = (rol, ruta) => {
  const rutasPermitidas = {
    Administrador: [
      '/api/auth/usuarios',
      '/api/usuarios',
      '/api/medicamentos',
      '/api/especialidades', 
      '/api/tipos',
      '/api/laboratorios',
      '/api/ordenes-venta',
      '/api/detalles-venta',
      '/api/ordenes-compra',
      '/api/detalles-compra',
      '/api/alertas'
    ],
    Vendedor: [
      '/api/medicamentos',
      '/api/especialidades',
      '/api/tipos', 
      '/api/ordenes-venta',
      '/api/detalles-venta',
      '/api/ordenes-compra',
      '/api/detalles-compra',
      '/api/alertas'
    ],
    Comprador: [
      '/api/medicamentos',
      '/api/especialidades',
      '/api/tipos',
      '/api/ordenes-venta', 
      '/api/detalles-venta',
      '/api/ordenes-compra',
      '/api/detalles-compra',
      '/api/alertas'
    ]
  };
  
  return rutasPermitidas[rol]?.some(rutaPermitida => 
    ruta.startsWith(rutaPermitida)
  ) || false;
};

module.exports = {
  permisos,
  tienePermiso,
  obtenerPermisosRol,
  verificarAccesoRuta
}; 