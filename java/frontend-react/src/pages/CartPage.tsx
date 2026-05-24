import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkout } from '../api/transactionApi';

/**
 * Cart page – frontend-only state, no business logic.
 * RENAME: "Cart" → "Bookings", "Assignments", etc.
 */
const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const checkoutItems = items.map((i) => ({
        productCode: i.product.code,
        quantity: i.quantity,
      }));
      await checkout(checkoutItems);
      clearCart();
      setSuccess('Checkout successful! Your transaction has been recorded.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && !success) {
    return (
      <div className="container">
        <h2>Cart</h2>
        <div className="empty-state"><p>Your cart is empty.</p></div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Cart</h2>
      </div>

      {success && <p className="success-msg">{success}</p>}
      {error && <p className="error-msg">{error}</p>}

      {items.length > 0 && (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                {/* RENAME: column headers to match exam */}
                <th>Code</th>
                <th>Name</th>
                <th>Unit Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.product.code}>
                  <td>{item.product.code}</td>
                  <td>{item.product.name}</td>
                  <td>${item.product.price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      className="quantity-input"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.product.code, parseInt(e.target.value) || 1)}
                    />
                  </td>
                  <td>${(item.product.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => removeFromCart(item.product.code)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-total">
            Grand Total: ${items.reduce((sum, i) => sum + i.product.price * i.quantity, 0).toFixed(2)}
          </div>

          <div className="cart-actions">
            <button className="btn btn-danger" onClick={clearCart}>Clear Cart</button>
            <button className="btn btn-success" onClick={handleCheckout} disabled={loading}>
              {loading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
