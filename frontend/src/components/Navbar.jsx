import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

import {
  FaBars,
  FaTimes,
  FaHome,
  FaPlusCircle,
  FaBoxOpen,
  FaEnvelopeOpenText,
  FaInbox,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaHeart,
  FaBell,
} from "react-icons/fa";

function Navbar() {
  const { token, logout } = useContext(AuthContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200 shadow-md">

      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">

        {/* Logo */}

        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
            C
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-gray-800">
              CampusAI
            </h1>

            <p className="text-xs text-gray-500">
              AI Powered Marketplace
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}

        <div className="hidden md:flex items-center gap-3">

          <Link
            to="/"
            className={`px-4 py-2 rounded-xl transition font-medium ${
              isActive("/")
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            Home
          </Link>

          {token && (
            <>
              <Link
                to="/add-product"
                className={`px-4 py-2 rounded-xl transition font-medium ${
                  isActive("/add-product")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                Sell Item
              </Link>

              <Link
                to="/my-products"
                className={`px-4 py-2 rounded-xl transition font-medium ${
                  isActive("/my-products")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                My Listings
              </Link>

              <Link
                to="/my-offers"
                className={`px-4 py-2 rounded-xl transition font-medium ${
                  isActive("/my-offers")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                My Offers
              </Link>

              <Link
                to="/received-offers"
                className={`px-4 py-2 rounded-xl transition font-medium ${
                  isActive("/received-offers")
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                Received Offers
              </Link>
              <Link
                to="/wishlist"
                className={`px-4 py-2 rounded-xl transition font-medium ${
                isActive("/wishlist")
                 ? "bg-blue-600 text-white"
                 : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                 }`}
              >
                Wishlist ❤️
              </Link>
              <Link
               to="/notifications"
               className={`px-4 py-2 rounded-xl transition font-medium ${
                isActive("/notifications")
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              }`}
              >
             🔔 Notifications
             </Link>
            </>
            
          )}

          {!token ? (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition font-semibold"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-semibold shadow-lg"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-5 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition font-semibold shadow-lg"
            >
              Logout
            </button>
          )}

        </div>

        {/* Mobile Button */}

        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

      </div>
            {/* Mobile Menu */}

      {menuOpen && (
        <div className="md:hidden border-t bg-white shadow-lg">
          <div className="flex flex-col p-4 gap-2">

            <Link
              to="/"
              onClick={closeMenu}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                isActive("/")
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <FaHome />
              Home
            </Link>

            {token && (
              <>
                <Link
                  to="/add-product"
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive("/add-product")
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FaPlusCircle />
                  Sell Item
                </Link>

                <Link
                  to="/my-products"
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive("/my-products")
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FaBoxOpen />
                  My Listings
                </Link>

                <Link
                  to="/my-offers"
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive("/my-offers")
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FaEnvelopeOpenText />
                  My Offers
                </Link>

                <Link
                  to="/received-offers"
                  onClick={closeMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                    isActive("/received-offers")
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <FaInbox />
                  Received Offers
                </Link>
                <Link
                 to="/wishlist"
                 onClick={closeMenu}
                 className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                 isActive("/wishlist")
                ? "bg-blue-600 text-white"
                 : "hover:bg-gray-100"
                }`}
              >
              <FaHeart />
             Wishlist
            </Link>

            <Link
               to="/notifications"
               onClick={closeMenu}
               className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
               isActive("/notifications")
               ? "bg-blue-600 text-white"
               : "hover:bg-gray-100"
              }`}
            >
            <FaBell />
             Notifications
            </Link>
              </>
            )}

            {!token ? (
              <>
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-100"
                >
                  <FaSignInAlt />
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={closeMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white"
                >
                  <FaUserPlus />
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500 text-white"
              >
                <FaSignOutAlt />
                Logout
              </button>
            )}

          </div>
        </div>
      )}

    </nav>
  );
}

export default Navbar;