import React, { useEffect, useState } from 'react';
import { getProducts, Product, PageResponse } from '../api/productApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';

/**
 * Dashboard – displays paginated list of core entities (products/parkings/equipment).
 * RENAME: Update labels ("Products" → "Parking Lots", "Add to Cart" → "Book", etc.)
 */
const DashboardPage: React.FC = () => {
  const [data, setData] = useState<PageResponse<Product> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    setLoading(true);
    getProducts(page, 9)
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to load products:', err))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="container">
      <div className="page-header">
        {/* RENAME: "Products" → your entity name */}
        <h2>Products</h2>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : !data || data.content.length === 0 ? (
        <div className="empty-state"><p>No products found.</p></div>
      ) : (
        <>
          <div className="product-grid">
            {data.content.map((product) => (
              <div key={product.id} className="product-card">
                <p className="code">{product.code}</p>
                <h3>{product.name}</h3>
                {product.type && <span className="type">{product.type}</span>}
                {/* RENAME: "Price" → "Hourly Fee", "Rental Price", etc. */}
                <p className="price">${product.price.toFixed(2)}</p>
                {product.inDate && <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Added: {product.inDate}</p>}
                {isAuthenticated && (
                  <button
                    className="btn btn-success"
                    onClick={() => addToCart(product)}
                  >
                    {/* RENAME: "Add to Cart" → "Book", "Assign", "Rent" */}
                    Add to Cart
                  </button>
                )}
              </div>
            ))}
          </div>
          <Pagination
            currentPage={data.number}
            totalPages={data.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default DashboardPage;
