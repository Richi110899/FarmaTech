"use client";
import Sidebar from "../components/Sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function LayoutShell({ children }) {
  const pathname = usePathname();
  const showSidebar = pathname !== "/login";
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="pl-4 w-full min-h-screen flex">
      {/* Sidebar fijo en desktop */}
      {showSidebar && <Sidebar />}
      {/* Botón hamburguesa flotante solo en móvil */}
      {showSidebar && !sidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white border border-gray-300 shadow-md md:hidden"
          onClick={() => setSidebarOpen(true)}
          aria-label="Abrir menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7 text-gray-700">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
          </svg>
        </button>
      )}
      {/* Sidebar Drawer en móvil */}
      {showSidebar && sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 h-full bg-gradient-to-b from-slate-50 to-white border-r border-slate-200 shadow-xl animate-slideInLeft">
            <Sidebar mobile={true} onNavigate={() => setSidebarOpen(false)} />
          </aside>
          {/* Botón X flotante para cerrar Drawer */}
          <button
            className="fixed top-4 right-4 z-50 text-white hover:text-gray-200 text-2xl w-10 h-10 flex items-center justify-center rounded-full bg-gray-700/80 hover:bg-gray-900/90 transition-colors duration-200 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Cerrar menú"
          >
            ×
          </button>
        </div>
      )}
      <main className={showSidebar ? "flex-1 md:ml-64" : "w-full min-h-screen"}>
        {children}
      </main>
    </div>
  );
} 