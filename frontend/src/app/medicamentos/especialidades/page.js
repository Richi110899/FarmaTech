"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/Pagination';

const API_ESPECIALIDADES = `${process.env.NEXT_PUBLIC_API_URL}/api/especialidades`;

// Floating label input reutilizable
const FloatingInput = ({ label, name, value, onChange, ...props }) => (
  <div className="relative mb-8">
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600 bg-transparent"
      placeholder={label}
      autoComplete="off"
      {...props}
    />
    <label
      htmlFor={name}
      className="absolute left-0 transition-all pointer-events-none text-sm text-blue-600 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 -top-3.5 peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm"
    >
      {label}
    </label>
  </div>
);

export default function EspecialidadesPage() {
  const [especialidades, setEspecialidades] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [nuevo, setNuevo] = useState('');
  const [nuevos, setNuevos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mensajeModal, setMensajeModal] = useState('');
  const [mensajeGlobal, setMensajeGlobal] = useState('');
  const [pagina, setPagina] = useState(1);
  const filasPorPagina = 10;
  const router = useRouter();

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'especialidadMensaje' && e.newValue) {
        fetchEspecialidades();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Event listener para cerrar modales con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showModal) {
          setShowModal(false);
          setMensajeModal('');
          setNuevo('');
          setNuevos([]);
        }
        if (showEditModal) {
          setShowEditModal(false);
          setEditando(null);
        }
        if (showDeleteModal) {
          setShowDeleteModal(false);
          setSelected(null);
        }
        if (selected && !showDeleteModal) {
          setSelected(null);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showModal, showEditModal, showDeleteModal, selected]);

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

  const fetchEspecialidades = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_ESPECIALIDADES);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setEspecialidades(data);
    } catch (error) {
      console.error('Error fetching especialidades:', error);
      setMensajeGlobal('Error al cargar las especialidades');
    }
    setLoading(false);
  };

  const handleAnadir = (e) => {
    e.preventDefault();
    if (!nuevo.trim()) return;
    setNuevos([...nuevos, nuevo.trim()]);
    setNuevo('');
  };

  const handleGuardarCambios = async () => {
    // Crear una lista temporal con los elementos existentes más el nuevo input
    let elementosAGuardar = [...nuevos];
    if (nuevo.trim()) {
      elementosAGuardar.push(nuevo.trim());
    }
    
    if (elementosAGuardar.length === 0) return;
    setLoading(true);

    let success = true;
    for (const descripcion of elementosAGuardar) {
      try {
        const res = await fetch(API_ESPECIALIDADES, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ descripcionEsp: descripcion }),
        });
        if (!res.ok) success = false;
      } catch (error) {
        console.error('Error creating especialidad:', error);
        success = false;
      }
    }

    setLoading(false);
    await fetchEspecialidades();

    if (success) {
      setMensajeGlobal(`Se añadieron ${elementosAGuardar.length} especialidad(es) exitosamente.`);
      setNuevos([]);
      setNuevo('');
      setShowModal(false);
      setTimeout(() => setMensajeGlobal(''), 3000);
    } else {
      setMensajeGlobal('Error al agregar una o más especialidades.');
      setTimeout(() => setMensajeGlobal(''), 3000);
    }
  };

  const handleEditar = async () => {
    if (!editando || !editando.descripcionEsp.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_ESPECIALIDADES}/${editando.CodEspec}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ descripcionEsp: editando.descripcionEsp }),
      });
      
      if (res.ok) {
        setMensajeGlobal('Especialidad actualizada exitosamente');
        setShowEditModal(false);
        setEditando(null);
        await fetchEspecialidades();
        setTimeout(() => setMensajeGlobal(''), 3000);
      } else {
        setMensajeGlobal('Error al actualizar la especialidad');
      }
    } catch (error) {
      console.error('Error updating especialidad:', error);
      setMensajeGlobal('Error al actualizar la especialidad');
    }
    setLoading(false);
  };

  const handleEliminar = async () => {
    if (!selected) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_ESPECIALIDADES}/${selected.CodEspec}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setMensajeGlobal('Especialidad eliminada exitosamente');
        setShowDeleteModal(false);
        setSelected(null);
        await fetchEspecialidades();
        setTimeout(() => setMensajeGlobal(''), 3000);
      } else {
        setMensajeGlobal('Error al eliminar la especialidad');
      }
    } catch (error) {
      console.error('Error deleting especialidad:', error);
      setMensajeGlobal('Error al eliminar la especialidad');
    }
    setLoading(false);
  };

  // Aplica el filtro primero si existe
  const especialidadesFiltradas = especialidades.filter(especialidad =>
    (especialidad.descripcionEsp || '').toLowerCase().includes(filtro.toLowerCase())
  );
  const totalPaginas = Math.ceil(especialidadesFiltradas.length / filasPorPagina);
  const especialidadesPaginadas = especialidadesFiltradas.slice((pagina - 1) * filasPorPagina, pagina * filasPorPagina);

  return (
    <div className="w-full mx-auto mt-10 pr-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mt-[-15px]">Especialidades</h1>
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <span className="text-xl leading-none">+</span>
          <span className="text-sm font-medium">Agregar</span>
        </button>
      </div>
      <input
        type="text"
        placeholder="Filtrar especialidades..."
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
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Código</th>
              <th className="p-3 border-b border-gray-200 text-left font-medium text-gray-700 text-sm">Descripción</th>
            </tr>
          </thead>
          <tbody>
            {especialidadesPaginadas.length === 0 ? (
              <tr><td colSpan={2} className="text-center p-6 text-gray-500 text-sm">Sin datos disponibles</td></tr>
            ) : (
              especialidadesPaginadas.map((especialidad) => (
                <tr
                  key={especialidad.CodEspec || especialidad.CodEspec}
                  className="hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100"
                  onClick={() => setSelected(especialidad)}
                >
                  <td className="p-3 text-sm text-gray-800">
                    {(especialidad.CodEspec || 0).toString().padStart(3, '0')}
                  </td>
                  <td className="p-3 text-sm text-gray-800">{especialidad.descripcionEsp}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPaginas > 1 && (
        <Pagination
          currentPage={pagina}
          totalPages={totalPaginas}
          onPageChange={setPagina}
        />
      )}

      {/* Modal de detalle */}
      {selected && !showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-cen2ter justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-6 text-gray-800 pr-8">Detalle de Especialidad</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-400 text-sm">Código</span>
                <span className="text-gray-900 text-sm">{String(selected.CodEspec).padStart(3, '0')}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <span className="text-gray-400 text-sm">Nombre</span>
                <span className="text-gray-900 text-sm">{selected.descripcionEsp}</span>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => { setEditando({ ...selected }); setShowEditModal(true); setSelected(null); }}
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

      {/* Modal para agregar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => {
                setShowModal(false);
                setMensajeModal('');
                setNuevo('');
                setNuevos([]);
              }}
            >
              ×
            </button>
            
            <div className="pr-8">
              <h2 className="text-base font-semibold mb-2 text-gray-800 mb-8">Agregar Especialidades</h2>
            </div>

            {/* Formulario para agregar */}
              <div className="space-y-6">
                {/* Lista de elementos agregados */}
                {nuevos.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 mb-3 text-sm">
                      Elementos para agregar ({nuevos.length})
                    </h3>
                    <div className="space-y-2">
                      {nuevos.map((item, index) => (
                        <div key={index} className="flex items-center justify-between bg-white px-3 py-2 rounded border">
                          <span className="text-sm text-gray-700">{item}</span>
                          <button
                            onClick={() => setNuevos(nuevos.filter((_, i) => i !== index))}
                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            Quitar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleAnadir} className="space-y-0">
                  <FloatingInput
                    label="Descripción"
                    name="descripcion"
                    value={nuevo}
                    onChange={e => setNuevo(e.target.value)}
                    required
                    onKeyDown={e => { 
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleGuardarCambios();
                      }
                    }}
                  />
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || !nuevo.trim()}
                    >
                      Añadir a la lista
                    </button>
                    <button
                      type="button"
                      onClick={handleGuardarCambios}
                      className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading || (nuevos.length === 0 && !nuevo.trim())}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Guardando...
                        </span>
                      ) : (
                        'Guardar cambios'
                      )}
                    </button>
                  </div>
                </form>
              </div>
          </div>
        </div>
      )}

      {/* Modal para editar */}
      {showEditModal && editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => {
                setShowEditModal(false);
                setEditando(null);
              }}
            >
              ×
            </button>
            
            <div className="pr-8">
              <h2 className="text-base font-semibold mb-2 text-gray-800 mb-8">Editar Especialidad</h2>
            </div>

            <div className="space-y-6">
              <FloatingInput
                label="Descripción"
                name="descripcion"
                value={editando.descripcionEsp}
                onChange={e => setEditando({ ...editando, descripcionEsp: e.target.value })}
                required
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditando(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleEditar}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-yellow-500 bg-white text-yellow-700 hover:bg-yellow-50 hover:border-yellow-600 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading || !editando.descripcionEsp.trim()}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </span>
                  ) : (
                    'Guardar cambios'
                  )}
                </button>
              </div>
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
                  ¿Estás seguro de que quieres eliminar la especialidad "{selected.descripcionEsp}"?
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
                    'Eliminar'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
