import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAdminProducts,
  getAdminOrders,
  getAdminUsers,
} from '../../store/slices/adminSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { products, orders, users, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    document.title = 'Smart Diet SL-Admin';
    dispatch(getAdminProducts());
    dispatch(getAdminOrders());
    dispatch(getAdminUsers());
  }, [dispatch]);

  const stats = [
    {
      name: 'Total Products',
      value: products.length,
      icon: '📦',
      color: 'bg-blue-500',
      link: '/admin/products',
    },
    {
      name: 'Total Orders',
      value: orders.length,
      icon: '🛒',
      color: 'bg-green-500',
      link: '/admin/orders',
    },
    {
      name: 'Total Users',
      value: users.length,
      icon: '👥',
      color: 'bg-purple-500',
      link: '/admin/users',
    },
    {
      name: 'Pending Orders',
      value: orders.filter((o) => !o.isDelivered).length,
      icon: '⏳',
      color: 'bg-yellow-500',
      link: '/admin/orders',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Manage your ecommerce platform</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <Link
                key={stat.name}
                to={stat.link}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.name}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} rounded-full p-4 text-3xl`}>
                    {stat.icon}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                to="/admin/products/new"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition text-center"
              >
                ➕ Add New Product
              </Link>
              <Link
                to="/admin/orders"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition text-center"
              >
                📋 View All Orders
              </Link>
              <Link
                to="/admin/users"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition text-center"
              >
                👥 Manage Users
              </Link>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h2>
            {orders.length === 0 ? (
              <p className="text-gray-600">No orders yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order._id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.user?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          Rs. {order.totalPrice?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              order.isDelivered
                                ? 'bg-green-100 text-green-800'
                                : order.isPaid
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {order.isDelivered
                              ? 'Delivered'
                              : order.isPaid
                              ? 'Paid'
                              : 'Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;