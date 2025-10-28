import { useState, useEffect } from 'react';
import { Briefcase, Users, Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { positionsAPI, usersAPI } from '../services/api';

const PositionManagement = () => {
  const [positions, setPositions] = useState([]);
  const [positionStats, setPositionStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchPositions();
    fetchUserStats();
  }, []);

  const fetchPositions = async () => {
    try {
      const response = await positionsAPI.getAll();
      setPositions(response.data);
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await usersAPI.getAll();
      const users = response.data.results || response.data;

      // Count users by position
      const stats = {};
      users.forEach((user) => {
        if (user.position) {
          stats[user.position] = (stats[user.position] || 0) + 1;
        }
      });

      setPositionStats(stats);
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (position = null) => {
    if (position) {
      setEditingPosition(position);
      setFormData({
        title: position.title,
        description: position.description || '',
      });
    } else {
      setEditingPosition(null);
      setFormData({ title: '', description: '' });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPosition(null);
    setFormData({ title: '', description: '' });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingPosition) {
        await positionsAPI.update(editingPosition.id, formData);
        setSuccess('Position updated successfully');
      } else {
        await positionsAPI.create(formData);
        setSuccess('Position created successfully');
      }

      handleCloseModal();
      fetchPositions();
      setTimeout(() => fetchUserStats(), 500);
    } catch (error) {
      setError(error.response?.data?.title?.[0] || error.response?.data?.detail || 'Failed to save position');
    }
  };

  const handleDelete = async (positionId) => {
    if (!window.confirm('Are you sure you want to delete this position?')) return;

    try {
      await positionsAPI.delete(positionId);
      setSuccess('Position deleted successfully');
      fetchPositions();
      setTimeout(() => fetchUserStats(), 500);
    } catch (error) {
      setError('Failed to delete position');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Position Management</h1>
            <p className="text-orange-100 text-lg">Manage all positions and user distribution</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-medium hover:bg-orange-50 transition-colors shadow-lg"
          >
            <Plus size={20} />
            Add Position
          </button>
        </div>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button onClick={() => setError('')} className="text-red-400 hover:text-red-600">
            <X size={20} />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <Briefcase className="text-green-600 flex-shrink-0" size={20} />
          <div className="flex-1">
            <p className="text-green-800 font-medium">Success</p>
            <p className="text-green-600 text-sm">{success}</p>
          </div>
          <button onClick={() => setSuccess('')} className="text-green-400 hover:text-green-600">
            <X size={20} />
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Total Positions</p>
              <p className="text-4xl font-bold text-gray-900">{positions.length}</p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <Briefcase className="text-white" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Total Users</p>
              <p className="text-4xl font-bold text-gray-900">
                {Object.values(positionStats).reduce((a, b) => a + b, 0)}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <Users className="text-white" size={28} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Average per Position</p>
              <p className="text-4xl font-bold text-gray-900">
                {positions.length > 0
                  ? Math.round(Object.values(positionStats).reduce((a, b) => a + b, 0) / positions.length)
                  : 0}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-md">
              <Users className="text-white" size={28} />
            </div>
          </div>
        </div>
      </div>

      {/* Positions List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Positions Overview</h2>
          <p className="text-sm text-gray-600 mt-1">List of all positions with user counts</p>
        </div>

        <div className="divide-y divide-gray-200">
          {positions.length > 0 ? (
            positions.map((position) => (
              <div
                key={position.id}
                className="px-6 py-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                      <Briefcase className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{position.title}</h3>
                      {position.description && (
                        <p className="text-sm text-gray-600 mt-1">{position.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">
                        {positionStats[position.title] || 0}
                      </p>
                      <p className="text-sm text-gray-500">Users</p>
                    </div>

                    <div className="w-32">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-orange-500 to-red-600 h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              ((positionStats[position.title] || 0) /
                                Math.max(...Object.values(positionStats), 1)) *
                              100
                            }%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 text-right">
                        {Math.round(
                          ((positionStats[position.title] || 0) /
                            Math.max(...Object.values(positionStats), 1)) *
                            100
                        )}
                        % of max
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenModal(position)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Position"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(position.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Position"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Briefcase className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 text-lg">No positions found</p>
              <p className="text-gray-500 text-sm mt-2">
                Click "Add Position" to create your first position
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingPosition ? 'Edit Position' : 'Add New Position'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter position description..."
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-colors"
                >
                  {editingPosition ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionManagement;
