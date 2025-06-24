import React, { useState } from 'react';
import { Phone, Mail, MapPin, Save, CheckCircle, AlertTriangle, Building } from 'lucide-react';

// Mock service for demo
const websiteSettingService = {
  updateContactInfo: async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    return data;
  }
};

const ContactInfoForm = ({ contact = {} }) => {
  const [formData, setFormData] = useState({
    phone: contact.phone || '',
    email: contact.email || '',
    location: contact.location || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Office location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await websiteSettingService.updateContactInfo(formData);
      setNotification({
        show: true,
        message: 'Contact information has been updated successfully',
        type: 'success'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 6000);
    } catch (err) {
      console.error('Error updating contact info:', err);
      setNotification({
        show: true,
        message: 'Unable to update contact information. Please try again.',
        type: 'error'
      });
      setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-red-50 py-8 px-4 sm:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-lg mb-4 shadow-sm">
            <Building className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-red-900 mb-2">
            Business Contact Information
          </h1>
          <p className="text-red-600 text-sm leading-relaxed max-w-md mx-auto">
            Manage your business contact details to ensure customers can reach you easily
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-red-200 overflow-hidden">
          {/* Form Header */}
          <div className="px-6 py-4 border-b border-red-100 bg-red-50">
            <h2 className="text-lg font-medium text-red-900">Contact Details</h2>
            <p className="text-sm text-red-500 mt-1">Update your contact information below</p>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2 text-red-500" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g., +1 (555) 123-4567"
                  className={`w-full px-3 py-2 border rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.phone
                      ? 'border-red-300 bg-red-50 focus:ring-red-500'
                      : 'border-red-300 focus:border-red-500 hover:border-red-400'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2 text-red-500" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., contact@yourcompany.com"
                  className={`w-full px-3 py-2 border rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    errors.email
                      ? 'border-red-300 bg-red-50 focus:ring-red-500'
                      : 'border-red-300 focus:border-red-500 hover:border-red-400'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Office Location */}
              <div>
                <label className="block text-sm font-medium text-red-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2 text-red-500" />
                  Office Location
                </label>
                <textarea
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter your complete business address..."
                  className={`w-full px-3 py-2 border rounded-md text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-vertical ${
                    errors.location
                      ? 'border-red-300 bg-red-50 focus:ring-red-500'
                      : 'border-red-300 focus:border-red-500 hover:border-red-400'
                  }`}
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Form Footer */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm font-medium">?</span>
              </div>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-900">Contact Information Tips</h3>
              <div className="mt-1 text-sm text-red-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>Use a dedicated business phone number for professional communication</li>
                  <li>Ensure your email address is monitored regularly for customer inquiries</li>
                  <li>Include complete address details for accurate location services</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {notification.show && (
          <div className="fixed top-4 right-4 max-w-sm w-full z-50">
            <div className={`rounded-lg shadow-lg border p-4 ${
              notification.type === 'success'
                ? 'bg-green-50 border-green-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {notification.type === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${
                    notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {notification.type === 'success' ? 'Success' : 'Error'}
                  </p>
                  <p className={`text-sm mt-1 ${
                    notification.type === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {notification.message}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <button
                    onClick={() => setNotification({ show: false, message: '', type: 'success' })}
                    className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      notification.type === 'success'
                        ? 'text-green-500 hover:bg-green-100 focus:ring-green-600'
                        : 'text-red-500 hover:bg-red-100 focus:ring-red-600'
                    }`}
                  >
                    <span className="sr-only">Dismiss</span>
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactInfoForm;
