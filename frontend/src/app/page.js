"use client";
import Link from 'next/link';
import { FiShoppingCart, FiClipboard, FiPackage, FiUsers, FiList, FiFileText, FiTag, FiTruck } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const allOptions = [
  {
    label: 'Órdenes de Venta',
    href: '/ordenes-venta',
    icon: <FiShoppingCart className="text-2xl text-emerald-600" />,
    roles: ['Administrador', 'Vendedor']
  },
  {
    label: 'Detalle de Venta',
    href: '/detalle-orden-venta',
    icon: <FiClipboard className="text-2xl text-emerald-500" />,
    roles: ['Administrador', 'Vendedor']
  },
  {
    label: 'Órdenes de Compra',
    href: '/ordenes-compra',
    icon: <FiTruck className="text-2xl text-blue-600" />,
    roles: ['Administrador', 'Comprador']
  },
  {
    label: 'Detalle de Compra',
    href: '/detalle-orden-compra',
    icon: <FiFileText className="text-2xl text-blue-500" />,
    roles: ['Administrador', 'Comprador']
  },
  {
    label: 'Medicamentos',
    href: '/medicamentos',
    icon: <FiPackage className="text-2xl text-violet-600" />,
    roles: ['Administrador', 'Vendedor', 'Comprador']
  },
  {
    label: 'Laboratorios',
    href: '/laboratorios',
    icon: <FiUsers className="text-2xl text-violet-500" />,
    roles: ['Administrador']
  },
  {
    label: 'Tipos de Medicamento',
    href: '/medicamentos/tipos',
    icon: <FiTag className="text-2xl text-orange-500" />,
    roles: ['Administrador']
  },
  {
    label: 'Especialidades',
    href: '/medicamentos/especialidades',
    icon: <FiList className="text-2xl text-orange-400" />,
    roles: ['Administrador']
  },
  {
    label: 'Usuarios',
    href: '/usuarios',
    icon: <FiUsers className="text-2xl text-blue-400" />,
    roles: ['Administrador']
  },
  {
    label: 'Reportes',
    href: '/reportes',
    icon: <FiFileText className="text-2xl text-green-500" />,
    roles: ['Administrador', 'Vendedor', 'Comprador']
  },
];

export default function Home() {
  const { user } = useAuth();
  const userRole = user?.rol;
  // Filtrar los cards según el rol
  const options = allOptions.filter(opt => !opt.roles || opt.roles.includes(userRole));

  // Determinar clases de grid y card según cantidad de opciones
  const isFew = options.length <= 4;
  const gridClass = isFew
    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full'
    : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 w-full max-w-5xl mx-auto';
  const cardClass = isFew
    ? 'flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl shadow hover:shadow-lg transition-all duration-200 p-10 group hover:scale-105 focus:outline-none min-h-[180px] text-xl w-full text-center'
    : 'flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl shadow hover:shadow-lg transition-all duration-200 p-6 group hover:scale-105 focus:outline-none min-h-[150px]';

  return (
    <div className="w-full mx-auto mt-10 pr-4 mr-8 flex items-start justify-center from-slate-50 to-white">
      <div className="w-full max-w-full bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-slate-100">
        <h1 className="text-4xl font-extrabold mb-2 text-blue-700 tracking-tight text-center pb-8">Bienvenido a FarmaTech</h1>
        <p className="text-lg text-gray-600 mb-8 text-center max-w-xl pb-4">
          Sistema profesional de gestión de medicamentos.
        </p>
        <div className={gridClass}>
          {options.map((opt) => (
            <Link
              key={opt.href}
              href={opt.href}
              className={cardClass}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="mb-2">{opt.icon}</div>
                <span className="font-semibold text-slate-700 text-center group-hover:text-blue-700 text-lg">
                  {opt.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
