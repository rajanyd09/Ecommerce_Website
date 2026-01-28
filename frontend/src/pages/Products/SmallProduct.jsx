import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { getImageUrl } from "../../Utils/config";

const SmallProduct = ({ product }) => {
  return (
    <div className="w-full max-w-xs rounded-lg shadow-lg border overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
      style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderColor: 'rgba(71, 85, 105, 0.5)'
      }}
    >
      <div className="relative p-3">
        <Link to={`/product/${product._id}`}>
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-full h-40 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
          <div className="absolute inset-3 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
        </Link>
        <HeartIcon product={product} />
      </div>

      <div className="px-3 pb-3">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-slate-100 font-semibold text-base line-clamp-1 mb-2 hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center justify-between">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            ${product.price?.toLocaleString()}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full shadow-md"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%)',
              color: '#fff'
            }}
          >
            {product.brand}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SmallProduct;
