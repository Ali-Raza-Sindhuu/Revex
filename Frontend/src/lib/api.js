// Normalize the configured origin so a trailing slash cannot produce URLs like
// `https://api.example.com//api/cars` (which can bypass Vercel routing).
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace(/\/+$/, "");
const CATALOG_CACHE_MS = 20_000;
const catalogCache = new Map();
const catalogRequests = new Map();

const isCatalogRequest = (path, method, token) =>
  method === "GET" && !token && path.startsWith("/api/cars") && !path.includes("/availability");

const abortable = (promise, signal) => {
  if (!signal) return promise;
  if (signal.aborted) return Promise.reject(new DOMException("Request aborted", "AbortError"));
  return new Promise((resolve, reject) => {
    const abort = () => reject(new DOMException("Request aborted", "AbortError"));
    signal.addEventListener("abort", abort, { once: true });
    promise.then(
      (value) => { signal.removeEventListener("abort", abort); resolve(value); },
      (error) => { signal.removeEventListener("abort", abort); reject(error); },
    );
  });
};

const fetchJson = async (path, { method, token, body, signal }) => {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      credentials: "include",
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    const networkError = new Error("Could not reach the server. Check the API URL and server connection, then try again.");
    networkError.name = error.name;
    throw networkError;
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const requestError = new Error(data.error?.message || "Request failed. Please try again.");
    requestError.status = response.status;
    throw requestError;
  }
  return data;
};

export const apiRequest = async (path, { method = "GET", token, body, signal } = {}) => {
  if (!isCatalogRequest(path, method, token)) {
    return fetchJson(path, { method, token, body, signal });
  }

  const key = `${API_BASE}${path}`;
  const cached = catalogCache.get(key);
  if (cached && cached.expiresAt > Date.now()) return abortable(Promise.resolve(cached.data), signal);

  let request = catalogRequests.get(key);
  if (!request) {
    request = fetchJson(path, { method, token, body }).then((data) => {
      catalogCache.set(key, { data, expiresAt: Date.now() + CATALOG_CACHE_MS });
      return data;
    }).finally(() => catalogRequests.delete(key));
    catalogRequests.set(key, request);
  }
  return abortable(request, signal);
};
