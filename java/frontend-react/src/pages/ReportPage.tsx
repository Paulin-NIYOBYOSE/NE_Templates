import React, { useEffect, useState } from 'react';
import { getReport, TransactionReport } from '../api/transactionApi';
import { PageResponse } from '../api/productApi';
import Pagination from '../components/Pagination';

/**
 * Report page – displays transaction report with date filters and pagination.
 * RENAME: Update column headers to match your exam's report format.
 */
const ReportPage: React.FC = () => {
  const [data, setData] = useState<PageResponse<TransactionReport> | null>(null);
  const [page, setPage] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchReport = () => {
    setLoading(true);
    const sd = startDate ? `${startDate}T00:00:00` : undefined;
    const ed = endDate ? `${endDate}T23:59:59` : undefined;
    getReport(page, 10, sd, ed)
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to load report:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReport();
  }, [page]);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    fetchReport();
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>Transaction Report</h2>
      </div>

      <form className="filters" onSubmit={handleFilter}>
        <div className="form-group">
          <label>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="form-group">
          <label>End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: 'auto' }}>
          Filter
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : !data || data.content.length === 0 ? (
        <div className="empty-state"><p>No transactions found.</p></div>
      ) : (
        <>
          <table className="report-table">
            <thead>
              <tr>
                {/* RENAME: Update column headers to match exam report format */}
                <th>No</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Product Code</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.content.map((tx, index) => (
                <tr key={tx.transactionId}>
                  <td>{page * 10 + index + 1}</td>
                  <td>{tx.customerName}</td>
                  <td>{new Date(tx.date).toLocaleString()}</td>
                  <td>{tx.productCode}</td>
                  <td>{tx.productName}</td>
                  <td>{tx.quantity}</td>
                  <td>${tx.unitPrice.toFixed(2)}</td>
                  <td>${tx.total.toFixed(2)}</td>
                  <td>{tx.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
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

export default ReportPage;
