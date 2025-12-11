import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data, isLoading, error } = useFetchCategoriesQuery();

  // Normalize to always be an array
  const categories = data?.categories || data || [];

  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: {
          name: updatingName,
        },
      }).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async () => {
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Category delection failed. Tray again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#0f0f10] text-slate-100">
      <div className="ml-[10rem] flex flex-col md:flex-row">
        <AdminMenu />
        <div className="md:w-3/4 p-4 md:p-6">
          <div className="bg-[#1e1e2e]/80 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-lg p-5 md:p-7">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Manage Categories
              </h1>
              <p className="text-slate-400 text-sm md:text-base mt-1">
                Create and update product categories for your store
              </p>
            </div>

            {/* Create Category */}
            <div className="mb-6">
              <CategoryForm
                value={name}
                setValue={setName}
                handleSubmit={handleCreateCategory}
              />
            </div>

            <div className="border-t border-white/10 my-4" />

            {/* Category pills */}
            <div>
              <h2 className="text-sm font-semibold text-slate-300 mb-3">
                Existing Categories
              </h2>

              {isLoading && (
                <p className="text-slate-500 text-sm">Loading categories...</p>
              )}

              {error && (
                <p className="text-red-400 text-sm">
                  Failed to load categories.
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                {categories.length > 0 &&
                  categories.map((category) => (
                    <button
                      key={category._id}
                      className="px-4 py-2 rounded-full bg-[#1e1e2e]/80 border border-indigo-500/40 text-slate-100 text-sm font-medium shadow-lg shadow-indigo-900/30 hover:bg-indigo-500/80 hover:border-indigo-400 hover:shadow-indigo-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      onClick={() => {
                        setModalVisible(true);
                        setSelectedCategory(category);
                        setUpdatingName(category.name);
                      }}
                    >
                      {category.name}
                    </button>
                  ))}

                {!isLoading && !error && categories.length === 0 && (
                  <p className="text-slate-500 text-sm">
                    No categories yet. Create your first one above.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Modal */}
          <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <div className="bg-[#1e1e2e]/95 border border-white/10 rounded-2xl p-5 md:p-6 backdrop-blur-lg">
              <h3 className="text-lg font-semibold text-slate-100 mb-4">
                Edit Category
              </h3>
              <CategoryForm
                value={updatingName}
                setValue={(value) => setUpdatingName(value)}
                handleSubmit={handleUpdateCategory}
                buttonText="Update"
                handleDelete={handleDeleteCategory}
              />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
