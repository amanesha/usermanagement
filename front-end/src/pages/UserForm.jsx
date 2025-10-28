import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, User, MapPin, Briefcase, FileText } from 'lucide-react';
import { createUser, updateUser, fetchUserById, clearCurrentUser } from '../redux/userSlice';
import { fetchDepartments } from '../redux/departmentSlice';

const UserForm = ({ mode = 'add' }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state) => state.users);
  const { departments } = useSelector((state) => state.departments);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'O',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    department: '',
    position: '',
    employee_id: '',
    hire_date: '',
    salary: '',
    status: 'active',
    bio: ''
  });

  useEffect(() => {
    dispatch(fetchDepartments());
    if (mode === 'edit' && id) {
      dispatch(fetchUserById(id));
    }
    return () => dispatch(clearCurrentUser());
  }, [dispatch, mode, id]);

  useEffect(() => {
    if (mode === 'edit' && currentUser) {
      setFormData({
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        date_of_birth: currentUser.date_of_birth || '',
        gender: currentUser.gender || 'O',
        address: currentUser.address || '',
        city: currentUser.city || '',
        state: currentUser.state || '',
        country: currentUser.country || '',
        postal_code: currentUser.postal_code || '',
        department: currentUser.department || '',
        position: currentUser.position || '',
        employee_id: currentUser.employee_id || '',
        hire_date: currentUser.hire_date || '',
        salary: currentUser.salary || '',
        status: currentUser.status || 'active',
        bio: currentUser.bio || ''
      });
    }
  }, [currentUser, mode]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedData = { ...formData };

    Object.keys(cleanedData).forEach(key => {
      if (cleanedData[key] === '' && !['department', 'salary'].includes(key)) {
        delete cleanedData[key];
      }
    });

    if (cleanedData.department === '') cleanedData.department = null;
    if (cleanedData.salary === '') cleanedData.salary = null;

    try {
      if (mode === 'edit') {
        await dispatch(updateUser({ id, data: cleanedData })).unwrap();
      } else {
        await dispatch(createUser(cleanedData)).unwrap();
      }
      navigate('/users');
    } catch (err) {
      console.error('Failed:', err);
    }
  };

  if (loading && mode === 'edit' && !currentUser) {
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

  const inputClass = "w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none";
  const labelClass = "block text-sm font-semibold text-gray-700 mb-2";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <h1 className="text-3xl font-bold">
          {mode === 'edit' ? 'Edit User Profile' : 'Add New User'}
        </h1>
        <p className="text-blue-100 mt-2">
          {mode === 'edit' ? 'Update user information and details' : 'Fill in the information to create a new user account'}
        </p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl shadow-md">
          <p className="font-bold text-lg mb-2">⚠️ Please fix the following errors:</p>
          {typeof error === 'object' ? (
            <ul className="list-disc list-inside space-y-1">
              {Object.entries(error).map(([field, messages]) => (
                <li key={field} className="text-sm">
                  <strong className="capitalize">{field.replace('_', ' ')}:</strong>{' '}
                  {Array.isArray(messages) ? messages.join(', ') : messages}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm">{error}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <User className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
              <p className="text-sm text-gray-500">Personal details and contact information</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="John"
              />
            </div>

            <div>
              <label className={labelClass}>
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Doe"
              />
            </div>

            <div>
              <label className={labelClass}>
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <label className={labelClass}>
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="+1234567890"
              />
            </div>

            <div>
              <label className={labelClass}>Date of Birth</label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="O">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <MapPin className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Address Information</h2>
              <p className="text-sm text-gray-500">Location and contact details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Street Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className={inputClass}
                placeholder="123 Main Street, Apt 4B"
              />
            </div>

            <div>
              <label className={labelClass}>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={inputClass}
                placeholder="New York"
              />
            </div>

            <div>
              <label className={labelClass}>State/Province</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={inputClass}
                placeholder="NY"
              />
            </div>

            <div>
              <label className={labelClass}>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={inputClass}
                placeholder="United States"
              />
            </div>

            <div>
              <label className={labelClass}>Postal Code</label>
              <input
                type="text"
                name="postal_code"
                value={formData.postal_code}
                onChange={handleChange}
                className={inputClass}
                placeholder="10001"
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Briefcase className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Professional Information</h2>
              <p className="text-sm text-gray-500">Employment and role details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Select Department</option>
                {departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={inputClass}
                placeholder="Software Engineer"
              />
            </div>

            <div>
              <label className={labelClass}>Employee ID</label>
              <input
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className={inputClass}
                placeholder="EMP-001"
              />
            </div>

            <div>
              <label className={labelClass}>Hire Date</label>
              <input
                type="date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Salary</label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                step="0.01"
                className={inputClass}
                placeholder="50000.00"
              />
            </div>

            <div>
              <label className={labelClass}>Employment Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="on_leave">On Leave</option>
              </select>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-100">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <FileText className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Additional Information</h2>
              <p className="text-sm text-gray-500">Biography and notes</p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className={inputClass}
              placeholder="Brief description about the user..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {loading ? 'Saving...' : mode === 'edit' ? 'Update User' : 'Create User'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/users')}
            className="flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-xl hover:bg-gray-300 shadow-md hover:shadow-lg transition-all duration-200 font-semibold"
          >
            <X size={20} />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
