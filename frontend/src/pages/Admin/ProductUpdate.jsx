import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";

const API_BASE_URL = "http://localhost:4000";

const AdminProductUpdate = () => {
  const params = useParams();
  const navigate = useNavigate();

  const {
    data: productData,
    isLoading,
    isError,
  } = useGetProductByIdQuery(params._id);

  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);

  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setPrice(productData.price ?? "");
      setCategory(productData.category?._id || productData.category || "");
      setQuantity(productData.quantity ?? "");
      setBrand(productData.brand || "");
      setStock(productData.countInStock ?? 0);
      setImage(productData.image || "");
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Image uploaded successfully", {
        position: "top-right",
        autoClose: 2000,
      });
      setImage(res.image); // "/uploads/..."
    } catch (err) {
      toast.error(err?.data?.message || "Image upload failed", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      if (image) formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      formData.append("countInStock", stock);

      await updateProduct({
        productId: params._id,
        formData,
      }).unwrap();

      toast.success("Product successfully updated", {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const res = await deleteProduct(params._id).unwrap();

      toast.success(`"${res.name}" is deleted`, {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Delete failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const displayImage =
    image && image.startsWith("/uploads")
      ? `${API_BASE_URL}${image}`
      : image || "";

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError || !productData)
    return <div className="text-center py-10">Error loading product</div>;

  return (
    <div className="container xl:mx-[9rem] sm:mx-0 py-6">
      <div>
        <div className="md:w-1/4">
          <AdminMenu />
        </div>

        <div className="md:w-3/4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Edit Product
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Update product details or delete this item
                </p>
              </div>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              >
                Delete Product
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">
              {/* Left: Image card */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex flex-col items-center">
                <p className="text-sm font-medium text-gray-300 mb-3 w-full">
                  Product Image
                </p>

                {displayImage ? (
                  <div className="w-full flex items-center justify-center mb-3">
                    <img
                      src={displayImage}
                      alt="product"
                      className="max-w-[200px] h-auto object-cover rounded-md border border-gray-300 shadow-sm"
                    />
                  </div>
                ) : (
                  <div className="w-full h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md mb-3">
                    <span className="text-xs text-gray-500">
                      No image uploaded
                    </span>
                  </div>
                )}

                <label className="w-full mt-1">
                  <div className="w-full inline-flex items-center justify-center px-3 py-2 text-xs font-medium rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-900 cursor-pointer transition">
                    {image ? "Change Image" : "Upload Image"}
                  </div>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={uploadFileHandler}
                    className="hidden"
                  />
                </label>

                {image && (
                  <p className="mt-2 text-[11px] text-gray-500 break-all text-center">
                    Stored as: {image}
                  </p>
                )}
              </div>

              {/* Right: Form fields */}
              <form
                onSubmit={handleSubmit}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4"
              >
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-xs font-medium text-gray-400 mb-1"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Product name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="price"
                      className="block text-xs font-medium text-gray-400 mb-1"
                    >
                      Price
                    </label>
                    <input
                      id="price"
                      type="number"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-xs font-medium text-gray-400 mb-1"
                    >
                      Quantity
                    </label>
                    <input
                      id="quantity"
                      type="number"
                      min="1"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="Available units"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="brand"
                      className="block text-xs font-medium text-gray-400 mb-1"
                    >
                      Brand
                    </label>
                    <input
                      id="brand"
                      type="text"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Brand name"
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="stock"
                      className="block text-xs font-medium text-gray-400 mb-1"
                    >
                      Count In Stock
                    </label>
                    <input
                      id="stock"
                      type="number"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="category"
                      className="block text-xs font-medium text-gray-400 mb-1"
                    >
                      Category
                    </label>
                    <select
                      id="category"
                      className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-gray-300 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="">Select category</option>
                      {categories?.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-xs font-medium text-gray-400 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-[#101011] border border-gray-700 text-white focus:ring-1 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the product"
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/allproductslist")}
                    className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpdate;
