'use client';

import { useState } from 'react';
import { FiMenu, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';

export default function Header({ onMenuClick, sidebarOpen }) {
  const { user, logout, isAuthenticated } = useAuth();
  const { data: session } = useSession();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    if (session) {
      // Si hay sesión de NextAuth, cerrar sesión de Google
      nextAuthSignOut();
    }
    // Cerrar sesión local
    logout();
    setShowLogoutModal(false);
  };

  return (
    <>
      <header className="w-full h-16 flex items-center justify-between px-8 bg-white border-b shadow-sm fixed left-0 top-0 z-10 md:ml-64">
        {/* Botón hamburguesa: visible en móvil o cuando sidebar está oculto */}
        <button
          className={`md:hidden ${sidebarOpen ? 'hidden' : ''}`}
          onClick={onMenuClick}
        >
          <FiMenu size={28} />
        </button>
        
        <span className="text-xl font-semibold text-blue-800">FarmaTech</span>
        
        {/* Información del usuario y botón de logout */}
        <div className="flex items-center space-x-4">
          {isAuthenticated() && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                <FiUser size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.nombre || 'Usuario'}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  user?.rol === 'Administrator' ? 'bg-red-100 text-red-800' :
                  user?.rol === 'Vendor' ? 'bg-green-100 text-green-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {user?.rol}
                </span>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                title="Cerrar sesión"
              >
                <FiLogOut size={16} />
                <span className="text-sm">Salir</span>
              </button>
            </div>
          )}
          
          {session && !isAuthenticated() && (
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
                <FiUser size={16} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {session.user?.name || 'Usuario Google'}
                </span>
              </div>
              <button
                onClick={() => setShowLogoutModal(true)}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                title="Cerrar sesión"
              >
                <FiLogOut size={16} />
                <span className="text-sm">Salir</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Modal de confirmación para cerrar sesión */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirmar cierre de sesión</h2>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres cerrar sesión? 
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-red-600 bg-red-600 text-white hover:bg-red-700 hover:border-red-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}