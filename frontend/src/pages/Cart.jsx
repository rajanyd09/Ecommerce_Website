import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { addToCart, removeFromCart } from "../redux/features/cart/cartSlice";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <>
      <div className="container flex justify-around items-start flex-wrap mx-auto mt-8">
        {cartItems.length === 0 ? (
          <div className="text-center p-12 rounded-xl border shadow-lg"
            style={{
              background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
              borderColor: 'rgba(71, 85, 105, 0.5)'
            }}
          >
            <p className="text-slate-300 text-lg mb-4">Your cart is empty</p>
            <Link 
              to="/shop"
              className="inline-block px-6 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                color: '#fff'
              }}
            >
              Go To Shop
            </Link>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-[80%]">
              <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Shopping Cart
              </h1>

              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center mb-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    borderColor: 'rgba(71, 85, 105, 0.5)'
                  }}
                >
                  <div className="w-[5rem] h-[5rem]">
                    <img
                      src={`${API_BASE_URL}${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-1 ml-4">
                    <Link to={`/product/${item._id}`} className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                      {item.name}
                    </Link>

                    <div className="mt-2 text-slate-400 text-sm">{item.brand}</div>
                    <div className="mt-2 text-slate-100 font-bold text-lg">
                      $ {item.price}
                    </div>
                  </div>

                  <div className="w-24">
                    <select
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      style={{
                        background: 'rgba(30, 41, 59, 0.6)',
                        borderColor: 'rgba(71, 85, 105, 0.8)',
                        color: '#f1f5f9'
                      }}
                      value={item.qty}
                      onChange={(e) =>
                        addToCartHandler(item, Number(e.target.value))
                      }
                    >
                      {[...Array(item.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <button
                      className="text-red-400 hover:text-red-300 mr-8 p-2 rounded-lg hover:bg-red-500/10 transition-all duration-200"
                      onClick={() => removeFromCartHandler(item._id)}
                    >
                      <FaTrash className="text-xl" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-8 w-[40rem]">
                <div className="p-6 rounded-xl border shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
                    borderColor: 'rgba(71, 85, 105, 0.5)'
                  }}
                >
                  <h2 className="text-xl font-semibold mb-3 text-slate-100">
                    Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
                  </h2>

                  <div className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ${" "}
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </div>

                  <button
                    className="mt-4 py-3 px-6 rounded-lg text-lg w-full font-semibold transition-all duration-200 hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: cartItems.length === 0 ? 'rgba(71, 85, 105, 0.5)' : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      color: '#fff'
                    }}
                    disabled={cartItems.length === 0}
                    onClick={checkoutHandler}
                  >
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;
