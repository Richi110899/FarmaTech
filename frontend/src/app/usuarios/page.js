"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RoleGuard from '@/components/AuthGuard';
import { useAuth } from "@/contexts/AuthContext";
import Pagination from '@/components/Pagination';
import { getUsers, updateUser } from "@/services/api";

const API_USUARIOS = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`;

const FloatingInput = ({ label, name, type = "text", value, onChange, ...props }) => (
  <div className="relative mb-8">
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="peer h-12 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-blue-600 bg-transparent"
      placeholder={label}
      autoComplete="off"
      {...props}
    />
    <label
      htmlFor={name}
      className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-3.5 peer-focus:text-gray-800 peer-focus:text-sm"
    >
      {label}
    </label>
  </div>
);

const FloatingSelect = ({ label, name, value, onChange, children, ...props }) => {
  const [focused, setFocused] = useState(false);
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

function UsuariosPage(props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [selected, setSelected] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mensajeGlobal, setMensajeGlobal] = useState("");
  const [eliminando, setEliminando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const filasPorPagina = 10;
  const usuariosFiltrados = usuarios.filter(user =>
    (user.nombre || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (user.apellido || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (user.email || "").toLowerCase().includes(filtro.toLowerCase()) ||
    (user.rol || "").toLowerCase().includes(filtro.toLowerCase())
  );
  const totalPaginas = Math.ceil(usuariosFiltrados.length / filasPorPagina);
  const usuariosPaginados = usuariosFiltrados.slice((pagina - 1) * filasPorPagina, pagina * filasPorPagina);

  const { token } = useAuth();

  // Verificar autenticación y permisos
  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(localStorage.getItem('userData'));
    if (user && user.rol !== 'Administrador') {
      router.push('/');
      return;
    }

    fetchUsuarios();
  }, [router, token]);

  // Detectar parámetros de éxito en la URL
  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'created') {
      setMensajeGlobal("Usuario creado exitosamente");
      // Limpiar el parámetro de la URL
      router.replace('/usuarios');
      setTimeout(() => setMensajeGlobal(""), 3000);
    } else if (success === 'updated') {
      setMensajeGlobal("Usuario actualizado exitosamente");
      // Limpiar el parámetro de la URL
      router.replace('/usuarios');
      setTimeout(() => setMensajeGlobal(""), 3000);
    }
  }, [searchParams, router]);

  // Escape para cerrar modales (agregar showDeleteModal)
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (showDeleteModal) {
          setShowDeleteModal(false);
          setSelected(null);
        } else if (selected) {
          setSelected(null);
        }
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [selected, showDeleteModal]);

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      if (data.success) {
        setUsuarios(data.users);
      } else {
        setMensajeGlobal(data.message || "Error al cargar usuarios");
      }
    } catch (error) {
      console.error('Error:', error);
      setMensajeGlobal("Error de conexión");
    }
    setLoading(false);
  };

  // Filtro
  // const usuariosFiltrados = usuarios.filter(user =>
  //   (user.nombre || "").toLowerCase().includes(filtro.toLowerCase()) ||
  //   (user.apellido || "").toLowerCase().includes(filtro.toLowerCase()) ||
  //   (user.email || "").toLowerCase().includes(filtro.toLowerCase()) ||
  //   (user.rol || "").toLowerCase().includes(filtro.toLowerCase())
  // );

  // Cambia el handler para alternar activo/inactivo
  const handleActivarDesactivar = async () => {
    if (!selected) return;
    setEliminando(true);
    try {
      const data = await updateUser(selected.id, { activo: !selected.activo });
      if (data.success) {
        setMensajeGlobal(selected.activo ? 'Usuario desactivado correctamente' : 'Usuario activado correctamente');
        setShowDeleteModal(false);
        setSelected(null);
        await fetchUsuarios();
        setTimeout(() => setMensajeGlobal(''), 3000);
      } else {
        setMensajeGlobal(data.message || 'Error al actualizar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      setMensajeGlobal('Error de conexión');
    }
    setEliminando(false);
  };

  const isGmailUser = (email) => {
    return email && (email.includes('@gmail.com') || email.includes('@googlemail.com'));
  };

  // Lógica para saber si el usuario logueado es super admin
  const userData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userData')) : null;
  const isSuperAdmin = userData && userData.email === 'ricardo.gomez@tecsup.edu.pe';
  const isAdmin = userData && userData.rol === 'Administrador';

  // Nueva función para saber si un usuario puede ser seleccionado
  const puedeSeleccionar = (usuario) => {
    if (!userData) return false;
    if (usuario.email === userData.email) return false; // Nadie puede seleccionarse a sí mismo
    if (usuario.email === 'ricardo.gomez@tecsup.edu.pe') return isSuperAdmin; // Solo el super admin puede seleccionarse a sí mismo
    if (usuario.rol === 'Administrador' && !isSuperAdmin) return false; // Solo el super admin puede seleccionar a otros admins
    return true;
  };

  const columns = [
    { key: "id", label: "ID" },
    { key: "nombre", label: "Nombre" },
    { key: "apellido", label: "Apellido" },
    { key: "email", label: "Email" },
    { key: "rol", label: "Rol" },
  ];

  return (
    <div className="w-full mx-auto mt-10 pr-4 mr-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Usuarios</h1>
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium flex items-center gap-2"
          onClick={() => router.push('/usuarios/nuevo')}
        >
          <span className="text-xl leading-none">+</span>
          <span className="text-sm font-medium">Agregar</span>
        </button>
      </div>
      <input
        type="text"
        placeholder="Filtrar usuarios..."
        className="mb-6 px-4 py-2.5 border border-gray-300 rounded-lg w-full focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition-all duration-200 text-sm"
        value={filtro}
        onChange={e => { setFiltro(e.target.value); setPagina(1); }}
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
            {usuariosPaginados.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center p-6 text-gray-500 text-sm">Sin datos disponibles</td>
              </tr>
            ) : (
              usuariosPaginados.map((usuario) => (
                <tr
                  key={usuario.id}
                  className={`hover:bg-blue-50 cursor-pointer transition-colors duration-150 border-b border-gray-100 ${!puedeSeleccionar(usuario) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => puedeSeleccionar(usuario) && setSelected(usuario)}
                >
                  <td className="p-3 text-sm text-gray-800">{String(usuario.id).padStart(3, '0')}</td>
                  <td className="p-3 text-sm text-gray-800">{usuario.nombre}</td>
                  <td className="p-3 text-sm text-gray-800">{usuario.apellido}</td>
                  <td className="p-3 text-sm text-gray-800">{usuario.email}</td>
                  <td className="p-3 text-sm text-gray-800">{usuario.rol}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de paginación */}
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
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setSelected(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-6 text-gray-800 pr-8">Detalle de Usuario</h2>
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                <div>
                  <div className="text-gray-400 text-sm mb-1">ID</div>
                  <div className="text-gray-900 font-medium text-sm">{String(selected.id).padStart(3, '0')}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Nombre</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.nombre}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Apellido</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.apellido}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Email</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.email}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Rol</div>
                  <div className="text-gray-900 font-medium text-sm">{selected.rol}</div>
                </div>
              </div>
            </div>
            {/* Botones de acciones */}
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => router.push(`/usuarios/editar/${selected.id}`)}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-yellow-500 bg-white text-yellow-700 hover:bg-yellow-50 hover:border-yellow-600 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
              >
                Editar
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className={`flex-1 px-4 py-3 rounded-xl border-2 ${selected.activo === false ? 'border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700' : 'border-red-600 text-red-700 hover:bg-red-50 hover:border-red-700'} bg-white transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md`}
              >
                {selected.activo === false ? 'Activar' : 'Desactivar'}
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
              <h2 className="text-base font-semibold mb-2 text-gray-800 mb-8">Confirmar {selected.activo === false ? 'Activación' : 'Desactivación'}</h2>
            </div>
            <div className="space-y-6">
              <div className={`rounded-lg p-4 ${selected.activo === false ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className={selected.activo === false ? 'text-green-800 font-medium' : 'text-red-800 font-medium'}>
                  ¿Estás seguro de que quieres {selected.activo === false ? 'activar' : 'desactivar'} el usuario "{selected.nombre}"?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelected(null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md"
                  disabled={eliminando}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleActivarDesactivar}
                  className={`flex-1 px-4 py-3 rounded-xl border-2 ${selected.activo === false ? 'border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700' : 'border-red-600 text-red-700 hover:bg-red-50 hover:border-red-700'} bg-white transition-all duration-200 text-sm font-semibold shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={eliminando}
                >
                  {eliminando ? (selected.activo === false ? 'Activando...' : 'Desactivando...') : (selected.activo === false ? 'Activar' : 'Desactivar')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper para proteger por rol
const UsuariosPageWithGuard = (props) => (
  <RoleGuard roles={['Administrador']}>
    <UsuariosPage {...props} />
  </RoleGuard>
);

export default UsuariosPageWithGuard; 