import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminPanelPage: React.FC = () => {
  const { isAdmin } = useAuth();
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">⚙️ Admin Panel</h1>
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-5xl mb-4">🔧</p>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Admin Dashboard</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Add your admin-specific components and functionality here.
          <br />
          Only users with <code className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-xs">ROLE_ADMIN</code> can access this page.
        </p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {['Manage Users', 'Manage Products', 'View All Reports', 'System Settings', 'Audit Logs', 'Notifications'].map((item) => (
            <div key={item} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:border-primary-300 dark:hover:border-primary-700 cursor-pointer transition">
              {item}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdminPanelPage;
