'use client';

import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import { FiChevronRight, FiUsers, FiBarChart2 } from 'react-icons/fi';
import { signOut, useSession } from "next-auth/react";
import { useAuth } from '@/contexts/AuthContext';

const rawMenu = [
  {
    label: 'Venta',
    color: 'emerald',
    roles: ['Administrador', 'Vendedor'],
    sub: [
      { label: 'Orden de Venta', href: '/ordenes-venta', roles: ['Administrador', 'Vendedor'] },
      { label: 'Detalle de Venta', href: '/detalle-orden-venta', roles: ['Administrador', 'Vendedor'] },
    ],
  },
  {
    label: 'Compra',
    color: 'blue',
    roles: ['Administrador', 'Comprador'],
    sub: [
      { label: 'Orden de Compra', href: '/ordenes-compra', roles: ['Administrador', 'Comprador'] },
      { label: 'Detalle de Compra', href: '/detalle-orden-compra', roles: ['Administrador', 'Comprador'] },
    ],
  },
  {
    label: 'Catálogos',
    color: 'violet',
    roles: ['Administrador', 'Vendedor', 'Comprador'],
    sub: [
      { label: 'Medicamentos', href: '/medicamentos', roles: ['Administrador', 'Vendedor', 'Comprador'] },
      { label: 'Laboratorios', href: '/laboratorios', roles: ['Administrador'] },
      { label: 'Tipos de Medicamento', href: '/medicamentos/tipos', roles: ['Administrador'] },
      { label: 'Especialidades', href: '/medicamentos/especialidades', roles: ['Administrador'] },
    ],
  },
  {
    label: 'Usuarios',
    color: 'orange',
    roles: ['Administrador'],
    sub: [
      { label: 'Lista de usuarios', href: '/usuarios', roles: ['Administrador'] },
    ],
  },
  {
    label: 'Reportes',
    color: 'red',
    roles: ['Administrador', 'Vendedor', 'Comprador'],
    sub: [
      { label: 'Ventas', href: '/reportes/ventas/', roles: ['Administrador', 'Vendedor'] },
      { label: 'Compras', href: '/reportes/compras/', roles: ['Administrador', 'Comprador'] },
    ],
  },
];

const colorClasses = {
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    hover: 'hover:bg-emerald-100',
    icon: 'text-emerald-600'
  },
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    hover: 'hover:bg-blue-100',
    icon: 'text-blue-600'
  },
  violet: {
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    text: 'text-violet-700',
    hover: 'hover:bg-violet-100',
    icon: 'text-violet-600'
  },
  orange: {
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    text: 'text-orange-700',
    hover: 'hover:bg-orange-100',
    icon: 'text-orange-600'
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    hover: 'hover:bg-red-100',
    icon: 'text-red-600'
  }
};

export default function Sidebar({ mobile = false, onNavigate }) {
  const { data: session } = useSession();
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState({});
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const userRole = user?.rol;

  // Filtrar menú y submenús según el rol SOLO si hay userRole
  const menu = userRole
    ? rawMenu
        .map(item => {
          if (!item.roles || item.roles.includes(userRole)) {
            const filteredSub = item.sub.filter(sub => !sub.roles || sub.roles.includes(userRole));
            if (filteredSub.length > 0) {
              return { ...item, sub: filteredSub };
            }
          }
          return null;
        })
        .filter(Boolean)
    : [];

  // Memoizar cálculos para mejor rendimiento
  const { checkIsAdmin, userInfo } = useMemo(() => {
    const checkIsAdmin = () => {
      if (isAuthenticated() && user) {
        return user.rol === 'Administrador';
      }
      if (session?.user) {
        return session.user.rol === 'Administrador';
      }
      return false;
    };

    const getUserInfo = () => {
      if (isAuthenticated() && user) {
        return {
          name: `${user.nombre} ${user.apellido}`,
          role: user.rol
        };
      }
      if (session?.user) {
        return {
          name: session.user.name || `${session.user.nombre} ${session.user.apellido}`,
          role: session.user.rol || 'Usuario Google'
        };
      }
      return null;
    };

    return {
      checkIsAdmin,
      userInfo: getUserInfo()
    };
  }, [isAuthenticated, user, session]);

  // Cerrar modal con Escape
  useEffect(() => {
    if (!showLogoutModal) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setShowLogoutModal(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showLogoutModal]);

  const toggle = (label) => {
    setOpen((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' }); // Cierra sesión en NextAuth y tu app
    logout(); // Limpia el contexto y localStorage
    setShowLogoutModal(false);
  };

  return (
    <>
    <aside className={`h-screen w-64 bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 flex-col fixed left-0 top-0 z-20 shadow-xl ${mobile ? '' : 'hidden md:flex'}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <Link href="/" className="focus:outline-none group">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <span className="text-blue-600 text-xl font-bold">FT</span>
            </div>
            <div>
              <h1 className="font-bold text-2xl text-white tracking-wide">FarmaTech</h1>
            </div>
          </div>
        </Link>
      </div>

      {/* Mostrar el usuario logueado */}
      <div className="px-6 py-4">
        {userInfo ? (
          <div>
            <p className="text-sm font-semibold pb-1">Hola, {userInfo.name}</p>
            <p className="text-xs text-gray-600">{userInfo.role}</p>
          </div>
        ) : (
            <div className="h-8" />
        )}
      </div>

        {/* Navigation (restaurar estilos originales) */}
        {userRole && menu.length > 0 && (
      <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
        {menu.map((item) => {
          const colors = colorClasses[item.color];
          return (
            <div key={item.label} className="relative">
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  open[item.label] 
                    ? `${colors.bg} ${colors.border} border-2 shadow-md` 
                    : 'hover:bg-slate-100 border-2 border-transparent'
                }`}
                onClick={() => toggle(item.label)}
                aria-expanded={open[item.label] ? 'true' : 'false'}
              >
                {item.icon && <item.icon className={`text-lg ${open[item.label] ? colors.icon : 'text-slate-400'}`} />}
                <div className="flex-1 text-left">
                      <span className={`font-semibold text-sm ${open[item.label] ? colors.text : 'text-slate-700'}`}>{item.label}</span>
                </div>
                <div className={`transition-transform duration-300 ${open[item.label] ? 'rotate-90' : ''}`}>
                  <FiChevronRight className={`text-lg ${open[item.label] ? colors.icon : 'text-slate-400'}`} />
                </div>
              </button>
              {/* Submenu */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open[item.label] ? 'max-h-60 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
              >
                <div className={`ml-4 pl-4 border-l-2 ${colors.border} space-y-1`}>
                  {item.sub.map((sub) => (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg text-slate-700 ${colors.hover} hover:shadow-sm transition-all duration-200 group`}
                      onClick={onNavigate}
                    >
                      <div>
                        <div className="font-medium text-sm">{sub.label}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
        )}

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <button
            onClick={() => setShowLogoutModal(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group hover:bg-slate-100 border-2 border-transparent hover:border-slate-200"
        >
          <div className="flex-1 text-left">
            <span className="font-semibold text-sm text-slate-700">Cerrar sesión</span>
          </div>
        </button>
      </div>
    </aside>

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
