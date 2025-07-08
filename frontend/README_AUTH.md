# Sistema de Autenticación - PibuFarma Frontend

## Características Implementadas

### 1. Autenticación Local
- Login con email y contraseña
- Gestión de usuarios (solo administradores)
- Roles de usuario: Administrator, Vendor, Buyer
- **Solo el administrador puede crear usuarios**

### 2. Autenticación con Google OAuth
- Login con Google (solo para usuarios creados por el administrador)
- El administrador debe crear la cuenta con el email de Google
- **Contraseñas independientes**: La contraseña del sistema es diferente a la de Google
- Validación automática de acceso

### 3. Gestión de Estado
- Contexto de autenticación global
- Persistencia de sesión en localStorage
- Protección de rutas

## Configuración

### 1. Variables de Entorno
Crear archivo `.env.local` en la raíz del frontend:

```env
# Configuración de la API del backend
NEXT_PUBLIC_API_URL=http://localhost:3001

# Configuración de NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-key-aqui-cambiala-en-produccion

# Configuración de Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id-aqui
GOOGLE_CLIENT_SECRET=tu-google-client-secret-aqui
```

### 2. Google OAuth Setup
1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un proyecto o seleccionar uno existente
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0
5. Agregar URIs de redirección:
   - `http://localhost:3000/api/auth/callback/google` (desarrollo)
   - `https://tu-dominio.com/api/auth/callback/google` (producción)

## Uso

### 1. Login Local
- Ir a `/login`
- Ingresar email y contraseña
- El sistema validará las credenciales con el backend

### 2. Usuario Administrador
- **Email**: ricardo.gomez@tecsup.edu.pe
- **Contraseña**: password
- **Rol**: Administrator
- **Acceso**: Gestión completa de usuarios y sistema

### 3. Gestión de Usuarios (Solo Administradores)
- Ir a `/usuarios`
- Ver lista de usuarios
- Crear nuevos usuarios (solo administradores)
- Editar usuarios existentes
- Eliminar usuarios
- **Importante**: Solo Ricardo puede crear nuevos usuarios

### 4. Login con Google
- **Importante**: Solo funciona si el administrador creó tu cuenta con email de Gmail
- En la página de login, hacer clic en "Iniciar sesión con Google"
- Autorizar la aplicación
- El sistema verificará si tienes acceso
- Si tienes acceso → redirigido al dashboard
- Si no tienes acceso → mensaje de error
- **Nota**: Usa la contraseña de tu cuenta de Google, no la del sistema

## Estructura de Archivos

```
frontend/src/
├── app/
│   ├── login/page.js          # Página de login
│   ├── usuarios/page.js       # Gestión de usuarios
│   └── api/auth/[...nextauth]/route.js  # Configuración NextAuth
├── components/
│   ├── AuthButton.js          # Componente de login
│   ├── AuthGuard.js           # Protección de rutas
│   ├── Header.js              # Header con info de usuario
│   └── Sidebar.js             # Sidebar con navegación
├── contexts/
│   └── AuthContext.js         # Contexto de autenticación
└── services/
    └── api.js                 # Funciones de API
```

## Funciones de API

### Autenticación
- `loginUser(credentials)` - Login local
- `loginGoogleUser(googleData)` - Login con Google OAuth
- `getUsers(token)` - Obtener lista de usuarios
- `createUser(userData, token)` - Crear usuario (solo admin)
- `updateUser(id, userData, token)` - Actualizar usuario
- `deleteUser(id, token)` - Eliminar usuario
- `getProfile(token)` - Obtener perfil del usuario

## Roles y Permisos

### Administrator
- Acceso completo a todas las funcionalidades
- Gestión de usuarios
- Todas las operaciones CRUD

### Vendor
- Gestión de ventas
- Catálogos de productos
- Reportes de ventas

### Buyer
- Gestión de compras
- Catálogos de productos
- Reportes de compras

## Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT para autenticación
- Validación de roles en frontend y backend
- Protección de rutas sensibles
- CORS configurado para desarrollo y producción

## Desarrollo

### Comandos
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Ejecutar en producción
npm start
```

### Testing
1. Asegurarse de que el backend esté ejecutándose en `http://localhost:3001`
2. Configurar las variables de entorno
3. Ejecutar el script `create_admin.sql` para crear el usuario Ricardo
4. Probar login local con ricardo.gomez@tecsup.edu.pe
5. Probar gestión de usuarios (como administrador)
6. Probar login con Google

## Notas Importantes

- **Control Total**: Solo el administrador puede crear usuarios
- **Google OAuth Restringido**: Solo funciona para usuarios creados por el admin
- **Doble Autenticación**: Los usuarios pueden usar email/password o Google
- **Contraseñas Independientes**: 
  - Login local: usa contraseña del sistema (creada por admin)
  - Google OAuth: usa contraseña de Google (externa al sistema)
- **Validación Automática**: El sistema verifica acceso antes de permitir login
- **Tokens JWT**: Se almacenan en localStorage para sesión persistente
- **NextAuth.js**: Maneja la autenticación con Google
- **Contexto Global**: Estado de autenticación disponible en toda la app
- **Protección de Rutas**: AuthGuard verifica acceso automáticamente
- **Gestión de Usuarios**: Solo administradores acceden a `/usuarios` 