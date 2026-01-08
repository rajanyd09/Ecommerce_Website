// src/config.js (or utils/config.js)
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000";

export const getImageUrl = (path) => {
  const base = import.meta.env.VITE_API_URL || "http://localhost:4000";
  return path?.startsWith("http") ? path : `${base}${path}`;
};
