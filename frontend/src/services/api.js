import { getSession } from "next-auth/react";

export const API_ENDPOINTS = {
  MEDICAMENTOS: `${process.env.NEXT_PUBLIC_API_URL}/api/medicamentos`,
  LABORATORIOS: `${process.env.NEXT_PUBLIC_API_URL}/api/laboratorios`,
  ORDENES_COMPRA: `${process.env.NEXT_PUBLIC_API_URL}/api/ordenes-compra`,
  DETALLES_COMPRA: `${process.env.NEXT_PUBLIC_API_URL}/api/detalles-compra`,
  DETALLES_VENTA: `${process.env.NEXT_PUBLIC_API_URL}/api/detalles-venta`,
  ORDENES_VENTA: `${process.env.NEXT_PUBLIC_API_URL}/api/ordenes-venta`,
  ESPECIALIDADES: `${process.env.NEXT_PUBLIC_API_URL}/api/especialidades`,
  TIPOS: `${process.env.NEXT_PUBLIC_API_URL}/api/tipos`,
  AUTH_LOGIN: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
  AUTH_LOGIN_GOOGLE: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login-google`,
  AUTH_USERS: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/users`,
  AUTH_PROFILE: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
};

// Helper para peticiones autenticadas
export async function fetchWithAuth(url, options = {}) {
  const session = await getSession();
  const headers = {
    ...(options.headers || {}),
    Authorization: session?.backendToken ? `Bearer ${session.backendToken}` : "",
    "Content-Type": "application/json",
  };
  return fetch(url, { ...options, headers });
}

export async function getMedicamentos() {
    const res = await fetch(API_ENDPOINTS.MEDICAMENTOS, { cache: 'no-store' });
    return res.json();
}
  
export async function getLaboratorios() {
    const res = await fetch(API_ENDPOINTS.LABORATORIOS, { cache: 'no-store' });
    return res.json();
}
  
export async function addMedicamento(medicamento) {
    const res = await fetch(API_ENDPOINTS.MEDICAMENTOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medicamento)
    });
    return res.json();
}

export async function addLaboratorio(laboratorio) {
    const res = await fetch(API_ENDPOINTS.LABORATORIOS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(laboratorio)
    });
    return res.json();
}

export async function updateLaboratorio(id, laboratorio) {
    const res = await fetch(`${API_ENDPOINTS.LABORATORIOS}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(laboratorio)
    });
    return res.json();
}

export async function getOrdenesCompra() {
    const res = await fetch(API_ENDPOINTS.ORDENES_COMPRA, { cache: 'no-store' });
    return res.json();
}

export async function addOrdenCompra(orden) {
    const res = await fetch(API_ENDPOINTS.ORDENES_COMPRA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orden)
    });
    return res.json();
}

export async function updateOrdenCompra(id, orden) {
    const res = await fetch(`${API_ENDPOINTS.ORDENES_COMPRA}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orden)
    });
    return res.json();
}

export async function deleteOrdenCompra(id) {
    const res = await fetch(`${API_ENDPOINTS.ORDENES_COMPRA}/${id}`, {
      method: 'DELETE'
    });
    return res.json();
}

export async function getDetallesOrdenCompra() {
    const res = await fetch(API_ENDPOINTS.DETALLES_COMPRA, { cache: 'no-store' });
    return res.json();
}

export async function addDetalleOrdenCompra(detalle) {
    const res = await fetch(API_ENDPOINTS.DETALLES_COMPRA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detalle)
    });
    return res.json();
}

export async function updateDetalleOrdenCompra(id, detalle) {
    const res = await fetch(`${API_ENDPOINTS.DETALLES_COMPRA}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detalle)
    });
    return res.json();
}

export async function deleteDetalleOrdenCompra(id) {
    const res = await fetch(`${API_ENDPOINTS.DETALLES_COMPRA}/${id}`, {
      method: 'DELETE'
    });
    return res.json();
}

export async function getDetallesOrdenVenta() {
    const res = await fetch(API_ENDPOINTS.DETALLES_VENTA, { cache: 'no-store' });
    return res.json();
}

export async function addDetalleOrdenVenta(detalle) {
    const res = await fetch(API_ENDPOINTS.DETALLES_VENTA, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detalle)
    });
    return res.json();
}

export async function updateDetalleOrdenVenta(id, detalle) {
    const res = await fetch(`${API_ENDPOINTS.DETALLES_VENTA}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(detalle)
    });
    return res.json();
}

export async function deleteDetalleOrdenVenta(id) {
    const res = await fetch(`${API_ENDPOINTS.DETALLES_VENTA}/${id}`, {
      method: 'DELETE'
    });
    return res.json();
}

// Funciones de autenticación
export async function loginUser(credentials) {
  const res = await fetch(API_ENDPOINTS.AUTH_LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return res.json();
}

export async function loginGoogleUser(googleData) {
  const res = await fetch(API_ENDPOINTS.AUTH_LOGIN_GOOGLE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(googleData)
  });
  return res.json();
}

export async function getUsers() {
  const res = await fetchWithAuth(API_ENDPOINTS.AUTH_USERS);
  return res.json();
}

export async function createUser(userData) {
  const res = await fetchWithAuth(API_ENDPOINTS.AUTH_USERS, {
    method: 'POST',
    body: JSON.stringify(userData)
  });
  return res.json();
}

export async function updateUser(id, userData) {
  const res = await fetchWithAuth(`${API_ENDPOINTS.AUTH_USERS}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  });
  return res.json();
}

export async function deleteUser(id) {
  const res = await fetchWithAuth(`${API_ENDPOINTS.AUTH_USERS}/${id}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function getProfile() {
  const res = await fetchWithAuth(API_ENDPOINTS.AUTH_PROFILE);
  return res.json();
}