// Client API centralisé.
// L'hôte de l'API était codé en dur (`http://localhost:3001`) à 15 endroits :
// il est désormais défini une seule fois ici, surchargé en prod via VITE_API_URL.
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

/** Construit une URL absolue vers l'API à partir d'un chemin (`/api/...`). */
export const apiUrl = (path) => `${API_URL}${path}`;

/** En-tête d'authentification admin (token émis au login). */
const authHeaders = () => {
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Si le token est expiré/invalide, on renvoie vers le login admin.
const handleUnauthorized = (res) => {
  if (res.status === 401 && window.location.pathname.startsWith("/admin")) {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  }
  return res;
};

const getJson = (path, auth = false) =>
  fetch(apiUrl(path), { headers: auth ? authHeaders() : {} })
    .then(handleUnauthorized)
    .then((r) => r.json());
const sendJson = (path, body, method = "POST", auth = false) =>
  fetch(apiUrl(path), {
    method,
    headers: { "Content-Type": "application/json", ...(auth ? authHeaders() : {}) },
    body: JSON.stringify(body),
  }).then(handleUnauthorized);
const postForm = (path, formData, auth = false) =>
  fetch(apiUrl(path), {
    method: "POST",
    headers: auth ? authHeaders() : {},
    body: formData,
  }).then(handleUnauthorized);

export const api = {
  // Lectures publiques → renvoient les données déjà extraites de l'enveloppe { data }.
  getProducts: () => getJson("/api/products").then((d) => d.data || []),
  getStatus: () => getJson("/api/status"),
  getSettings: () => getJson("/api/settings"),

  // Lectures admin (token requis)
  getAppointments: () => getJson("/api/appointments", true).then((d) => d.data || []),
  getPrescriptions: () => getJson("/api/prescriptions", true).then((d) => d.data || []),
  getOrders: () => getJson("/api/orders", true).then((d) => d.data || []),
  getStats: () => getJson("/api/stats", true).then((d) => d.data),

  // Écritures publiques
  createAppointment: (body) => sendJson("/api/appointments", body),
  uploadPrescription: (formData) => postForm("/api/prescriptions", formData),
  // Crée la commande : persiste en base, génère le PDF serveur et renvoie
  // { orderNumber, pdfUrl, whatsappUrl }.
  createOrder: (body) => sendJson("/api/orders", body),
  login: (password) => sendJson("/api/login", { password }).then((r) => r.json()),

  // Écritures admin → renvoient la Response brute (l'appelant inspecte res.ok).
  createProduct: (body) => sendJson("/api/products", body, "POST", true),
  updateProduct: (id, body) => sendJson(`/api/products/${id}`, body, "PUT", true),
  deleteProduct: (id) =>
    fetch(apiUrl(`/api/products/${id}`), { method: "DELETE", headers: authHeaders() }).then(handleUnauthorized),
  uploadImage: (formData) => postForm("/api/upload", formData, true).then((r) => r.json()),
  updateOrder: (id, body) => sendJson(`/api/orders/${id}`, body, "PATCH", true),
  updateAppointment: (id, body) => sendJson(`/api/appointments/${id}`, body, "PATCH", true),
  updatePrescription: (id, body) => sendJson(`/api/prescriptions/${id}`, body, "PATCH", true),
  updateSettings: (body) => sendJson("/api/settings", body, "PUT", true),
};
