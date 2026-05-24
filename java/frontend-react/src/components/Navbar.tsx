import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

/**
 * Navigation bar – RENAME labels to match exam.
 * e.g., "Products" → "Parking Lots", "Cart" → "Bookings"
 */
const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <header className="navbar">
      <h1><Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Exam Template</Link></h1>
      <nav>
        <Link to="/">Dashboard</Link>
        {isAuthenticated && (
          <>
            <Link to="/cart">
              Cart {totalItems > 0 && <span className="badge">{totalItems}</span>}
            </Link>
            <Link to="/report">Report</Link>
          </>
        )}
        {isAuthenticated ? (
          <>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{user?.fullName}</span>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
