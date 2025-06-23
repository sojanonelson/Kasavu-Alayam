import React, { useState, useRef } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const handleSendOtp = () => {
    if (!email.includes('@')) return alert("Enter a valid email!");

    setIsLoading(true);
    setTimeout(() => {
      setOtp('123456'); // Simulated OTP
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleOtpChange = (index, value) => {
    if (/^\d?$/.test(value)) {
      const newOtp = [...enteredOtp];
      newOtp[index] = value;
      setEnteredOtp(newOtp);

      // Move focus to the next input box if a digit was entered
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleVerifyOtp = () => {
    const joinedOtp = enteredOtp.join('');
    if (joinedOtp === otp) {
      setStep(3);
    } else {
      alert('Invalid OTP');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Password reset for:', email);
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center lg:h-[80vh] bg-white mt-10 lg:mt-0">
      <div className="w-full max-w-md p-8 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-600">Reset Password</h2>

        {step === 1 && (
          <div className="mb-8">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              <Mail className="inline-block mr-2" /> Enter your email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full mt-4 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 text-sm font-bold"
            >
              {isLoading ? <Loader2 className="animate-spin inline-block mr-2" /> : null}
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">OTP Verification</h2>
            <p className="text-gray-500 mb-6 text-center">We have sent a verification code to your email.</p>
            <div className="flex justify-center mb-4">
              {enteredOtp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  maxLength="1"
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-12 h-12 mx-1 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={handleVerifyOtp}
              className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 font-bold transition duration-200"
            >
              Verify OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
                <Lock className="inline-block mr-2" /> New Password
              </label>
              <input
                type="password"
                id="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="mb-8">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                <Lock className="inline-block mr-2" /> Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 flex items-center justify-center text-sm font-bold ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
