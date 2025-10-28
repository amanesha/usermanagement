import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Building2, FileText } from 'lucide-react';
import { fetchStatistics } from '../redux/userSlice';

const InfoCard = ({ icon: Icon, label, value, gradient }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-5 border border-gray-100">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center shadow-md`}>
        <Icon className="text-white" size={22} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value || 'N/A'}</p>
      </div>
    </div>
  </div>
);

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { statistics } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchStatistics());
  }, [dispatch]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shadow-xl">
            <User size={48} className="text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome, {user?.username}!</h1>
            <p className="text-green-100 text-lg">View your profile and team information</p>
          </div>
        </div>
      </div>

      {/* User Profile Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Your Profile</h2>
          <p className="text-gray-600 mt-1">Your account information</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InfoCard
            icon={User}
            label="Username"
            value={user?.username}
            gradient="from-blue-500 to-blue-600"
          />
          <InfoCard
            icon={Mail}
            label="Email"
            value={user?.email}
            gradient="from-purple-500 to-purple-600"
          />
          <InfoCard
            icon={Briefcase}
            label="Role"
            value={user?.role === 'admin' ? 'Administrator' : 'User'}
            gradient="from-green-500 to-emerald-600"
          />
        </div>
      </div>

      {/* Team Statistics Section */}
      <div>
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Team Overview</h2>
          <p className="text-gray-600 mt-1">View your team statistics</p>
        </div>

        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <User size={26} className="text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{statistics.total_users}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                  <User size={26} className="text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">{statistics.active_users}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center shadow-md">
                  <User size={26} className="text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">Inactive Users</p>
              <p className="text-3xl font-bold text-gray-900">{statistics.inactive_users}</p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
                  <User size={26} className="text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">On Leave</p>
              <p className="text-3xl font-bold text-gray-900">{statistics.on_leave_users}</p>
            </div>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <FileText className="text-white" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Limited Access</h3>
            <p className="text-gray-600">
              You have view-only access to the system. You can view team statistics but cannot add, edit, or delete users.
              Contact your administrator if you need additional permissions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
