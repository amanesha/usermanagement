import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector } from 'react-redux';
import store from './redux/store';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import UserRoute from './components/UserRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import UserList from './pages/UserList';
import UserForm from './pages/UserForm';
import UserProfile from './pages/UserProfile';
import AdminList from './pages/AdminList';
import PositionManagement from './pages/PositionManagement';
import ChangePassword from './pages/ChangePassword';

const RootRedirect = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === 'admin' || user?.is_staff) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/user/dashboard" replace />;
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Root redirect based on role */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <RootRedirect />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <AdminRoute>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="users" element={<UserList />} />
                    <Route path="users/add" element={<UserForm mode="add" />} />
                    <Route path="users/edit/:id" element={<UserForm mode="edit" />} />
                    <Route path="users/:id" element={<UserProfile />} />
                    <Route path="admins" element={<AdminList />} />
                    <Route path="positions" element={<PositionManagement />} />
                    <Route path="change-password" element={<ChangePassword />} />
                  </Routes>
                </Layout>
              </AdminRoute>
            }
          />

          {/* User Routes */}
          <Route
            path="/user/*"
            element={
              <UserRoute>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<UserDashboard />} />
                    <Route path="change-password" element={<ChangePassword />} />
                  </Routes>
                </Layout>
              </UserRoute>
            }
          />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
