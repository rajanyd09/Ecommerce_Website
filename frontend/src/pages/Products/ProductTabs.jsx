import { useState } from "react";
import { Link } from "react-router-dom";
import Ratings from "./Ratings";
import { useGetTopProductsQuery } from "../../redux/api/productApiSlice";
import SmallProduct from "./SmallProduct";
import Loader from "../../components/Loader";
import { getImageUrl } from "../../Utils/config"; // ✅ ADD IF NEEDED

const ProductTabs = ({
  loadingProductReview,
  userInfo,
  submitHandler,
  rating,
  setRating,
  comment,
  setComment,
  product,
}) => {
  const { data, isLoading: topProductsLoading } = useGetTopProductsQuery();
  const [activeTab, setActiveTab] = useState(1);

  const handleTabClick = (tabNumber) => {
    setActiveTab(tabNumber);
  };

  const tabs = [
    { id: 1, label: "Write Review" },
    { id: 2, label: "All Reviews" },
    { id: 3, label: "Related Products" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Tab Headers */}
      <div className="flex bg-gray-800 rounded-lg overflow-hidden mb-6">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex-1 py-4 px-6 text-center cursor-pointer transition-all duration-200 text-white hover:bg-pink-600 ${
              activeTab === tab.id
                ? "bg-pink-600 font-bold shadow-md"
                : "hover:text-pink-300"
            }`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-8">
        {/* Tab 1: Write Review */}
        {activeTab === 1 && (
          <div className="bg-gray-900 p-8 rounded-xl shadow-2xl">
            {userInfo ? (
              <form onSubmit={submitHandler} className="max-w-2xl">
                <div className="mb-6">
                  <label
                    htmlFor="rating"
                    className="block text-xl font-semibold mb-3 text-white"
                  >
                    Rating *
                  </label>
                  <select
                    id="rating"
                    required
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full p-4 border-2 border-gray-600 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50"
                  >
                    <option value="">Select Rating</option>
                    <option value="1">⭐ Inferior</option>
                    <option value="2">⭐⭐ Decent</option>
                    <option value="3">⭐⭐⭐ Great</option>
                    <option value="4">⭐⭐⭐⭐ Excellent</option>
                    <option value="5">⭐⭐⭐⭐⭐ Exceptional</option>
                  </select>
                </div>

                <div className="mb-8">
                  <label
                    htmlFor="comment"
                    className="block text-xl font-semibold mb-3 text-white"
                  >
                    Comment *
                  </label>
                  <textarea
                    id="comment"
                    rows="5"
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full p-4 border-2 border-gray-600 rounded-xl bg-gray-800 text-white focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/50 resize-vertical"
                    placeholder="Share your experience with this product..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingProductReview || !rating || !comment}
                  className="bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-8 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  {loadingProductReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            ) : (
              <div className="text-center py-12">
                <p className="text-xl text-gray-300 mb-4">
                  Please{" "}
                  <Link
                    to="/login"
                    className="text-pink-400 hover:text-pink-300 font-semibold"
                  >
                    sign in
                  </Link>{" "}
                  to write a review
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: All Reviews */}
        {activeTab === 2 && (
          <div className="space-y-4">
            {product.reviews.length === 0 ? (
              <div className="text-center py-12 bg-gray-900 rounded-xl">
                <p className="text-xl text-gray-400">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            ) : (
              product.reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-[#1A1A1A] p-6 rounded-xl border border-gray-700 hover:border-pink-500/50 transition-all duration-200"
                >
                  <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                    <strong className="text-lg text-white">
                      {review.name}
                    </strong>
                    <span className="text-sm text-gray-400">
                      {moment(review.createdAt).format("MMM DD, YYYY")}
                    </span>
                  </div>
                  <Ratings value={review.rating} />
                  <p className="mt-4 text-gray-300 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 3: Related Products */}
        {activeTab === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topProductsLoading ? (
              <Loader />
            ) : !data?.length ? (
              <p className="col-span-full text-center py-12 text-gray-400">
                No related products found
              </p>
            ) : (
              data.slice(0, 8).map((relatedProduct) => (
                <div key={relatedProduct._id} className="w-full">
                  <SmallProduct product={relatedProduct} />
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTabs;
