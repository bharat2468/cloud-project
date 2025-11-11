import React from "react";
import ThemeSwitcher from "./ThemeSwitcher";
import { useAuth } from "../contexts/AuthContext";

function ModernNavBar() {
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("productID");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a href="/">Home</a></li>
            <li><a href="/cart">Cart</a></li>
            {isLoggedIn && <li><a href="/profile">Profile</a></li>}
          </ul>
        </div>
        <a href="/" className="btn btn-ghost text-xl font-bold">
          🎮 GameStore
        </a>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a href="/" className="btn btn-ghost">Home</a></li>
          <li><a href="/cart" className="btn btn-ghost">Cart</a></li>
          {isLoggedIn && <li><a href="/profile" className="btn btn-ghost">Profile</a></li>}
        </ul>
      </div>
      
      <div className="navbar-end gap-2">
        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Cart */}
        <a href="/cart" className="btn btn-ghost btn-circle">
          <div className="indicator">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v5a2 2 0 01-2 2H9a2 2 0 01-2-2v-5m6-5V5a2 2 0 00-2-2H9a2 2 0 00-2 2v3" />
            </svg>
            <span className="badge badge-sm badge-primary indicator-item">0</span>
          </div>
        </a>

        {/* User Menu */}
        {isLoggedIn ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="Profile" />
              </div>
            </div>
            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
              <li><a href="/profile">Profile</a></li>
              <li><a href="/cart">Cart</a></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <a href="/login" className="btn btn-primary btn-sm">Login</a>
            <a href="/register" className="btn btn-outline btn-sm">Sign Up</a>
          </div>
        )}
      </div>
    </div>
  );
}

export default ModernNavBar;
