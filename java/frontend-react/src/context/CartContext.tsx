import React, { createContext, useContext, useEffect, useState } from 'react';
import { Entity } from '../api/entityApi';

export interface CartItem { entity: Entity; quantity: number }

interface CartContextType {
  items: CartItem[];
  addToCart: (e: Entity) => void;
  removeFromCart: (code: string) => void;
  updateQty: (code: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  grandTotal: number;
}

const CART_KEY = 'cart';
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (entity: Entity) =>
    setItems((prev) => {
      const found = prev.find((i) => i.entity.code === entity.code);
      if (found) return prev.map((i) => i.entity.code === entity.code ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { entity, quantity: 1 }];
    });

  const removeFromCart = (code: string) =>
    setItems((prev) => prev.filter((i) => i.entity.code !== code));

  const updateQty = (code: string, qty: number) => {
    if (qty <= 0) { removeFromCart(code); return; }
    setItems((prev) => prev.map((i) => i.entity.code === code ? { ...i, quantity: qty } : i));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const grandTotal = items.reduce((s, i) => s + i.entity.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart, totalItems, grandTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
