"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { loginUser } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";

// Floating label input reutilizable
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

export default function AuthForm() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Referencias para inputs
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    if (session && pathname === "/login") {
      router.replace("/");
    }
  }, [session, pathname, router]);

  // Hack para forzar fondo blanco en autofill
  useEffect(() => {
    // Esperar a que el navegador aplique autofill
    setTimeout(() => {
      [emailRef.current, passwordRef.current].forEach((input) => {
        if (input) {
          input.style.backgroundColor = "#fff";
        }
      });
    }, 100);
  }, []);

  const handleLocalLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Por favor, completa todos los campos.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await loginUser({ email, password });
      if (response.success) {
        login(response.user, response.token);
        router.replace("/");
      } else {
        setErrorMessage(response.message || "Credenciales incorrectas");
      }
    } catch (error) {
      setErrorMessage("Error de conexión. Intenta nuevamente.");
    }
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");
    try {
      await signIn("google", { callbackUrl: "/", redirect: false });
    } catch (error) {
      setErrorMessage("Error de conexión con Google");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen from-blue-50 via-white to-indigo-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
        {/* Header - Solo logo */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-white text-3xl font-bold">FT</span>
          </div>
        </div>
        <form onSubmit={handleLocalLogin} className="space-y-2">
          <FloatingInput
            label="Correo electrónico"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            name="email"
            required
            autoComplete="username"
            inputRef={emailRef}
          />
          <div className="mb-10">
            <FloatingInput
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              name="password"
              required
              autoComplete="current-password"
              showPassword={showPassword}
              togglePassword={() => setShowPassword((prev) => !prev)}
              inputRef={passwordRef}
            />
          </div>
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-2">
              <FiAlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium transition-all duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mb-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Iniciando sesión...
              </div>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>
        {/* Separador */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500 font-medium">O continuar con</span>
          </div>
        </div>
        {/* Botón de Google */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {/* SVG oficial Google */}
          <span className="flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <g>
                <path d="M17.64 9.2045C17.64 8.5665 17.5827 7.95225 17.4764 7.3635H9V10.845H13.8436C13.635 11.97 12.9645 12.915 12.009 13.5645V15.5775H14.8227C16.482 14.085 17.64 11.901 17.64 9.2045Z" fill="#4285F4"/>
                <path d="M9 18C11.43 18 13.47 17.1825 14.8227 15.5775L12.009 13.5645C11.307 14.034 10.341 14.3175 9 14.3175C6.6555 14.3175 4.6785 12.717 3.9645 10.635H1.0515V12.7125C2.397 15.6145 5.4195 18 9 18Z" fill="#34A853"/>
                <path d="M3.9645 10.635C3.7845 10.1655 3.681 9.657 3.681 9.135C3.681 8.613 3.7845 8.1045 3.9645 7.635V5.5575H1.0515C0.3825 6.897 0 8.4525 0 10.135C0 11.8175 0.3825 13.373 1.0515 14.7125L3.9645 12.635V10.635Z" fill="#FBBC05"/>
                <path d="M9 3.6825C10.341 3.6825 11.307 4.034 12.009 4.5045L14.8227 2.4225C13.47 0.8175 11.43 0 9 0C5.4195 0 2.397 2.385 1.0515 5.2875L3.9645 7.635C4.6785 5.553 6.6555 3.6825 9 3.6825Z" fill="#EA4335"/>
              </g>
            </svg>
          </span>
          <span>Iniciar sesión con Google</span>
        </button>
        {/* Información de contacto */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿Necesitas acceso? <span className="font-medium text-blue-600">Contacta al administrador</span>
          </p>
        </div>
      </div>
    </div>
  );
}
