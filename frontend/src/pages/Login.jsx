import { useState, useEffect, useRef } from 'react';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { app } from './firebase';

const LoginWithOTP = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showOtpField, setShowOtpField] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const otpRefs = useRef([]);
  const auth = getAuth(app);

  useEffect(() => {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => { }
    });
  }, [auth]);

  useEffect(() => {
    if (showOtpField && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [showOtpField]);

  const handlePhoneNumberSubmit = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      setError('Please accept the Terms and Conditions and Return Policy to continue.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const phone = `+91${phoneNumber}`;
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      setShowOtpField(true);
    } catch (err) {
      setError(err.message);
      console.error("OTP Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];

    if (value.match(/^[0-9]$/)) {
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter complete 6-digit OTP.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otpCode);
      setIsVerified(true);
      console.log("Verified User:", result.user);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error("OTP Verify Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white shadow-2xl w-full max-w-md relative border-2 border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold transition-colors duration-200"
        >
          ×
        </button>

        <div className="p-8 py-32">
          {!isVerified ? (
            <div>
              <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
                {showOtpField ? "Enter OTP" : "Login with OTP"}
              </h2>

              <form onSubmit={showOtpField ? handleOtpSubmit : handlePhoneNumberSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                {!showOtpField ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter Phone (without +91)"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full border-2 border-gray-300 px-4 py-3 focus:border-indigo-500 focus:outline-none transition-colors duration-200"
                        required
                      />
                    </div>

                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="terms"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="mt-1 h-4 w-4 text-indigo-600 border-2 border-gray-300 focus:ring-indigo-500"
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600 leading-5">
                        I accept the{' '}
                        <a href="#" className="text-yellow-600 hover:text-yellow-800 underline font-medium">
                          Terms and Conditions
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-yellow-600 hover:text-yellow-800 underline font-medium">
                          Return Policy
                        </a>
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white py-3 hover:bg-indigo-700 transition-colors duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send OTP"}
                    </button>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                        Enter the 6-digit code sent to +91{phoneNumber}
                      </label>

                      <div className="flex justify-center space-x-3 mb-6">
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (otpRefs.current[index] = el)}
                            type="text"
                            value={digit}
                            onChange={(e) => handleOtpChange(e.target.value, index)}
                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                            className="w-12 h-12 text-center text-xl font-bold border-2 transition-all duration-200 outline-none border-gray-300"
                            maxLength={1}
                          />
                        ))}
                      </div>

                      <div className="text-center mb-4">
                        <button
                          type="button"
                          onClick={() => {
                            setError('');
                            handlePhoneNumberSubmit({ preventDefault: () => {} });
                          }}
                          className="text-sm text-indigo-600 hover:text-indigo-800 underline"
                        >
                          Resend OTP
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-green-600 text-white py-3 hover:bg-green-700 transition-colors duration-200 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={loading || otp.join('').length !== 6}
                      >
                        {loading ? "Verifying..." : "Verify OTP"}
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          ) : (
            <div className="text-center">
              <div className="text-green-600 text-lg mb-4">
                Phone number verified successfully! 🎉
              </div>
              <button
                onClick={onClose}
                className="bg-green-600 text-white px-6 py-2 hover:bg-green-700 transition-colors duration-200 font-medium"
              >
                Continue
              </button>
            </div>
          )}

          <div id="recaptcha-container"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginWithOTP;
