import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { getImageUrl } from "../../Utils/config"; // ✅ ADD THIS

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full max-w-xs bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-200">
      <div className="relative p-4">
        <Link to={`/product/${product._id}`}>
          <img
            src={getImageUrl(product.image)} // ✅ FIXED: Use getImageUrl
            alt={product.name}
            className="w-full h-48 object-contain rounded-lg hover:scale-105 transition-transform duration-200"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
        </Link>
        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-white font-semibold text-lg line-clamp-1 mb-2 hover:text-pink-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-pink-500">
            ${product.price?.toLocaleString()}
          </span>
          <span className="bg-pink-100 text-pink-800 text-xs font-bold px-3 py-1 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {product.brand}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
