import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getReport, TransactionReport } from '../api/transactionApi';
import { PageResponse } from '../api/entityApi';
import LoadingSpinner from '../components/LoadingSpinner';
import Pagination from '../components/Pagination';
import appConfig from '../config/appConfig';

const fmt = (n: number) =>
  `${appConfig.currency}${n.toLocaleString(appConfig.locale, { minimumFractionDigits: 2 })}`;

const exportCSV = (rows: TransactionReport[]) => {
  const headers = ['ID', 'Customer', 'Date', 'Product Code', 'Product', 'Qty', 'Unit Price', 'Total', 'Status'];
  const lines = rows.map((r) =>
    [r.transactionId, r.customerName, r.date, r.productCode, r.productName, r.quantity, r.unitPrice, r.total, r.status].join(',')
  );
  const blob = new Blob([[headers.join(','), ...lines].join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'report.csv'; a.click();
  URL.revokeObjectURL(url);
};

const ReportPage: React.FC = () => {
  const [data, setData] = useState<PageResponse<TransactionReport> | null>(null);
  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(true);

  const load = (p = 0) => {
    setLoading(true);
    getReport(p, 10, startDate || undefined, endDate || undefined)
      .then((r) => { setData(r.data); setPage(p); })
      .catch(() => toast.error('Failed to load report'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      COMPLETED: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
      PENDING:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
      CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    };
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${map[s] ?? map.PENDING}`}>{s}</span>;
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📊 {appConfig.labels.reportTitle}</h1>
        {appConfig.features.csvExport && data && data.content.length > 0 && (
          <button onClick={() => exportCSV(data.content)}
            className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition">
            ⬇ Export CSV
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">From</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">To</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button onClick={() => load(0)} className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition">
            Filter
          </button>
          <button onClick={() => { setStartDate(''); setEndDate(''); load(0); }}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition">
            Reset
          </button>
        </div>
      </div>

      {loading && <LoadingSpinner text="Loading report…" />}

      {!loading && data && (
        <>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700">
                    {['#', 'Customer', 'Date', 'Product', 'Qty', 'Unit Price', 'Total', 'Status'].map((h) => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {data.content.map((row) => (
                    <tr key={row.transactionId} className="hover:bg-gray-50 dark:hover:bg-gray-700/40 transition-colors">
                      <td className="px-4 py-3.5 text-gray-500 dark:text-gray-400">{row.transactionId}</td>
                      <td className="px-4 py-3.5 text-gray-800 dark:text-gray-200 font-medium">{row.customerName}</td>
                      <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400">{new Date(row.date).toLocaleDateString(appConfig.locale)}</td>
                      <td className="px-4 py-3.5 text-gray-800 dark:text-gray-200">{row.productName}</td>
                      <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400">{row.quantity}</td>
                      <td className="px-4 py-3.5 text-gray-600 dark:text-gray-400">{fmt(row.unitPrice)}</td>
                      <td className="px-4 py-3.5 font-bold text-primary-600 dark:text-primary-400">{fmt(row.total)}</td>
                      <td className="px-4 py-3.5">{statusBadge(row.status)}</td>
                    </tr>
                  ))}
                  {data.content.length === 0 && (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-400">No transactions found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={page} totalPages={data.totalPages} onChange={(p) => load(p)} />
        </>
      )}
    </main>
  );
};

export default ReportPage;
