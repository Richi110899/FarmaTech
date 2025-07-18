'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { addMedicamento, API_ENDPOINTS } from '../../../services/api';
import useSWR from 'swr';

const API_ESP = `${process.env.NEXT_PUBLIC_API_URL}/api/especialidades`;
const API_TIPO = `${process.env.NEXT_PUBLIC_API_URL}/api/tipos`;

const initialState = {
  descripcionMed: '',
  fechaFabricacion: '',
  fechaVencimiento: '',
  Presentacion: '',
  stock: '',
  precioVentaUni: '',
  CodTipoMed: '',
  Marca: '',
  CodEspec: ''
};

// Floating label input
const Input = ({ label, name, type = "text", value, onChange, ...props }) => {
  const isDate = type === 'date';
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative mb-8">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={isDate ? () => setFocused(true) : undefined}
        onBlur={isDate ? () => setFocused(false) : undefined}
        className={
          "peer h-12 w-full border-b-2 border-gray-300 text-gray-900 bg-transparent text-sm " +
          "placeholder-transparent focus:outline-none focus:border-blue-600"
        }
        placeholder={isDate ? " " : label}
        autoComplete="off"
        {...props}
      />
      <label
        htmlFor={name}
        className={
          "absolute left-0 transition-all pointer-events-none -top-3.5 text-sm " +
          (isDate
            ? ((focused || (value && value !== "")) ? "text-blue-600" : "text-gray-400")
            : "text-blue-600 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 -top-3.5 peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm")
        }
      >
        {label}
      </label>
    </div>
  );
};

// Floating label select
const FloatingSelect = ({ label, name, value, onChange, children, ...props }) => {
  const [focused, setFocused] = React.useState(false);
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
        className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 bg-transparent focus:outline-none focus:border-blue-600 text-sm appearance-none pl-3"
        {...props}
      >
        <option value="" disabled hidden></option>
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
};

const fetcher = url => fetch(url).then(r => r.json());

export default function NuevoMedicamento() {
  const router = useRouter();
  // SWR para especialidades y tipos
  const { data: especialidades = [], isLoading: loadingEsp } = useSWR(API_ENDPOINTS.ESPECIALIDADES, fetcher);
  const { data: tipos = [], isLoading: loadingTipos } = useSWR(API_ENDPOINTS.TIPOS, fetcher);
  const [form, setForm] = useState({
    descripcionMed: '',
    Presentacion: '',
    Marca: '',
    stock: '',
    precioVentaUni: '',
    fechaFabricacion: '',
    fechaVencimiento: '',
    CodTipoMed: '',
    CodEspec: ''
  });
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje('');
    setError('');

    // Validación: fecha de vencimiento no puede ser menor a fecha de fabricación
    if (form.fechaFabricacion && form.fechaVencimiento) {
      const fab = new Date(form.fechaFabricacion);
      const ven = new Date(form.fechaVencimiento);
      if (ven < fab) {
        setError('La fecha de vencimiento no puede ser menor a la fecha de fabricación.');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await addMedicamento(form);
      if (res && res.CodMedicamento) {
        setMensaje('Medicamento guardado exitosamente');
        setForm(initialState); // Limpia el formulario
        setTimeout(() => setMensaje(''), 3000);
      } else {
        setError('Error al guardar el medicamento');
      }
    } catch {
      setError('Error al guardar el medicamento');
    }
    setLoading(false);
  };

  return (
    <div className="w-full mx-auto mt-10 pr-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">Nuevo Medicamento</h1>
      </div>
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full">
        {mensaje && (
          <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-200 text-left">{mensaje}</div>
        )}
        {error && (
          <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-200 text-left">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8 mt-4">
          {/* Fila 1 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
            <Input label="Nombre" name="descripcionMed" value={form.descripcionMed} onChange={handleChange} required />
            <Input label="Presentación" name="Presentacion" value={form.Presentacion} onChange={handleChange} required />
            <Input label="Marca" name="Marca" value={form.Marca} onChange={handleChange} required />
          </div>
          {/* Fila 2 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
            <FloatingSelect label="Especialidad" name="CodEspec" value={form.CodEspec} onChange={handleChange} required>
              <option value="" disabled hidden></option>
              {especialidades.map(e => (
                <option key={e.CodEspec} value={e.CodEspec}>{e.descripcionEsp}</option>
              ))}
            </FloatingSelect>
            <FloatingSelect label="Tipo de medicamento" name="CodTipoMed" value={form.CodTipoMed} onChange={handleChange} required>
              <option value="" disabled hidden></option>
              {tipos.map(t => (
                <option key={t.CodTipoMed} value={t.CodTipoMed}>{t.descripcion}</option>
              ))}
            </FloatingSelect>
            <Input label="Stock" name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
          </div>
          {/* Fila 3 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
            <Input label="Precio Venta Unidad" name="precioVentaUni" type="number" step="0.01" min="0" value={form.precioVentaUni} onChange={handleChange} required />
            <Input label="Fecha de fabricación" name="fechaFabricacion" type="date" value={form.fechaFabricacion} onChange={handleChange} required />
            <Input label="Fecha de vencimiento" name="fechaVencimiento" type="date" value={form.fechaVencimiento} onChange={handleChange} required />
          </div>
          {/* Fila 4: Botones */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-6 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
              onClick={() => router.push('/medicamentos')}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl border-2 border-blue-600 bg-white text-blue-700 hover:bg-blue-50 hover:border-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}