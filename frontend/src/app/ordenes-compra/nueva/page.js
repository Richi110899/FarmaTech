"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

const API_ORDENES_COMPRA = `${process.env.NEXT_PUBLIC_API_URL}/api/ordenes-compra`;
const API_LABORATORIOS = `${process.env.NEXT_PUBLIC_API_URL}/api/laboratorios`;

const Input = ({ label, name, type = "text", value, onChange, ...props }) => {
  const [focused, setFocused] = React.useState(false);
  return (
    <div className="relative mb-8">
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={
          "peer h-12 w-full border-b-2 border-gray-300 text-gray-900 bg-transparent text-sm " +
          "placeholder-transparent focus:outline-none focus:border-blue-600"
        }
        placeholder={label}
        autoComplete="off"
        {...props}
      />
      <label
        htmlFor={name}
        className={
          "absolute left-0 transition-all pointer-events-none -top-3.5 text-sm " +
          (focused || (value && value !== "")
            ? "text-blue-600"
            : "text-blue-600 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 -top-3.5 peer-focus:-top-3.5 peer-focus:text-blue-600 peer-focus:text-sm")
        }
      >
        {label}
      </label>
    </div>
  );
};

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
        required
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

const campos = [
  { key: "fechaEmision", label: "Fecha de Emisión", type: "date" },
  { key: "Situacion", label: "Situación" },
  { key: "NrofacturaProv", label: "N° Factura Proveedor" },
];

export default function NuevaOrdenCompraPage() {
  const router = useRouter();
  
  // Fecha actual en formato yyyy-mm-dd
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const defaultFecha = `${yyyy}-${mm}-${dd}`;
  
  const [form, setForm] = useState({ 
    fechaEmision: defaultFecha, 
    Situacion: "", 
    Total: "", 
    CodLab: "", 
    NrofacturaProv: "" 
  });
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function fetchLabs() {
      try {
        const res = await fetch(API_LABORATORIOS);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const labs = await res.json();
        setLaboratorios(labs);
      } catch (error) {
        console.error('Error fetching laboratorios:', error);
        setError("Error al cargar los laboratorios");
      }
    }
    fetchLabs();
  }, []);

  // Mensaje de éxito desaparece a los 3 segundos
  useEffect(() => {
    if (mensaje) {
      const timer = setTimeout(() => setMensaje(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [mensaje]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setMensaje("");
    if (!form.fechaEmision || !form.Situacion.trim() || !form.CodLab) {
      setError("Completa todos los campos obligatorios");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(API_ORDENES_COMPRA, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          CodLab: Number(form.CodLab),
          Total: Number(form.Total)
        })
      });
      
      if (res.ok) {
        const data = await res.json();
        if (data && data.NroOrdenC) {
          setMensaje("Orden de compra creada exitosamente");
          setForm({ 
            fechaEmision: defaultFecha, 
            Situacion: "", 
            Total: "", 
            CodLab: "", 
            NrofacturaProv: "" 
          });
          if (typeof window !== 'undefined') {
            localStorage.setItem('ordenCompraMensaje', 'Orden de compra creada exitosamente');
          }
        } else {
          setError("Error al crear la orden de compra");
        }
      } else {
        setError("Error al crear la orden de compra");
      }
    } catch (error) {
      console.error('Error creating orden:', error);
      setError("Error al crear la orden de compra");
    }
    setLoading(false);
  };

  return (
    <div className="w-full mx-auto mt-10 pr-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Nueva Orden de Compra</h1>
      </div>
      <div className="pt-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full">
          {mensaje && (
            <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-green-100 text-green-800 border border-green-200 text-left">{mensaje}</div>
          )}
          {error && (
            <div className="mb-6 p-4 rounded-lg text-sm font-medium bg-red-100 text-red-800 border border-red-200 text-left">{error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-8 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              {campos.map(campo => (
                <Input
                  key={campo.key}
                  label={campo.label}
                  name={campo.key}
                  value={form[campo.key]}
                  onChange={handleChange}
                  required={campo.key !== 'NrofacturaProv'}
                  type={campo.type || 'text'}
                />
              ))}
              <FloatingSelect
                label="Laboratorio"
                name="CodLab"
                value={form.CodLab}
                onChange={handleChange}
              >
                {laboratorios.map(lab => (
                  <option key={lab.CodLab} value={lab.CodLab}>{lab.razonSocial}</option>
                ))}
              </FloatingSelect>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-6 py-2 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
                onClick={() => router.push('/ordenes-compra')}
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
    </div>
  );
} 