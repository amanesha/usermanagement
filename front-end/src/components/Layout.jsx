import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { LayoutDashboard, Users, Building2, LogOut, User, Shield, Briefcase, Key } from 'lucide-react';
import { logout } from '../redux/authSlice';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const NavLink = ({ to, icon: Icon, children }) => {
    const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
          isActive
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50'
            : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
        }`}
      >
        <Icon size={20} className={isActive ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
        <span className="font-medium">{children}</span>
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                User Portal
              </h1>
              <p className="text-xs text-gray-400">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1">
          <div className="px-3 mb-3">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {user?.role === 'admin' ? 'Admin Menu' : 'User Menu'}
            </p>
          </div>
          {user?.role === 'admin' ? (
            <>
              <NavLink to="/admin/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
              <NavLink to="/admin/users" icon={Users}>User Management</NavLink>
              <NavLink to="/admin/admins" icon={Shield}>Admin Management</NavLink>
              <NavLink to="/admin/positions" icon={Briefcase}>Positions</NavLink>
              <NavLink to="/admin/change-password" icon={Key}>Change Password</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/user/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
              <NavLink to="/user/change-password" icon={Key}>Change Password</NavLink>
            </>
          )}
        </nav>

        {/* User Info & Logout */}
        <div className="p-6 border-t border-gray-700/50 mt-auto space-y-3">
          <div className="bg-gray-800/50 rounded-lg p-3 backdrop-blur">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                <User size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.username || 'User'}</p>
                <p className="text-xs text-gray-400 truncate">
                  {user?.role === 'admin' ? 'Administrator' : 'User'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 border border-red-500/20 hover:border-red-500/30"
            >
              <LogOut size={16} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3 backdrop-blur">
            <p className="text-xs text-gray-400">Version 1.0.0</p>
            <p className="text-xs text-gray-500 mt-1">© 2025 User Portal</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
