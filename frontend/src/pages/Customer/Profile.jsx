import { useState } from 'react';
import { Save, X, Edit2 } from 'lucide-react';
import Footer from '../../components/Footer';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Kasavu',
    lastName: 'Aalayam',
    email: 'kasavuaalayalam@gmail.com',
    phone: '+1 (555) 123-4567',
  });
  
  const [originalData, setOriginalData] = useState({...formData});
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleEdit = () => {
    setIsEditing(true);
    setOriginalData({...formData});
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setFormData({...originalData});
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the updated data to your backend
    setIsEditing(false);
    setOriginalData({...formData});
    // Show success message
    alert('Profile updated successfully!');
  };
  
  return (
    <div className="poppins-regular">
     <div>
     <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-semibold text-gray-800">Personal Information</h1>
        {!isEditing ? (
          <button 
            onClick={handleEdit}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md transition-colors"
          >
            <Edit2 size={16} />
            <span>Edit</span>
          </button>
        ) : null}
      </div>
      
      <div className="bg-white  p-6 border border-gray-100">
        <form onSubmit={handleSubmit}>
          <div className="grid md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="flex flex-col">
              <label htmlFor="firstName" className="text-sm font-medium text-gray-600 mb-1">
                First Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              ) : (
                <p className="text-gray-800 py-2">{formData.firstName}</p>
              )}
            </div>
            
            {/* Last Name */}
            <div className="flex flex-col">
              <label htmlFor="lastName" className="text-sm font-medium text-gray-600 mb-1">
                Last Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              ) : (
                <p className="text-gray-800 py-2">{formData.lastName}</p>
              )}
            </div>
            
            {/* Email */}
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium text-gray-600 mb-1">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              ) : (
                <p className="text-gray-800 py-2">{formData.email}</p>
              )}
            </div>
            
            {/* Phone */}
            <div className="flex flex-col">
              <label htmlFor="phone" className="text-sm font-medium text-gray-600 mb-1">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-800 py-2">{formData.phone}</p>
              )}
            </div>
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