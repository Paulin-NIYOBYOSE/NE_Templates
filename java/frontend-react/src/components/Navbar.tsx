import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import appConfig from '../config/appConfig';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalItems } = useCart();
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-primary-400' : 'text-gray-300 hover:text-white'}`;

  return (
    <nav className="sticky top-0 z-50 bg-gray-900 dark:bg-gray-950 border-b border-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl">{appConfig.entity.icon}</span>
            <span className="font-bold text-white text-lg">{appConfig.appName}</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={linkClass}>{appConfig.entity.plural}</NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/cart" className={linkClass}>
                  {appConfig.labels.cartTitle}
                  {totalItems > 0 && (
                    <span className="ml-1.5 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-600 text-white text-xs font-bold">
                      {totalItems}
                    </span>
                  )}
                </NavLink>
                <NavLink to="/report" className={linkClass}>Report</NavLink>
                {appConfig.features.profilePage && <NavLink to="/profile" className={linkClass}>Profile</NavLink>}
                {isAdmin && appConfig.features.adminPanel && (
                  <NavLink to="/admin" className={linkClass}>{appConfig.labels.adminLink}</NavLink>
                )}
              </>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {appConfig.features.darkMode && (
              <button onClick={toggle} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition">
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-white font-medium">{user?.fullName}</p>
                  <p className="text-xs text-gray-400">{user?.role?.replace('ROLE_', '')}</p>
                </div>
                <button onClick={logout} className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition">
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-1.5 rounded-lg text-gray-300 hover:text-white text-sm font-medium transition">Login</Link>
                <Link to="/signup" className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition">Sign Up</Link>
              </div>
            )}
          </div>

          {/* Mobile burger */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
            <div className="w-5 space-y-1">
              <span className="block h-0.5 bg-current" />
              <span className="block h-0.5 bg-current" />
              <span className="block h-0.5 bg-current" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-3 space-y-2">
          <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>{appConfig.entity.plural}</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/cart" className={linkClass} onClick={() => setMenuOpen(false)}>Cart ({totalItems})</NavLink>
              <NavLink to="/report" className={linkClass} onClick={() => setMenuOpen(false)}>Report</NavLink>
              {appConfig.features.profilePage && <NavLink to="/profile" className={linkClass} onClick={() => setMenuOpen(false)}>Profile</NavLink>}
              {isAdmin && appConfig.features.adminPanel && <NavLink to="/admin" className={linkClass} onClick={() => setMenuOpen(false)}>Admin</NavLink>}
              <button onClick={() => { logout(); setMenuOpen(false); }} className="block w-full text-left text-sm text-red-400 hover:text-red-300 py-1">Logout</button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <NavLink to="/login" className={linkClass} onClick={() => setMenuOpen(false)}>Login</NavLink>
              <NavLink to="/signup" className={linkClass} onClick={() => setMenuOpen(false)}>Sign Up</NavLink>
            </>
          )}
          {appConfig.features.darkMode && (
            <button onClick={toggle} className="text-sm text-gray-400 hover:text-white py-1">
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
