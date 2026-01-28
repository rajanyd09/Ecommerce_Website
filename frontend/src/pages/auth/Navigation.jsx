import { useState } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineLogin,
  AiOutlineUserAdd,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`${
        showSidebar ? "hidden" : "flex"
      } xl:flex lg:flex md:hidden sm:hidden flex-col justify-between p-4 text-slate-100 w-64 h-[100vh] fixed shadow-2xl transition-all duration-300`}
      id="navigation-container"
      style={{
        background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        backdropFilter: 'blur(12px)',
        borderRight: '1px solid rgba(71, 85, 105, 0.3)',
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.3), inset -1px 0 0 rgba(148, 163, 184, 0.1)',
        zIndex: 9999
      }}
    >
      <div className="flex flex-col space-y-2 mt-8">
        <Link
          to="/"
          className="flex items-center px-3 py-3 rounded-lg transition-all duration-200 hover:bg-slate-700/50 hover:text-blue-400 group"
        >
          <AiOutlineHome className="min-w-[26px]" size={26} />
          <span className="nav-item-name ml-3 font-medium whitespace-nowrap">HOME</span>
        </Link>

        <Link
          to="/shop"
          className="flex items-center px-3 py-3 rounded-lg transition-all duration-200 hover:bg-slate-700/50 hover:text-blue-400 group"
        >
          <AiOutlineShopping className="min-w-[26px]" size={26} />
          <span className="nav-item-name ml-3 font-medium whitespace-nowrap">SHOP</span>
        </Link>

        <Link to="/cart" className="flex items-center px-3 py-3 rounded-lg transition-all duration-200 hover:bg-slate-700/50 hover:text-blue-400 group relative">
          <div className="flex items-center">
            <AiOutlineShoppingCart className="min-w-[26px]" size={26} />
            <span className="nav-item-name ml-3 font-medium whitespace-nowrap">Cart</span>
          </div>

          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-full font-semibold min-w-[20px] text-center shadow-lg">
              {cartItems.reduce((a, c) => a + c.qty, 0)}
            </span>
          )}
        </Link>

        <Link to="/favorite" className="flex items-center px-3 py-3 rounded-lg transition-all duration-200 hover:bg-slate-700/50 hover:text-pink-400 group relative">
          <div className="flex items-center">
            <FaHeart className="min-w-[20px]" size={20} />
            <span className="nav-item-name ml-3 font-medium whitespace-nowrap">Favorites</span>
          </div>
          <FavoritesCount />
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={toggleDropdown}
          className="flex items-center text-slate-100 focus:outline-none hover:text-blue-400 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-slate-700/50"
        >
          {userInfo ? (
            <span className="font-medium">{userInfo.username}</span>
          ) : (
            <></>
          )}
          {userInfo && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 ml-1 transition-transform duration-200 ${
                dropdownOpen ? "transform rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
              />
            </svg>
          )}
        </button>

        {dropdownOpen && userInfo && (
          <ul
            className={`absolute right-0 mt-2 mr-14 space-y-1 rounded-lg overflow-hidden shadow-2xl border border-slate-600 ${
              !userInfo.isAdmin ? "-top-20" : "-top-80"
            }`}
            style={{
              background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.98) 100%)',
              backdropFilter: 'blur(12px)'
            }}
          >
            {userInfo.isAdmin && (
              <>
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="block px-4 py-2 text-slate-200 hover:bg-slate-700/50 hover:text-blue-400 transition-all duration-200"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/productlist"
                    className="block px-4 py-2 text-slate-200 hover:bg-slate-700/50 hover:text-blue-400 transition-all duration-200"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/categorylist"
                    className="block px-4 py-2 text-slate-200 hover:bg-slate-700/50 hover:text-blue-400 transition-all duration-200"
                  >
                    Category
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/orderlist"
                    className="block px-4 py-2 text-slate-200 hover:bg-slate-700/50 hover:text-blue-400 transition-all duration-200"
                  >
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/userlist"
                    className="block px-4 py-2 text-slate-200 hover:bg-slate-700/50 hover:text-blue-400 transition-all duration-200"
                  >
                    Users
                  </Link>
                </li>
              </>
            )}

            <li>
              <Link to="/profile" className="block px-4 py-2 text-slate-200 hover:bg-slate-700/50 hover:text-blue-400 transition-all duration-200">
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={logoutHandler}
                className="block w-full px-4 py-2 text-left text-slate-200 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
              >
                Logout
              </button>
            </li>
          </ul>
        )}
        {!userInfo && (
          <ul>
            <li>
              <Link
                to="/login"
                className="flex items-center mt-5 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-700/50 hover:text-blue-400 hover:translate-x-1"
              >
                <AiOutlineLogin className="mr-2 mt-[4px]" size={26} />
                <span className="nav-item-name ml-3 font-medium">LOGIN</span>
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="flex items-center mt-5 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-slate-700/50 hover:text-blue-400 hover:translate-x-1"
              >
                <AiOutlineUserAdd size={26} />
                <span className="nav-item-name ml-3 font-medium">REGISTER</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};

export default Navigation;
