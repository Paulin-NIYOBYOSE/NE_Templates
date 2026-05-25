import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getEntities, Entity, PageResponse } from '../api/entityApi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import appConfig from '../config/appConfig';

const badgeColors: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  A: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
  B: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  C: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
};

const cellValue = (entity: Entity, col: { key: string; type: string }) => {
  const val = entity[col.key];
  if (val == null) return '—';
  if (col.type === 'currency') return `${appConfig.currency}${Number(val).toLocaleString(appConfig.locale, { minimumFractionDigits: 2 })}`;
  if (col.type === 'date') return new Date(val as string).toLocaleDateString(appConfig.locale);
  if (col.type === 'badge') {
    const s = String(val);
    const cls = badgeColors[s] ?? badgeColors.default;
    return <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${cls}`}>{s}</span>;
  }
  return String(val);
};

const DashboardPage: React.FC = () => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<PageResponse<Entity> | null>(null);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true); setError('');
    getEntities(page)
      .then((r) => setData(r.data))
      .catch(() => setError('Failed to load data. Make sure the backend is running.'))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <span className="text-4xl">{appConfig.entity.icon}</span>
          {appConfig.entity.plural}
        </h1>
        {data && (
          <p className="mt-1 text-gray-500 dark:text-gray-400 text-sm">
            {data.totalElements} {data.totalElements === 1 ? appConfig.entity.singular : appConfig.entity.plural} found
          </p>
        )}
      </div>

      {loading && <LoadingSpinner text={`Loading ${appConfig.entity.plural.toLowerCase()}…`} />}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && data && (
        <>
          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    {appConfig.columns.map((col) => (
                      <th key={col.key} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {col.label}
                      </th>
                    ))}
                    {isAuthenticated && <th className="px-5 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {data.content.map((entity) => (
                    <tr key={entity.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                      {appConfig.columns.map((col) => (
                        <td key={col.key} className="px-5 py-4 text-gray-800 dark:text-gray-200">
                          {cellValue(entity, col)}
                        </td>
                      ))}
                      {isAuthenticated && (
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => { addToCart(entity); toast.success(`Added to ${appConfig.labels.cartTitle}`); }}
                            className="px-3 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold transition"
                          >
                            {appConfig.labels.cartAction}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                  {data.content.length === 0 && (
                    <tr>
                      <td colSpan={appConfig.columns.length + 1} className="text-center py-12 text-gray-400 dark:text-gray-500">
                        No {appConfig.entity.plural.toLowerCase()} found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </main>
  );
};

export default DashboardPage;
