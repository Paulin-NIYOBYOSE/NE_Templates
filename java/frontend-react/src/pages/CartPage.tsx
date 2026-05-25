import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';
import { checkout, sendConfirmationEmail } from '../api/transactionApi';
import appConfig from '../config/appConfig';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQty, clearCart, grandTotal } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const fmt = (n: number) =>
    `${appConfig.currency}${n.toLocaleString(appConfig.locale, { minimumFractionDigits: 2 })}`;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const payload = items.map((i) => ({ productCode: i.entity.code, quantity: i.quantity }));
      await checkout(payload);
      if (appConfig.features.emailAfterCheckout) {
        try { await sendConfirmationEmail({ items: payload, total: grandTotal }); } catch { /* silent */ }
      }
      clearCart();
      toast.success('Checkout successful! 🎉');
      navigate('/report');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? 'Checkout failed');
    } finally { setLoading(false); }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        🛒 {appConfig.labels.cartTitle}
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🛒</p>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Your cart is empty.</p>
          <button onClick={() => navigate('/')} className="mt-4 px-5 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-medium transition text-sm">
            Browse {appConfig.entity.plural}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Items */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {items.map((item, idx) => (
              <div key={item.entity.code}
                className={`flex items-center gap-4 px-5 py-4 ${idx < items.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{item.entity.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.entity.code} · {fmt(item.entity.price)} each</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.entity.code, item.quantity - 1)}
                    className="h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold transition flex items-center justify-center text-lg leading-none">−</button>
                  <span className="w-8 text-center font-semibold text-gray-800 dark:text-gray-200 text-sm">{item.quantity}</span>
                  <button onClick={() => updateQty(item.entity.code, item.quantity + 1)}
                    className="h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 font-bold transition flex items-center justify-center text-lg leading-none">+</button>
                </div>
                <p className="w-24 text-right font-bold text-primary-600 dark:text-primary-400 text-sm">
                  {fmt(item.entity.price * item.quantity)}
                </p>
                <button onClick={() => removeFromCart(item.entity.code)}
                  className="text-red-400 hover:text-red-600 transition ml-1 text-lg">✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Grand Total</span>
              <span className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(grandTotal)}</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { clearCart(); toast('Cart cleared'); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium transition">
                Clear Cart
              </button>
              <button onClick={handleCheckout} disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white font-semibold text-sm transition">
                {loading ? 'Processing…' : appConfig.labels.checkoutBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CartPage;
