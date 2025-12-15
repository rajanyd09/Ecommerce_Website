import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const API_BASE_URL = "http://localhost:4000"; // backend on port 4000

const ProductList = () => {
  const [image, setImage] = useState(""); // server path "/uploads/..."
  const [imageFile, setImageFile] = useState(null); // actual File
  const [imagePreview, setImagePreview] = useState(null); // local blob preview

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null); // server path from API

  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const productData = new FormData();
      // send file to createProduct
      if (imageFile) {
        productData.append("image", image);
      }
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // local preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
    setImageFile(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      // res.image = "/uploads/image-....jpeg"
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
      setImagePreview(null);
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // If backend image path exists, use full URL; else use local preview
  const getDisplayImage = imageUrl
    ? `${API_BASE_URL}${imageUrl}` // http://localhost:4000/uploads/...
    : imagePreview;

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0]">
      <div className="flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-white">
              Create Product
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Add a new product to your inventory
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl">
            {/* Image Upload Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Product Image
              </label>

              {getDisplayImage ? (
                <div className="relative w-full h-48 bg-[#1a1a1b] rounded-lg border border-gray-700 overflow-hidden group">
                  <img
                    src={getDisplayImage}
                    alt="product"
                    className="w-full h-full object-contain"
                  />
                  <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <span className="text-white text-sm font-medium">
                      Change Image
                    </span>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={uploadFileHandler}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer bg-[#1a1a1b] hover:bg-[#202021] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-10 h-10 mb-3 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    <p className="text-sm text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PNG, JPG or WEBP
                    </p>
                  </div>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={uploadFileHandler}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2.5 bg-[#1a1a1b] border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter product name"
                />
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  className="w-full px-3 py-2.5 bg-[#1a1a1b] border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>

              {/* Brand */}
              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  className="w-full px-3 py-2.5 bg-[#1a1a1b] border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Enter brand name"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Category
                </label>
                <select
                  id="category"
                  className="w-full px-3 py-2.5 bg-[#1a1a1b] border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  onChange={(e) => setCategory(e.target.value)}
                  value={category}
                >
                  <option value="">Select category</option>
                  {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="w-full px-3 py-2.5 bg-[#1a1a1b] border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="0"
                />
              </div>

              {/* Stock */}
              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Count In Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  className="w-full px-3 py-2.5 bg-[#1a1a1b] border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                className="w-full px-3 py-2.5 bg-[#1a1a1b] border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter product description"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium rounded-lg transition-colors focus:ring-4 focus:ring-pink-500 focus:ring-opacity-50"
              >
                Create Product
              </button>
              <button
                type="button"
                onClick={() => navigate("/")}
                className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
