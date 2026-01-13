import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { getImageUrl } from "../../Utils/config"; // ✅ Keep this (handles images)

const ProductCard = ({ p }) => {
  const dispatch = useDispatch();

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Item added successfully", {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
  };

  return (
    <div className="max-w-sm relative bg-[#1A1A1A] rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <span className="absolute bottom-3 right-3 bg-pink-100 text-pink-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-pink-900 dark:text-pink-300">
            {p?.brand}
          </span>
          <img
            src={getImageUrl(p.image)} // ✅ Already correct
            alt={p?.name}
            className="cursor-pointer w-full rounded-t-lg" // ✅ Better Tailwind classes
            style={{ height: "170px", objectFit: "cover" }}
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x170?text=No+Image";
            }}
          />
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h5 className="text-xl font-semibold text-white truncate pr-2">
            {" "}
            {/* ✅ Fixed typo, added truncate */}
            {p?.name}
          </h5>
          <p className="text-pink-500 font-bold text-lg">
            {" "}
            {/* ✅ Simplified */}${p?.price?.toLocaleString()}
          </p>
        </div>

        <p className="mb-4 text-[#CFCFCF] text-sm line-clamp-2">
          {" "}
          {/* ✅ Better truncation */}
          {p?.description}
        </p>

        <section className="flex justify-between items-center">
          <Link
            to={`/product/${p._id}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-pink-700 rounded-lg hover:bg-pink-800 transition-colors duration-200"
          >
            Read More
            <svg className="w-3.5 h-3.5 ml-2" fill="none" viewBox="0 0 14 10">
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M1 5h12m0 0L9 1m4 4L9 9"
              />
            </svg>
          </Link>

          <button
            className="p-3 bg-pink-600 hover:bg-pink-700 rounded-full transition-all duration-200 shadow-lg hover:scale-105"
            onClick={() => addToCartHandler(p, 1)}
            title="Add to cart"
          >
            <AiOutlineShoppingCart className="text-white" size={22} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProductCard;
