"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Pagination from '@/components/Pagination';
import { useAuth } from '@/contexts/AuthContext';

const API_MEDICAMENTOS = `${process.env.NEXT_PUBLIC_API_URL}/api/medicamentos`;

function DetalleModal({ medicamento, onClose, onEdit, onDelete, eliminando, error, mensaje }) {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);
  
  if (!medicamento) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-semibold mb-6 text-gray-800 pr-8">Detalle de Medicamento</h2>
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <div className="text-gray-400 text-sm mb-1">Código</div>
              <div className="text-gray-900 font-medium text-sm">{String(medicamento.CodMedicamento).padStart(3, '0')}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Nombre</div>
              <div className="text-gray-900 font-medium text-sm">{medicamento.descripcionMed}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Fecha de Fabricación</div>
              <div className="text-gray-900 font-medium text-sm">{medicamento.fechaFabricacion?.slice(0,10)}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Fecha de Vencimiento</div>
              <div className="text-gray-900 font-medium text-sm">{medicamento.fechaVencimiento?.slice(0,10)}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Presentación</div>
              <div className="text-gray-900 font-medium text-sm">{medicamento.Presentacion}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Stock</div>
              <div className="text-gray-900 font-medium text-sm">{medicamento.stock}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Stock Mínimo</div>
              <div className="text-gray-900 font-medium text-sm">{medicamento.stockMinimo}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Precio de Venta</div>
              <div className="text-gray-900 font-medium text-sm">S/ {medicamento.precioVentaUni}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Marca</div>
              <div className="text-gray-900 font-medium text-sm">{medicamento.Marca}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Alerta Stock</div>
              <div className="text-gray-900 font-medium text-sm">{medicamento.alertaStock ? 'Sí' : 'No'}</div>
            </div>
            <div>
              <div className="text-gray-400 text-sm mb-1">Alerta Vencimiento</div>
              <div className="text-gray-900 font-medium text-sm">{medicamento.alertaVencimiento ? 'Sí' : 'No'}</div>
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

function ConfirmDeleteModal({ medicamento, onCancel, onConfirm, loading }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onCancel]);

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
              ¿Estás seguro de que quieres eliminar el medicamento "{medicamento?.descripcionMed}"?
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
              className="flex-1 px-4 py-3 rounded-xl border-2 border-red-600 bg-white text-red-700 hover:bg-red-50 hover:border-red-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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

export default function MedicamentosPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [medicamentos, setMedicamentos] = useState([]);
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
    fetchMedicamentos();
    if (typeof window !== 'undefined') {
      const msg = localStorage.getItem('medicamentosMensaje');
      if (msg) {
        setMensajeGlobal(msg);
        localStorage.removeItem('medicamentosMensaje');
        setTimeout(() => setMensajeGlobal(''), 3000);
      }
    }
  }, []);

  const fetchMedicamentos = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_MEDICAMENTOS);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setMedicamentos(data);
    } catch (error) {
      console.error('Error fetching medicamentos:', error);
      setMensajeGlobal("Error al cargar los medicamentos");
    }
    setLoading(false);
  };

  // Aplica el filtro primero si existe
  const medicamentosFiltrados = medicamentos.filter(med =>
    (med.CodMedicamento + "").includes(filtro) ||
    (med.descripcionMed || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (med.Marca || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (med.Presentacion || "").toLowerCase().includes(filtro.toLowerCase())
  );
  const totalPaginas = Math.ceil(medicamentosFiltrados.length / filasPorPagina);
  const medicamentosPaginados = medicamentosFiltrados.slice((pagina - 1) * filasPorPagina, pagina * filasPorPagina);

  // --- ALERTAS ---
  const stockBajo = medicamentos.filter(med => med.alertaStock && Number(med.stock) <= Number(med.stockMinimo));
  const proximoVencer = medicamentos.filter(med => {
    if (!med.alertaVencimiento || !med.fechaVencimiento) return false;
    const dias = (new Date(med.fechaVencimiento) - new Date()) / (1000 * 60 * 60 * 24);
    return dias <= 30 && dias >= 0;
  });
  const puedeVerAlertas = user && (user.rol === 'Administrador' || user.rol === 'Comprador');

  const handleRowClick = async (med) => {
    setModalError("");
    setModalMensaje("");
    setDetalle(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_MEDICAMENTOS}/${med.CodMedicamento}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setDetalle(data);
    } catch (error) {
      console.error('Error fetching medicamento:', error);
      setModalError("No se pudo cargar el detalle del medicamento");
    }
    setLoading(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setEliminando(true);
    try {
      const res = await fetch(`${API_MEDICAMENTOS}/${detalle.CodMedicamento}`, { method: "DELETE" });
      if (res.ok) {
        setMensajeGlobal("Medicamento eliminado exitosamente");
        setShowDeleteModal(false);
        setDetalle(null);
        fetchMedicamentos();
        setTimeout(() => setMensajeGlobal(""), 3000);
      } else {
        setModalError("Error al eliminar el medicamento");
      }
    } catch (error) {
      console.error('Error deleting medicamento:', error);
      setModalError("Error al eliminar el medicamento");
    }
    setEliminando(false);
  };

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

  return (
    <div className="w-full mx-auto mt-10 pr-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mt-[-15px]">Medicamentos</h1>
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
          onClick={() => router.push('/medicamentos/nuevo')}
        >
          <span className="text-xl leading-none">+</span>
          <span className="text-sm font-medium">Agregar</span>
        </button>
      </div>
      {puedeVerAlertas && stockBajo.length > 0 && (
        <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-800 border border-red-300 text-sm font-semibold">
          Revisar stock mínimo: {stockBajo.map(med => String(med.CodMedicamento).padStart(3, '0')).join(', ')}
        </div>
      )}
      {puedeVerAlertas && proximoVencer.length > 0 && (
        <div className="mb-4 p-4 rounded-lg bg-yellow-100 text-yellow-800 border border-yellow-300 text-sm font-semibold">
          Revisar fecha de vencimiento: {proximoVencer.map(med => String(med.CodMedicamento).padStart(3, '0')).join(', ')}
        </div>
      )}
      <input
        type="text"
        placeholder="Filtrar medicamentos..."
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
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Código</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Nombre</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Presentación</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Stock</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Precio</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center p-6 text-gray-500 text-sm">Cargando...</td></tr>
            ) : medicamentos.length === 0 ? (
              <tr><td colSpan={5} className="text-center p-6 text-gray-500 text-sm">Sin datos disponibles</td></tr>
            ) : (
              medicamentosPaginados.length === 0 ? (
                <tr><td colSpan={5} className="text-center p-6 text-gray-500 text-sm">Sin datos</td></tr>
              ) : (
                medicamentosPaginados.map((med) => (
                <tr key={med.CodMedicamento} className="hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
                  onClick={() => handleRowClick(med)}
                >
                  <td className="p-3 text-sm text-gray-800">{String(med.CodMedicamento).padStart(3, '0')}</td>
                  <td className="p-3 text-sm text-gray-800">{med.descripcionMed}</td>
                  <td className="p-3 text-sm text-gray-800">{med.Presentacion}</td>
                  <td className="p-3 text-sm text-gray-800">{med.stock}</td>
                  <td className="p-3 text-sm text-gray-800">S/ {med.precioVentaUni}</td>
                </tr>
              ))
              )
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
          medicamento={detalle}
          onClose={() => setDetalle(null)}
          onEdit={() => router.push(`/medicamentos/editar/${detalle.CodMedicamento}`)}
          onDelete={handleDelete}
          eliminando={eliminando}
          error={modalError}
          mensaje={modalMensaje}
        />
      )}
      {showDeleteModal && detalle && (
        <ConfirmDeleteModal
          medicamento={detalle}
          onCancel={() => { setShowDeleteModal(false); setDetalle(null); }}
          onConfirm={handleConfirmDelete}
          loading={eliminando}
        />
      )}
    </div>
  );
}