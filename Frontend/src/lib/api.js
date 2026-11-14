const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const apiRequest = async (path, { method = "GET", token, body, signal } = {}) => {
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
