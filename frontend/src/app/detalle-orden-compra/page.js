"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pagination from '@/components/Pagination';

const API_DETALLES = `${process.env.NEXT_PUBLIC_API_URL}/api/detalles-compra`;

function DetalleModal({ detalle, onClose, onEdit, onDelete, eliminando, error, mensaje }) {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);
  
  if (!detalle) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-6 text-gray-800 pr-8">Detalle de Orden de Compra</h2>
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <div className="text-gray-400 text-sm mb-1">ID</div>
              <div className="text-gray-900 font-medium text-sm">{String(detalle.id).padStart(3, '0')}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">N° Orden Compra</div>
              <div className="text-gray-900 font-medium text-sm">{String(detalle.NroOrdenC).padStart(3, '0')}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Medicamento</div>
              <div className="text-gray-900 font-medium text-sm">{detalle.descripcion}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Cantidad</div>
              <div className="text-gray-900 font-medium text-sm">{detalle.cantidad}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Precio</div>
              <div className="text-gray-900 font-medium text-sm">{detalle.precio}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Monto Unitario</div>
              <div className="text-gray-900 font-medium text-sm">{detalle.montouni}</div>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-8">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-yellow-500 bg-white text-yellow-700 hover:bg-yellow-50 hover:border-yellow-600 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
            disabled={eliminando}
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            className="flex-1 px-4 py-3 rounded-xl border-2 border-red-600 bg-white text-red-700 hover:bg-red-50 hover:border-red-700 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
            disabled={eliminando}
          >
            {eliminando ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
        {mensaje && <div className="mt-6 p-3 rounded bg-green-100 text-green-800 text-sm text-left">{mensaje}</div>}
        {error && <div className="mt-6 p-3 rounded bg-red-100 text-red-800 text-sm">{error}</div>}
      </div>
    </div>
  );
}

function ConfirmDeleteModal({ detalle, onCancel, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={onCancel}
        >
          ×
        </button>
        <div className="pr-8">
          <h2 className="text-base font-semibold mb-2 text-gray-800 mb-8">Confirmar Eliminación</h2>
        </div>
        <div className="space-y-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 font-medium">
              ¿Estás seguro de que quieres eliminar el detalle de orden de compra "{String(detalle?.id).padStart(3, '0')}"?
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 rounded-xl border-2 border-red-600 bg-white text-red-700 hover:bg-red-50 hover:border-red-700 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Eliminando...
                </span>
              ) : (
                "Eliminar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DetalleOrdenCompraPage() {
  const router = useRouter();
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensajeGlobal, setMensajeGlobal] = useState("");
  const [filtro, setFiltro] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [modalError, setModalError] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pagina, setPagina] = useState(1);
  const filasPorPagina = 10;

  useEffect(() => {
    fetchDetalles();
  }, []);

  // Escape para cerrar modales de eliminación
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showDeleteModal) {
        setShowDeleteModal(false);
        setDetalle(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showDeleteModal]);

  const fetchDetalles = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_DETALLES);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setDetalles(data);
    } catch (error) {
      console.error('Error fetching detalles:', error);
      setMensajeGlobal("Error al cargar los detalles de orden de compra");
    }
    setLoading(false);
  };

  // Aplica el filtro primero
  const detallesFiltrados = detalles.filter(det =>
    (det.id + "").includes(filtro) ||
    (det.NroOrdenC + "").includes(filtro) ||
    (det.descripcion || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (det.cantidad + "").includes(filtro) ||
    (det.precio + "").includes(filtro)
  );

  // Calcula la paginación sobre el array filtrado
  const totalPaginas = Math.ceil(detallesFiltrados.length / filasPorPagina);
  const detallesPaginados = detallesFiltrados.slice((pagina - 1) * filasPorPagina, pagina * filasPorPagina);

  const handleRowClick = async (det) => {
    setModalError("");
    setModalMensaje("");
    setDetalle(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_DETALLES}/${det.id}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setDetalle(data);
    } catch (error) {
      console.error('Error fetching detalle:', error);
      setModalError("No se pudo cargar el detalle de la orden de compra");
    }
    setLoading(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setEliminando(true);
    try {
      const res = await fetch(`${API_DETALLES}/${detalle.id}`, { method: "DELETE" });
      if (res.ok) {
        setMensajeGlobal("Detalle de orden de compra eliminado exitosamente");
        setShowDeleteModal(false);
        setDetalle(null);
        fetchDetalles();
        setTimeout(() => setMensajeGlobal(""), 3000);
      } else {
        setModalError("Error al eliminar el detalle de orden de compra");
      }
    } catch (error) {
      console.error('Error deleting detalle:', error);
      setModalError("Error al eliminar el detalle de orden de compra");
    }
    setEliminando(false);
  };

  return (
    <div className="w-full mx-auto mt-10 pr-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mt-[-15px]">Detalles de Orden de Compra</h1>
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
          onClick={() => router.push('/detalle-orden-compra/nuevo')}
        >
          <span className="text-xl leading-none">+</span>
          <span className="text-sm font-medium">Agregar</span>
        </button>
      </div>
      <input
        type="text"
        placeholder="Filtrar detalles..."
        className="mb-6 px-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 text-sm"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
      />
      {mensajeGlobal && (
        <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-200 text-left">{mensajeGlobal}</div>
      )}
      <div className="overflow-x-auto w-full shadow-md rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">ID</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Nro Orden</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Medicamento</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Cantidad</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Precio</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center p-6 text-gray-500 text-sm">Cargando...</td></tr>
            ) : detallesPaginados.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-6 text-gray-500 text-sm">Sin datos disponibles</td></tr>
            ) : (
              detallesPaginados.map((det) => (
                <tr key={det.id} className="hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
                  onClick={() => handleRowClick(det)}
                >
                  <td className="p-3 text-sm text-gray-800">{String(det.id).padStart(3, '0')}</td>
                  <td className="p-3 text-sm text-gray-800">{String(det.NroOrdenC).padStart(3, '0')}</td>
                  <td className="p-3 text-sm text-gray-800">{det.descripcion}</td>
                  <td className="p-3 text-sm text-gray-800">{det.cantidad}</td>
                  <td className="p-3 text-sm text-gray-800">{det.precio}</td>
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
      {detalle && !showDeleteModal && (
        <DetalleModal
          detalle={detalle}
          onClose={() => setDetalle(null)}
          onEdit={() => router.push(`/detalle-orden-compra/editar/${detalle.id}`)}
          onDelete={handleDelete}
          eliminando={eliminando}
          error={modalError}
          mensaje={modalMensaje}
        />
      )}
      {showDeleteModal && detalle && (
        <ConfirmDeleteModal
          detalle={detalle}
          onCancel={() => { setShowDeleteModal(false); setDetalle(null); }}
          onConfirm={handleConfirmDelete}
          loading={eliminando}
        />
      )}
    </div>
  );
} 