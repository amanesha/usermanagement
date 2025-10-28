import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Mail, Phone, MapPin, Briefcase, Calendar, DollarSign, Edit } from 'lucide-react';
import { fetchUserById, clearCurrentUser } from '../redux/userSlice';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(fetchUserById(id));
    return () => dispatch(clearCurrentUser());
  }, [dispatch, id]);

  if (loading || !currentUser) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  const InfoRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100">
      <Icon className="text-gray-400 mt-1" size={20} />
      <div className="flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-gray-800 font-medium">{value || "N/A"}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/users')} className="flex items-center gap-2 text-gray-600 hover:text-gray-800"><ArrowLeft size={20} />Back to Users</button>
        <button onClick={() => navigate(`/users/edit/${id}`)} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"><Edit size={20} />Edit Profile</button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-4xl font-bold text-blue-600">{currentUser.first_name[0]}{currentUser.last_name[0]}</div>
            <div>
              <h1 className="text-3xl font-bold">{currentUser.full_name}</h1>
              <p className="text-blue-100 mt-1">{currentUser.position || "Employee"} {currentUser.department_name && `at ${currentUser.department_name}`}</p>
              <div className="mt-2"><span className={`px-3 py-1 rounded-full text-sm font-medium ${currentUser.status === 'active' ? 'bg-green-500' : currentUser.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'}`}>{currentUser.status.replace('_', ' ').toUpperCase()}</span></div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-2">
              <InfoRow icon={Mail} label="Email" value={currentUser.email} />
              <InfoRow icon={Phone} label="Phone" value={currentUser.phone} />
              <InfoRow icon={MapPin} label="Address" value={currentUser.address ? `${currentUser.address}, ${currentUser.city}, ${currentUser.state}, ${currentUser.country} ${currentUser.postal_code}` : null} />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Professional Information</h2>
            <div className="space-y-2">
              <InfoRow icon={Briefcase} label="Department" value={currentUser.department_name} />
              <InfoRow icon={Briefcase} label="Position" value={currentUser.position} />
              <InfoRow icon={Briefcase} label="Employee ID" value={currentUser.employee_id} />
              <InfoRow icon={Calendar} label="Hire Date" value={currentUser.hire_date} />
              <InfoRow icon={DollarSign} label="Salary" value={currentUser.salary ? `$${parseFloat(currentUser.salary).toLocaleString()}` : null} />
            </div>
          </div>

          {currentUser.bio && (
            <div>
              <h2 className="text-xl font-semibold mb-2">Bio</h2>
              <p className="text-gray-700">{currentUser.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
