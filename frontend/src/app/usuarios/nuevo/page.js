"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createUser, API_ENDPOINTS } from "@/services/api";
import { FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from "react-icons/fi";

// Floating label input reutilizable con ojo para contraseña
function FloatingInput({ label, type = "text", value, onChange, showPassword, togglePassword, inputRef, ...props }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value !== "";
  return (
    <div className="relative mb-8">
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={
          "peer h-12 w-full border-b-2 border-gray-300 text-gray-900 bg-white text-sm placeholder-transparent focus:outline-none focus:border-blue-600 pr-10 transition-colors"
        }
        placeholder={label}
        autoComplete="off"
        {...props}
      />
      <label
        className={
          "absolute left-0 transition-all pointer-events-none " +
          ((focused || hasValue)
            ? "-top-3.5 text-sm text-blue-600"
            : "top-3.5 text-sm text-gray-400")
        }
      >
        {label}
      </label>
      {typeof showPassword === 'boolean' && typeof togglePassword === 'function' && (
        <button
          type="button"
          tabIndex={-1}
          onClick={togglePassword}
          className="absolute right-0 top-1/2 -translate-y-1/2 pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
        </button>
      )}
    </div>
  );
}

// Floating label select
function FloatingSelect({ label, name, value, onChange, children, disabled, ...props }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value !== "";
  return (
    <div className="relative mb-8">
      <select
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        disabled={disabled}
        className={`peer h-12 w-full border-b-2 border-gray-300 text-gray-900 bg-transparent focus:outline-none focus:border-blue-600 text-sm appearance-none pl-3 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        {...props}
      >
        {children}
      </select>
      <label
        htmlFor={name}
        className={
          "absolute left-0 transition-all pointer-events-none " +
          ((focused || hasValue)
            ? "-top-3.5 text-sm text-blue-600"
            : "top-3.5 text-sm text-gray-400")
        }
      >
        {label}
      </label>
      <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
    </div>
  );
}

export default function NuevoUsuarioPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmPassword: "",
    rol: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Referencias para inputs
  const nombreRef = useRef(null);
  const apellidoRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Verificar autenticación y permisos
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (!token) {
      router.push('/login');
      return;
    }

    const user = userData ? JSON.parse(userData) : null;
    if (user && user.rol !== 'Administrador') {
      router.push('/');
      return;
    }
  }, [router]);

  // Hack para forzar fondo blanco en autofill
  useEffect(() => {
    setTimeout(() => {
      [nombreRef.current, apellidoRef.current, emailRef.current, passwordRef.current, confirmPasswordRef.current].forEach((input) => {
        if (input) {
          input.style.backgroundColor = "#fff";
        }
      });
    }, 100);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    // Validaciones
    if (!formData.nombre?.trim() || !formData.apellido?.trim() || !formData.email?.trim() || !formData.password?.trim() || !formData.rol?.trim()) {
      setErrorMessage("Todos los campos son obligatorios");
      setIsLoading(false);
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Formato de email inválido");
      setIsLoading(false);
      return;
    }

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const userData = {
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim(),
        password: formData.password,
        rol: formData.rol
      };

      const response = await createUser(userData, token);

      if (response.success) {
        setSuccessMessage("Usuario creado exitosamente");
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          password: "",
          confirmPassword: "",
          rol: ""
        });
      } else {
        setErrorMessage(response.message || "Error al crear usuario");
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage("Error de conexión. Intenta nuevamente.");
    }
    setIsLoading(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar mensajes cuando el usuario empiece a escribir
    if (errorMessage) setErrorMessage("");
  };

  return (
    <div className="w-full mx-auto mt-10 pr-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Crear Usuario</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full">
        {/* Mensaje de éxito o error dentro del card, encima del formulario */}
        {successMessage && (
          <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-200 text-left flex items-center gap-2">
            <FiCheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-200 text-left flex items-center gap-2">
            <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
          {/* Fila 1: Nombre y Apellido */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatingInput
              label="Nombre"
              type="text"
              value={formData.nombre}
              onChange={e => handleChange('nombre', e.target.value)}
              name="nombre"
              required
              autoComplete="given-name"
              inputRef={nombreRef}
            />
            <FloatingInput
              label="Apellido"
              type="text"
              value={formData.apellido}
              onChange={e => handleChange('apellido', e.target.value)}
              name="apellido"
              required
              autoComplete="family-name"
              inputRef={apellidoRef}
            />
          </div>

          {/* Fila 2: Email y Rol */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatingInput
              label="Correo electrónico"
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              name="email"
              required
              autoComplete="email"
              inputRef={emailRef}
            />
            <FloatingSelect
              label="Rol"
              name="rol"
              value={formData.rol}
              onChange={e => handleChange('rol', e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="" disabled hidden></option>
              <option value="Vendedor">Vendedor</option>
              <option value="Comprador">Comprador</option>
              <option value="Administrador">Administrador</option>
            </FloatingSelect>
          </div>

          {/* Fila 3: Contraseña y Confirmar Contraseña */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatingInput
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              name="password"
              required
              autoComplete="new-password"
              showPassword={showPassword}
              togglePassword={() => setShowPassword(prev => !prev)}
              inputRef={passwordRef}
            />
            <FloatingInput
              label="Confirmar contraseña"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              name="confirmPassword"
              required
              autoComplete="new-password"
              showPassword={showConfirmPassword}
              togglePassword={() => setShowConfirmPassword(prev => !prev)}
              inputRef={confirmPasswordRef}
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-6 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              onClick={() => router.push('/usuarios')}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 