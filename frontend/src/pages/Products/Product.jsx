import { Link } from "react-router-dom";
import HeartIcon from "./HeartIcon";
import { getImageUrl } from "../../Utils/config"; // Make sure this import is correct

const Product = ({ product }) => {
  // Use the getImageUrl function from your config
  const imageSrc = getImageUrl(product.image);

  // DEBUG: Check what URL is being generated
  console.log("Product image path:", product.image, "→ Full URL:", imageSrc);

  return (
    <div className="w-[30rem] ml-[2rem] p-3 relative bg-gray-900 rounded-lg shadow-lg">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-[25rem] object-cover transition-transform hover:scale-105"
          onError={(e) => {
            console.error("❌ Home image FAILED:", imageSrc);
            e.target.src = "https://via.placeholder.com/480x400?text=No+Image";
            e.target.style.filter = "grayscale(1)";
          }}
          loading="lazy"
        />

        <HeartIcon product={product} />
      </div>

      <div className="p-4 bg-gray-900">
        <Link
          to={`/product/${product._id}`}
          className="block hover:text-pink-400"
        >
          <h2 className="flex justify-between items-center mb-2">
            <span className="text-lg font-semibold text-white truncate pr-4">
              {product.name}
            </span>
            <span className="bg-pink-100 text-pink-800 text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap">
              ${product.price?.toLocaleString() || "0"}
            </span>
          </h2>
        </Link>
      </div>
    </div>
  );
};

export default Product;
