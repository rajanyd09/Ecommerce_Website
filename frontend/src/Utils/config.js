const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/480x400?text=No+Image";

  // If already a full URL (cloudinary, etc.)
  if (imagePath.startsWith("http")) {
    return imagePath;
  }

  // Attach backend URL
  return `${BASE_URL}${imagePath}`;
};
