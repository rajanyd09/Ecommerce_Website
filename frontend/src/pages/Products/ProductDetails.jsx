import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { getImageUrl } from "../../Utils/config"; // ✅ ADD THIS
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import HeartIcon from "./HeartIcon";
import Ratings from "./Ratings";
import ProductTabs from "./ProductTabs";
import { addToCart } from "../../redux/features/cart/cartSlice";

const ProductDetails = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const {
    data: product,
    isLoading,
    refetch,
    error,
  } = useGetProductDetailsQuery(productId);

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingProductReview }] =
    useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      setRating(0);
      setComment("");
      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Added to cart!");
    navigate("/cart");
  };

  if (!product) return null;

  return (
    <>
      <div className="mb-6">
        <Link
          to="/"
          className="text-white font-semibold hover:text-pink-400 transition-colors ml-[10rem]"
        >
          ← Go Back
        </Link>
      </div>

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || error.message}
        </Message>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8 ml-[10rem] mt-[2rem]">
          {/* Image Section */}
          <div className="relative flex-shrink-0">
            <img
              src={getImageUrl(product.image)} // ✅ FIXED: Use getImageUrl
              alt={product.name}
              className="w-full max-w-md rounded-lg shadow-2xl object-cover"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/500x500?text=No+Image";
              }}
            />
            <HeartIcon product={product} />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {product.name}
              </h2>
              <p className="text-5xl font-extrabold text-pink-500 mb-6">
                ${product.price?.toLocaleString()}
              </p>
            </div>

            <p className="text-lg text-gray-300 max-w-2xl">
              {product.description}
            </p>

            {/* Product Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div>
                <h3 className="flex items-center mb-4 text-lg font-semibold">
                  <FaStore className="mr-3 text-pink-400" /> {product.brand}
                </h3>
                <p className="flex items-center mb-4">
                  <FaClock className="mr-3 text-pink-400" /> Added{" "}
                  {moment(product.createdAt).fromNow()}
                </p>
                <p className="flex items-center">
                  <FaStar className="mr-3 text-yellow-400" />{" "}
                  {product.numReviews} reviews
                </p>
              </div>
              <div>
                <p className="flex items-center mb-4">
                  <FaStar className="mr-3 text-yellow-400" />{" "}
                  {Math.round(product.rating)} rating
                </p>
                <p className="flex items-center mb-4">
                  <FaShoppingCart className="mr-3 text-pink-400" /> Quantity:{" "}
                  {product.quantity}
                </p>
                <p className="flex items-center">
                  <FaBox className="mr-3 text-green-400" />{" "}
                  {product.countInStock} in stock
                </p>
              </div>
            </div>

            {/* Rating & Quantity */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Ratings
                value={product.rating}
                text={`${product.numReviews} reviews`}
              />
              {product.countInStock > 0 && (
                <select
                  value={qty}
                  onChange={(e) => setQty(Number(e.target.value))}
                  className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={addToCartHandler}
              disabled={product.countInStock === 0}
              className="w-full lg:w-auto bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.countInStock === 0
                ? "Out of Stock"
                : `Add to Cart - $${product.price}`}
            </button>
          </div>

          {/* Tabs Section */}
          <div className="lg:w-1/3">
            <ProductTabs
              loadingProductReview={loadingProductReview}
              userInfo={userInfo}
              submitHandler={submitHandler}
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              product={product}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetails;
