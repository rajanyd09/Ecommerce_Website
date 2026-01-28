import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { getImageUrl } from "../../Utils/config";

const Product = ({ product }) => {
  const imageSrc = getImageUrl(product.image);

  console.log("Product image path:", product.image, "→ Full URL:", imageSrc);

  return (
    <div className="w-full max-w-sm rounded-xl shadow-lg border overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderColor: 'rgba(71, 85, 105, 0.5)'
      }}
    >
      <div className="relative overflow-hidden">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            console.error("❌ Home image FAILED:", imageSrc);
            e.target.src = "https://via.placeholder.com/480x400?text=No+Image";
            e.target.style.filter = "grayscale(1)";
          }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <HeartIcon product={product} />
      </div>

      <div className="p-4">
        <Link
          to={`/product/${product._id}`}
          className="block hover:text-blue-400 transition-colors"
        >
          <div className="flex justify-between items-start gap-3">
            <h2 className="text-lg font-semibold text-slate-100 line-clamp-2 flex-1">
              {product.name}
            </h2>
            <span className="text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 shadow-md"
              style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%)',
                color: '#fff'
              }}
            >
              ${product.price?.toLocaleString() || "0"}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Product;
