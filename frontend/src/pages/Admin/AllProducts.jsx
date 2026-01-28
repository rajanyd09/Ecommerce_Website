import { Link } from "react-router-dom";
import moment from "moment";
import { useAllProductsQuery } from "../../redux/api/productApiSlice";
import AdminMenu from "./AdminMenu";

const API_BASE_URL = "http://localhost:4000"; // your backend origin

const AllProducts = () => {
  const { data: products = [], isLoading, isError } = useAllProductsQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading products</div>;
  }

  return (
    <>
      <div className="container">
        <div className="flex flex-col md:flex-row">
          <div className="p-3 flex-1">
            <div className="ml-[2rem] text-2xl font-bold h-12 mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              All Products ({products.length})
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {products.map((product) => {
                const imageSrc = product.image?.startsWith("/uploads")
                  ? `${API_BASE_URL}${product.image}`
                  : product.image;

                return (
                  <div key={product._id} className="block mb-4 rounded-xl border p-4 transition-all duration-200 hover:shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                      borderColor: 'rgba(71, 85, 105, 0.5)'
                    }}
                  >
                    <div className="flex gap-4">
                      <img
                        src={imageSrc}
                        alt={product.name}
                        className="w-[10rem] h-[10rem] flex-shrink-0 object-cover rounded-lg"
                      />

                      <div className="flex flex-col justify-between min-w-0 flex-1">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="text-xl font-semibold text-slate-100 mb-2 pr-4 flex-1 min-w-0 line-clamp-2">
                              {product?.name}
                            </h5>

                            <p className="text-slate-500 text-xs whitespace-nowrap flex-shrink-0 ml-2">
                              {moment(product.createdAt).format("MMM Do YYYY")}
                            </p>
                          </div>

                          <p className="text-slate-400 text-sm mb-4 line-clamp-2 pr-4">
                            {product?.description?.substring(0, 160)}...
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-auto">
                          <Link
                            to={`/admin/product/update/${product._id}`}
                            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-200 hover:scale-105 shadow-md"
                            style={{
                              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
                            }}
                          >
                            Update Product
                            <svg
                              className="w-3.5 h-3.5 ml-2"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 14 10"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M1 5h12m0 0L9 1m4 4L9 9"
                              />
                            </svg>
                          </Link>

                          <p className="font-bold whitespace-nowrap text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            $ {product?.price}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="md:w-1/4 p-3 mt-2">
            <AdminMenu />
          </div>
        </div>
      </div>
    </>
  );
};

export default AllProducts;
