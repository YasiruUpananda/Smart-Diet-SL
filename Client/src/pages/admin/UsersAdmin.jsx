import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminUsers, updateUserRole } from '../../store/slices/adminSlice';
import toast from 'react-hot-toast';

const UsersAdmin = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.admin);
  const { user: currentUser } = useSelector((state) => state.auth);
  const [roleChanges, setRoleChanges] = useState({});
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    dispatch(getAdminUsers());
  }, [dispatch]);

  const handleRoleChange = (userId, newRole) => {
    setRoleChanges((prev) => ({
      ...prev,
      [userId]: newRole,
    }));
  };

  const handleUpdateRole = async (userId, newRole) => {
    if (!newRole) {
      toast.error('Please select a role');
      return;
    }

    setUpdating((prev) => ({ ...prev, [userId]: true }));

    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      toast.success('User role updated successfully');
      setRoleChanges((prev) => {
        const updated = { ...prev };
        delete updated[userId];
        return updated;
      });
      // Refresh users list
      dispatch(getAdminUsers());
    } catch (error) {
      toast.error(error || 'Failed to update user role');
    } finally {
      setUpdating((prev) => ({ ...prev, [userId]: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Users</h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No users found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Registered
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => {
                  const isCurrentUser = currentUser?._id === user._id || currentUser?.id === user._id;
                  const selectedRole = roleChanges[user._id] !== undefined 
                    ? roleChanges[user._id] 
                    : user.role;
                  const hasChanges = roleChanges[user._id] !== undefined && roleChanges[user._id] !== user.role;

                  return (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-10 w-10 rounded-full mr-3"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold mr-3">
                              {user.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                          )}
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-gray-500">(You)</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.phone || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <select
                            value={selectedRole}
                            onChange={(e) => handleRoleChange(user._id, e.target.value)}
                            disabled={isCurrentUser || updating[user._id]}
                            className={`text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                              isCurrentUser 
                                ? 'bg-gray-100 cursor-not-allowed' 
                                : 'bg-white cursor-pointer'
                            } ${hasChanges ? 'border-green-500' : ''}`}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                          {hasChanges && (
                            <span className="text-xs text-green-600 font-medium">
                              Changed
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {hasChanges && !isCurrentUser && (
                          <button
                            onClick={() => handleUpdateRole(user._id, selectedRole)}
                            disabled={updating[user._id]}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                              updating[user._id]
                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                : 'bg-green-600 hover:bg-green-700 text-white'
                            }`}
                          >
                            {updating[user._id] ? 'Updating...' : 'Update Role'}
                          </button>
                        )}
                        {isCurrentUser && (
                          <span className="text-xs text-gray-500 italic">
                            Cannot change own role
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersAdmin;