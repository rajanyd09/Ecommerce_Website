import { useGetTopProductsQuery } from "../redux/api/productApiSlice";
import Loader from "./Loader";
import SmallProduct from "../pages/Products/SmallProduct.jsx";
import ProductCarousel from "../pages/Products/ProductCarousel";

const Header = () => {
  const { data: products = [], isLoading, error } = useGetTopProductsQuery();

  if (isLoading) return <Loader />;

  if (error)
    return (
      <h1 className="text-center text-red-500 mt-4">
        Failed to load top products.
      </h1>
    );

  if (!products.length) {
    return (
      <div className="flex justify-center items-center py-8">
        <p className="text-gray-400 text-sm">
          No top products available right now.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full ">
      <div className="max-w-7xl mx-auto px-4 py-6 lg:py-10">
        {/* Header title row (optional) */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              Featured Products
            </h2>
            <p className="text-sm text-gray-400">
              Handpicked items based on ratings and popularity.
            </p>
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Left: small product grid (hidden on very small if you want) */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {products.slice(0, 4).map((product) => (
                <SmallProduct key={product._id} product={product} />
              ))}
            </div>
          </div>

          {/* Right: carousel – takes full width on mobile, 2/3 on desktop */}
          <div className="col-span-1 lg:col-span-2">
            <ProductCarousel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
