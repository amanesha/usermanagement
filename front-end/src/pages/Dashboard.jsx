import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, UserCheck, UserX, Clock, Briefcase, TrendingUp, ArrowUpRight } from 'lucide-react';
import { fetchStatistics } from '../redux/userSlice';
import { fetchDepartmentStats } from '../redux/departmentSlice';

const StatCard = ({ title, value, icon: Icon, color, gradient }) => (
  <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 overflow-hidden border border-gray-100 hover:border-transparent hover:-translate-y-1">
    {/* Gradient Background */}
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

    {/* Content */}
    <div className="relative flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">{title}</p>
        <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
        <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
          <TrendingUp size={16} />
          <span>Active</span>
        </div>
      </div>

      {/* Icon with gradient */}
      <div className={`relative w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
        <Icon size={28} className="text-white" />
      </div>
    </div>

    {/* Decorative circle */}
    <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500`}></div>
  </div>
);

const DepartmentCard = ({ department }) => (
  <div className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 hover:-translate-y-1">
    {/* Header */}
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
          <Briefcase className="text-white" size={22} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800">{department.name}</h3>
          <p className="text-xs text-gray-500">Department Overview</p>
        </div>
      </div>
      <ArrowUpRight className="text-gray-400 group-hover:text-blue-600 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" size={20} />
    </div>

    {/* Stats Grid */}
    <div className="space-y-3">
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
        <span className="text-sm font-medium text-gray-600">Total Users</span>
        <span className="text-lg font-bold text-gray-900">{department.total_users}</span>
      </div>
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
        <span className="text-sm font-medium text-green-700">Active</span>
        <span className="text-lg font-bold text-green-700">{department.active_users}</span>
      </div>
      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
        <span className="text-sm font-medium text-red-700">Inactive</span>
        <span className="text-lg font-bold text-red-700">{department.inactive_users}</span>
      </div>
      <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
        <span className="text-sm font-medium text-yellow-700">On Leave</span>
        <span className="text-lg font-bold text-yellow-700">{department.on_leave_users}</span>
      </div>
    </div>

    {/* Progress Bar */}
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
        <span>Activity Rate</span>
        <span>{department.total_users > 0 ? Math.round((department.active_users / department.total_users) * 100) : 0}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${department.total_users > 0 ? (department.active_users / department.total_users) * 100 : 0}%` }}
        ></div>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const dispatch = useDispatch();
  const { statistics, loading } = useSelector((state) => state.users);
  const { stats: departmentStats } = useSelector((state) => state.departments);

  useEffect(() => {
    dispatch(fetchStatistics());
    dispatch(fetchDepartmentStats());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-ping rounded-full h-8 w-8 bg-blue-400 opacity-75"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-blue-100 text-lg">Welcome back! Here's what's happening with your team today.</p>
      </div>

      {/* Stats Grid */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Users"
            value={statistics.total_users}
            icon={Users}
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Active Users"
            value={statistics.active_users}
            icon={UserCheck}
            gradient="from-green-500 to-emerald-600"
          />
          <StatCard
            title="Inactive Users"
            value={statistics.inactive_users}
            icon={UserX}
            gradient="from-red-500 to-rose-600"
          />
          <StatCard
            title="On Leave"
            value={statistics.on_leave_users}
            icon={Clock}
            gradient="from-yellow-500 to-orange-600"
          />
        </div>
      )}

      {/* Department Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Department Analytics</h2>
            <p className="text-gray-600 mt-1">Detailed breakdown of users by department</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departmentStats.map((dept) => (
            <DepartmentCard key={dept.id} department={dept} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
