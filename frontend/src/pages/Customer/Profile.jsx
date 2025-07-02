import { useState, useEffect } from 'react';
import { Save, X, Edit2 } from 'lucide-react';
import Footer from '../../components/Footer';
import customerService from '../../services/customerservice';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // 🌀 New
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [originalData, setOriginalData] = useState({ ...formData });

  // 🌀 Fetch user on mount
useEffect(() => {
  const fetchUser = async () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token'); // 👈 Get token from storage

      if (!userStr || !token) return;

      const user = JSON.parse(userStr);
      const userData = await customerService.getUserById(user._id || user.id, token); // 👈 Pass token
      if (userData && userData._id) {
        setFormData(userData);
        setOriginalData(userData);
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({ ...formData });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({ ...originalData });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;
      const user = JSON.parse(userStr);

      await customerService.updateUser(user.id, formData);
      setIsEditing(false);
      setOriginalData({ ...formData });
     
    } catch (error) {
      console.error('Update failed:', error);
      alert('Something went wrong while updating profile.');
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-lg text-gray-500 animate-pulse">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="poppins-regular ">
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">Personal Information</h1>
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 lg:px-4 py-2 rounded-md transition-colors"
            >
              <Edit2 size={16} />
              <span>Edit</span>
            </button>
          )}
        </div>

        <div className="bg-white p-6 border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: 'First Name', name: 'firstName' },
                { label: 'Last Name', name: 'lastName' },
                { label: 'Email Address', name: 'email', type: 'email' },
                { label: 'Phone Number', name: 'phone', type: 'tel' },
              ].map(({ label, name, type = 'text' }) => (
                <div key={name} className="flex flex-col">
                  <label htmlFor={name} className="text-sm font-medium text-gray-600 mb-1">
                    {label}
                  </label>
                  {isEditing ? (
                    <input
                      type={type}
                      id={name}
                      name={name}
                      value={formData[name]}
                      onChange={handleInputChange}
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  ) : (
                    <p className="text-gray-800 py-2">{formData[name]}</p>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save size={16} />
                  <span>Save Changes</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
