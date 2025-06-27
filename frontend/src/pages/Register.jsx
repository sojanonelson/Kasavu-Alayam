import React, { useState } from 'react';
import { Mail, User, Calendar, Phone, MapPin, Loader2, Eye, EyeOff, CheckSquare, ArrowLeft, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import otpService from '../services/otpService';
import { useToast } from '../components/ui/ToastContext';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    acceptTerms: false,
    firstName: '',
    lastName: '',
    age: '',
    phone: '',
    gender: '',
    address: '',
    state: '',
    city: '',
    pincode: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');

  const { showToast } = useToast();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

 const handleSubmit = async (event) => {
  event.preventDefault();
  setIsLoading(true);
  
  try {
    // First send OTP to the user's email/phone
    await otpService.SendVerificationOtp({ email: formData.email });
    setShowOtp(true); // Show OTP verification screen
  } catch (error) {
    console.error('Error sending OTP:', error);
    alert('Failed to send OTP. Please try again.');
  } finally {
    setIsLoading(false);
  }
};
  const handleAccountCreation = async (verified = false) => {
  setIsLoading(true);
  
  try {
    if (verified) {
      // Verify OTP first if user chose to verify
      const result = await otpService.verifyOtp({ 
        email: formData.email, 
        code: otp 
      });
      
      if (!result.verified) {
        alert("Invalid OTP. Please try again.");
        return;
      }
    }
    
    // Create account regardless of verification status
    const userRegister = await authService.createAccount(formData);
    if (userRegister.userId) {
       showToast("Account created", "success");
      navigate('/login');
    }
  } catch (error) {
    console.error('Account creation error:', error);
    alert('Failed to create account. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const navigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="flex justify-center items-center lg:h-[80vh] bg-white mt-10 lg:mt-0 pb-10">
      <div className="w-full max-w-md p-8 bg-white rounded-lg ">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-600">Register</h2>

        {step === 1 && (
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                <Mail className="inline-block mr-2" /> Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-6 flex items-center">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
                className="mr-2"
              />
            <p className="text-sm text-gray-600 text-center">
  By continuing, I agree to the{' '}
  <a href="#" className="text-blue-600 underline hover:text-blue-800">Terms of Use</a> &{' '}
  <a href="#" className="text-blue-600 underline hover:text-blue-800">Privacy Policy</a>.
</p>


            </div>
            <button
              type="button"
              onClick={handleNext}
              disabled={!formData.acceptTerms}
              className={`w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-bold ${!formData.acceptTerms ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
          </form>
        )}

        {step === 2 && (
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
                <User className="inline-block mr-2" /> First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
                <User className="inline-block mr-2" /> Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
                <Calendar className="inline-block mr-2" /> Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                <Phone className="inline-block mr-2" /> Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 font-bold flex items-center"
              >
                <ArrowLeft className="mr-2" /> Go Back
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 font-bold"
              >
                Next
              </button>
            </div>
          </form>
        )}

       
        {step === 3 && (
  <form onSubmit={e => {
    e.preventDefault();
    if (!showOtp) handleSubmit(e);
  }}>
    <div className="mb-4 relative">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
        <Key className="inline-block mr-2" /> Secure your account
      </label>
      <input
        type={showPassword ? 'text' : 'password'}
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute top-[49px] right-3 text-gray-600"
        tabIndex={-1}
      >
        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>

    <button
      type="submit"
      disabled={isLoading}
     
      className={`bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center justify-center font-bold ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
      {isLoading ? 'Registering...' : 'Submit'}
    </button>
  </form>
)}

{showOtp && (
  <div className="mt-6">
    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="otp">
      Enter OTP sent to {formData.email}
    </label>
    <input
      type="text"
      id="otp"
      value={otp}
      onChange={(e) => setOtp(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      placeholder="Enter 6-digit OTP"
    />
    
    <div className="flex flex-col gap-3 mt-4">
      <button
        onClick={() => handleAccountCreation(true)}
        disabled={isLoading || otp.length !== 6}
        className={`bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 font-bold w-full ${
          isLoading || otp.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isLoading ? <Loader2 className="animate-spin mr-2 inline" /> : null}
        {isLoading ? 'Verifying...' : 'Continue with Verification'}
      </button>
      
      <button
        onClick={() => handleAccountCreation(false)}
        disabled={isLoading}
        className={`bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 font-bold w-full ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Continue Without Verification
      </button>
    </div>
    
    <p className="text-sm text-gray-500 mt-3 text-center">
      Didn't receive OTP? <button 
        onClick={async () => {
          setIsLoading(true);
          try {
            await otpService.AccountVerify({ email: formData.email });
            alert('OTP resent successfully!');
          } catch (error) {
            alert('Failed to resend OTP. Please try again.');
          } finally {
            setIsLoading(false);
          }
        }}
        className="text-orange-500 hover:underline"
      >
        Resend OTP
      </button>
    </p>
  </div>
)}


        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <button
            type="button"
            onClick={navigateToLogin}
            className="text-orange-500 hover:underline font-bold"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
