"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { API_ENDPOINTS } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export default function DashboardVentas() {
  const { token } = useAuth();
  // Estado para el mes seleccionado - usar localStorage para persistir la selección
  const [anio, setAnio] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboardVentasAnio');
      return saved ? parseInt(saved) : new Date().getFullYear();
    }
    return new Date().getFullYear();
  });
  const [mes, setMes] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('dashboardVentasMes');
      return saved ? parseInt(saved) : new Date().getMonth();
    }
    return new Date().getMonth();
  });
  const [datos, setDatos] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar datos del dashboard
  const cargarDatos = async () => {
    try {
      setLoading(true);
      // Usar el token del contexto de autenticación
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/ventas?mes=${mes}&anio=${anio}`;
      
      console.log('Haciendo petición a:', url);
      console.log('Token:', token ? 'Presente' : 'Ausente');
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Error al cargar datos: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Datos recibidos:', data);
      setDatos(data);
    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
      // En caso de error, usar datos por defecto
      setDatos({
        kpis: {
          promedioDiario: 0,
          totalVentas: 0,
          ventaHoy: 0,
          ticketPromedio: 0
        },
        ventasDiarias: [],
        topProductos: []
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para actualizar mes y guardar en localStorage
  const handleMesChange = (nuevoMes) => {
    setMes(nuevoMes);
    localStorage.setItem('dashboardVentasMes', nuevoMes.toString());
  };

  // Función para actualizar año y guardar en localStorage
  const handleAnioChange = (nuevoAnio) => {
    setAnio(nuevoAnio);
    localStorage.setItem('dashboardVentasAnio', nuevoAnio.toString());
  };

  useEffect(() => {
    if (token) {
      cargarDatos();
    }
  }, [mes, anio, token]);

  if (!token) {
    return (
      <div className="w-full mx-auto mt-10 pr-4 mr-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">No hay token de autenticación disponible</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full mx-auto mt-10 pr-4 mr-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Cargando datos...</div>
        </div>
      </div>
    );
  }

  const { kpis, ventasDiarias, topProductos } = datos || {};

  return (
    <div className="w-full mx-auto mt-10 pr-4 mr-8">
      {/* Título y selector de mes alineados como header de órdenes */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 mt-[-15px]">Dashboard de Ventas</h1>
        <div className="flex gap-2 items-center px-5 py-2.5">
          <select
            className="border rounded px-2 text-sm"
            value={mes}
            onChange={e => handleMesChange(Number(e.target.value))}
          >
            {meses.map((m, idx) => (
              <option key={m} value={idx}>{m}</option>
            ))}
          </select>
          <input
            type="number"
            className="border rounded px-2 w-20 text-sm"
            value={anio}
            min={2020}
            max={new Date().getFullYear()}
            onChange={e => handleAnioChange(Number(e.target.value))}
          />
        </div>
      </div>
      {/* Card principal */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 w-full flex flex-col gap-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPI label="Venta diaria promedio" value={formatCurrency(kpis?.promedioDiario || 0)} />
          <KPI label="Venta del mes" value={formatCurrency(kpis?.totalVentas || 0)} />
          <KPI label="Venta del día" value={formatCurrency(kpis?.ventaHoy || 0)} />
          <KPI label="Ticket promedio" value={formatCurrency(kpis?.ticketPromedio || 0)} />
        </div>
        {/* Gráficas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-72">
          {/* Ventas diarias */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col">
            <div className="text-base font-semibold text-blue-700 mb-2">Ventas diarias</div>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ventasDiarias || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={formatCurrency} labelFormatter={d => `Día ${d}`} />
                  <Bar dataKey="valor" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Top productos comparativo */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col">
            <div className="text-base font-semibold text-blue-700 mb-2">Top 5 productos</div>
            <div className="flex-1 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="90%">
                <BarChart
                  data={topProductos || []}
                  layout="vertical"
                  margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
                  barCategoryGap={16}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="nombre" type="category" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip />
                  <Bar dataKey="actual" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={16} />
                  <Bar dataKey="anterior" fill="#d1d5db" radius={[0, 4, 4, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function KPI({ label, value }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center flex flex-col justify-center shadow-sm">
      <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide">{label}</div>
      <div className="text-2xl font-bold text-blue-700">{value}</div>
    </div>
  );
}

function formatCurrency(num) {
  return num?.toLocaleString("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 0 }) || "-";
} 