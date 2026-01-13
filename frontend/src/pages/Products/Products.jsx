import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetProductDetailsQuery,
  useCreateReviewMutation,
} from "../../redux/api/productApiSlice";
import Rating from "./Rating";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { getImageUrl } from "../../Utils/config"; // ✅ ADD THIS
import { addToCart } from "../../redux/features/cart/cartSlice";
import {
  FaBox,
  FaClock,
  FaShoppingCart,
  FaStar,
  FaStore,
} from "react-icons/fa";
import moment from "moment";
import ProductTabs from "./Tabs";
import HeartIcon from "./HeartIcon";

const Product = () => {
  const { id: productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    toast.success("Added to cart!");
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({ productId, rating, comment }).unwrap();
      refetch();
      setRating(0);
      setComment("");
      toast.success("Review created successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error || err.message);
    }
  };

  if (!product) return <Loader />;

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
          {error?.data?.message || error.error}
        </Message>
      ) : (
        <>
          <div className="flex flex-col lg:flex-row gap-8 ml-[10rem] mt-8">
            {/* Image Section */}
            <div className="relative flex-shrink-0">
              <img
                src={getImageUrl(product.image)} // ✅ FIXED: Use getImageUrl
                alt={product.name}
                className="w-full max-w-md rounded-lg shadow-2xl object-cover xl:w-[50rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem]"
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
                <h2 className="text-3xl font-bold text-white">
                  {product.name}
                </h2>
                <p className="text-5xl my-4 font-extrabold text-pink-500">
                  ${product.price?.toLocaleString()}
                </p>
              </div>

              <p className="text-gray-300 xl:w-[35rem] lg:w-[35rem] md:w-[30rem]">
                {product.description}
              </p>

              {/* Product Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
                <div>
                  <h3 className="flex items-center mb-4">
                    <FaStore className="mr-2 text-pink-400" /> Brand:{" "}
                    {product.brand}
                  </h3>
                  <p className="flex items-center mb-4">
                    <FaClock className="mr-2 text-pink-400" /> Added:{" "}
                    {moment(product.createdAt).fromNow()}
                  </p>
                  <p className="flex items-center">
                    <FaStar className="mr-2 text-yellow-400" />{" "}
                    {product.numReviews} Reviews
                  </p>
                </div>
                <div>
                  <p className="flex items-center mb-4">
                    <FaStar className="mr-2 text-yellow-400" />{" "}
                    {Math.round(product.rating)} Rating
                  </p>
                  <p className="flex items-center mb-4">
                    <FaShoppingCart className="mr-2 text-pink-400" /> Quantity:{" "}
                    {product.quantity}
                  </p>
                  <p className="flex items-center">
                    <FaBox className="mr-2 text-green-400" />{" "}
                    {product.countInStock} In Stock
                  </p>
                </div>
              </div>

              {/* Rating & Quantity */}
              <div className="flex flex-wrap items-center gap-4">
                <Rating
                  value={product.rating}
                  text={`${product.numReviews} reviews`}
                />
                {product.countInStock > 0 && (
                  <select
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500 w-[6rem]"
                  >
                    {[...Array(product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Add to Cart */}
              <button
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed w-full lg:w-auto"
              >
                {product.countInStock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="mt-16 ml-[10rem]">
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
        </>
      )}
    </>
  );
};

export default Product;
