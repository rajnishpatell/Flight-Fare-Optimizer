import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Plane, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null); // <-- NEW
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  /** 
   * CLOSE DROPDOWN WHEN CLICKING OUTSIDE
   */
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Plane className="text-blue-600" size={28} />
          <h1 className="text-xl font-bold text-gray-900">
            Flight Fare Optimizer
          </h1>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Dashboard
          </Link>

          {/* If NOT logged in */}
          {!user && (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* If logged in */}
          {user && (
            <div className="relative" ref={dropdownRef}>  {/* <-- REF ADDED */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 py-2 rounded-xl hover:bg-gray-200 transition"
              >
                {user.avatar ? (
                  <img
                    src={`http://localhost:5000${user.avatar}`}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border border-gray-300"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center border border-gray-400">
                    <User size={16} className="text-gray-700" />
                  </div>
                )}

                <span className="font-medium">{user.name}</span>
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg p-3 w-44 border border-gray-200">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    className="flex items-center gap-2 px-3 py-2 w-full text-left text-red-600 hover:bg-gray-100 rounded-lg"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-md px-6 pb-4 space-y-2">
          <Link
            to="/"
            className="block py-2 text-gray-700 font-medium hover:text-blue-600"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/dashboard"
            className="block py-2 text-gray-700 font-medium hover:text-blue-600"
            onClick={() => setMobileOpen(false)}
          >
            Dashboard
          </Link>

          {!user && (
            <>
              <Link
                to="/login"
                className="block py-2 text-gray-700 font-medium hover:text-blue-600"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="block py-2 bg-blue-600 text-white rounded-lg text-center font-semibold mt-2"
                onClick={() => setMobileOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}

          {user && (
            <>
              <Link
                to="/profile"
                className="block py-2 text-gray-700 font-medium hover:text-blue-600"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>

              <button
                className="block py-2 text-red-600 font-medium hover:text-red-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
