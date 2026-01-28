import { Link } from "react-router-dom";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/features/cart/cartSlice";
import { toast } from "react-toastify";
import HeartIcon from "./HeartIcon";
import { getImageUrl } from "../../Utils/config";

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
    <div className="max-w-sm relative rounded-xl shadow-lg border overflow-hidden group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
      style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        borderColor: 'rgba(71, 85, 105, 0.5)'
      }}
    >
      <section className="relative">
        <Link to={`/product/${p._id}`}>
          <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full z-10 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(147, 51, 234, 0.9) 100%)',
              color: '#fff'
            }}
          >
            {p?.brand}
          </span>
          <img
            src={getImageUrl(p.image)}
            alt={p?.name}
            className="cursor-pointer w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/300x200?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
        <HeartIcon product={p} />
      </section>

      <div className="p-4">
        <Link to={`/product/${p._id}`}>
          <h5 className="text-lg font-semibold text-slate-100 truncate mb-2 hover:text-blue-400 transition-colors">
            {p?.name}
          </h5>
        </Link>

        <p className="mb-3 text-slate-400 text-sm line-clamp-2 leading-relaxed">
          {p?.description}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-medium">Price</span>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ${p?.price?.toLocaleString()}
            </span>
          </div>

          <button
            className="p-2.5 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'
            }}
            onClick={() => addToCartHandler(p, 1)}
            title="Add to cart"
          >
            <AiOutlineShoppingCart className="text-white" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
