"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Pagination from '@/components/Pagination';

const API_LABORATORIOS = `${process.env.NEXT_PUBLIC_API_URL}/api/laboratorios`;

const columns = [
  { key: "CodLab", label: "Código" },
  { key: "razonSocial", label: "Razón Social" },
  { key: "direccion", label: "Dirección" },
  { key: "telefono", label: "Teléfono" },
  { key: "email", label: "Email" },
  { key: "contacto", label: "Contacto" },
];

export default function LaboratoriosPage() {
  const router = useRouter();
  const [laboratorios, setLaboratorios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [selected, setSelected] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensajeGlobal, setMensajeGlobal] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const filasPorPagina = 10;

  useEffect(() => {
    fetchLaboratorios();
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'laboratorioMensaje' && e.newValue) {
        fetchLaboratorios();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (selected && !showDeleteModal) setSelected(null);
        if (showDeleteModal) setShowDeleteModal(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [selected, showDeleteModal]);

  // Escape para cerrar modales de eliminación
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showDeleteModal) {
        setShowDeleteModal(false);
        setSelected(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showDeleteModal]);

  const fetchLaboratorios = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_LABORATORIOS);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setLaboratorios(data);
    } catch (error) {
      console.error('Error fetching laboratorios:', error);
      setMensajeGlobal("Error al cargar los laboratorios");
    }
    setLoading(false);
  };

  // Aplica el filtro primero si existe
  const laboratoriosFiltrados = laboratorios.filter(lab =>
    columns.some(col => (lab[col.key] || "").toLowerCase?.().includes(filtro.toLowerCase()))
  );
  const totalPaginas = Math.ceil(laboratoriosFiltrados.length / filasPorPagina);
  const laboratoriosPaginados = laboratoriosFiltrados.slice((pagina - 1) * filasPorPagina, pagina * filasPorPagina);

  // Eliminar
  const handleEliminar = async () => {
    if (!selected) return;
    setEliminando(true);
    try {
      const res = await fetch(`${API_LABORATORIOS}/${selected.CodLab}`, { method: "DELETE" });
      if (res.ok) {
        setMensajeGlobal("Laboratorio eliminado exitosamente");
        setShowDeleteModal(false); setSelected(null);
        await fetchLaboratorios();
        if (typeof window !== 'undefined') {
          localStorage.setItem('laboratorioMensaje', 'Laboratorio eliminado');
        }
        setTimeout(() => setMensajeGlobal(""), 3000);
      } else {
        setMensajeGlobal("Error al eliminar el laboratorio");
      }
    } catch (error) {
      console.error('Error deleting laboratorio:', error);
      setMensajeGlobal("Error al eliminar el laboratorio");
    }
    setEliminando(false);
  };

  return (
    <div className="w-full mx-auto mt-10 pr-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mt-[-15px]">Laboratorios</h1>
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
          onClick={() => router.push('/laboratorios/nuevo')}
        >
          <span className="text-xl leading-none">+</span>
          <span className="text-sm font-medium">Agregar</span>
        </button>
      </div>
      <input
        type="text"
        placeholder="Filtrar laboratorios..."
        className="mb-6 px-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 text-sm"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
      />
      {mensajeGlobal && (
        <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-200 text-left">
          {mensajeGlobal}
        </div>
      )}
      <div className="overflow-x-auto w-full shadow-md rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map(col => (
                <th key={col.key} className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {laboratoriosPaginados.length === 0 ? (
              <tr><td colSpan={columns.length} className="text-center p-6 text-gray-500 text-sm">Sin datos disponibles</td></tr>
            ) : (
              laboratoriosPaginados.map((lab) => (
                <tr
                  key={lab.CodLab}
                  className="hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
                  onClick={() => setSelected(lab)}
                >
                  {columns.map(col => (
                    <td key={col.key} className="p-3 text-sm text-gray-800">
                      {col.key === 'CodLab' ? lab[col.key].toString().padStart(3, '0') : lab[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={pagina}
        totalPages={totalPaginas}
        onPageChange={setPagina}
      />

      {/* Modal de detalle */}
      {selected && !showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-6 text-gray-800 pr-8">Detalle de Laboratorio</h2>
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Código</div>
                  <div className="text-gray-900 font-medium text-sm">{String(selected.CodLab).padStart(3, '0')}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Razón Social</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.razonSocial}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Dirección</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.direccion}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Teléfono</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.telefono}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Email</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.email}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Contacto</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.contacto}</div>
                </div>
              </div>
            </div>
            {/* Botones de acciones */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => router.push(`/laboratorios/editar/${selected.CodLab}`)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-yellow-500 bg-white text-yellow-700 hover:bg-yellow-50 hover:border-yellow-600 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
              >
                Editar
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-red-600 bg-white text-red-700 hover:bg-red-50 hover:border-red-700 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => {
                setShowDeleteModal(false);
                setSelected(null);
              }}
            >
              ×
            </button>
            <div className="pr-8">
              <h2 className="text-base font-semibold mb-2 text-gray-800 mb-8">Confirmar Eliminación</h2>
            </div>
            <div className="space-y-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-medium">
                  ¿Estás seguro de que quieres eliminar el laboratorio "{selected.razonSocial}"?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelected(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEliminar}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-red-600 bg-white text-red-700 hover:bg-red-50 hover:border-red-700 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={eliminando}
                >
                  {eliminando ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}