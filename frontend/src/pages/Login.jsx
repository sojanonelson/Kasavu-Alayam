import React, { useState, useEffect, useRef } from 'react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from './config'; // Import the auth instance from your firebase configuration

function Login() {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTPSection, setShowOTPSection] = useState(false);
  const [user, setUser] = useState(null);
  const confirmationResultRef = useRef(null);
  const recaptchaVerifierRef = useRef(null);
  const otpInputRefs = useRef([]);

  const showToast = (message, type = 'info') => {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toastDiv = document.createElement('div');
    toastDiv.className = `fixed bottom-4 right-4 px-4 py-2 bg-${type === 'error' ? 'red' : 'green'}-500 text-white rounded shadow-lg`;
    toastDiv.textContent = message;
    toastContainer.appendChild(toastDiv);

    setTimeout(() => {
      toastDiv.classList.add('show');
    }, 10);

    setTimeout(() => {
      toastDiv.classList.remove('show');
      toastDiv.addEventListener('transitionend', () => toastDiv.remove(), { once: true });
    }, 4000);
  };

  useEffect(() => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            console.log("reCAPTCHA verified:", response);
          },
          'expired-callback': () => {
            showToast("reCAPTCHA expired. Please try again.", "error");
            setLoading(false);
          }
        }
      );

      recaptchaVerifierRef.current.render().then((widgetId) => {
        console.log('reCAPTCHA rendered with widgetId:', widgetId);
      });
    }
  }, []);

  const handleOtpChange = (e, index) => {
    const { value } = e.target;
    if (value.length > 1) {
      e.target.value = value.charAt(0);
    }

    const newOtp = [...otp];
    newOtp[index] = e.target.value;
    setOtp(newOtp);

    if (e.target.value && index < otp.length - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const onSendOtp = async () => {
    setLoading(true);
    try {
      const appVerifier = recaptchaVerifierRef.current;
      const formattedPhoneNumber = phoneNumber.trim();

      if (!formattedPhoneNumber || formattedPhoneNumber.length < 10 || !formattedPhoneNumber.startsWith('+')) {
        showToast("Please enter a valid phone number, including country code (e.g., +91).", "error");
        setLoading(false);
        return;
      }

      const result = await signInWithPhoneNumber(auth, formattedPhoneNumber, appVerifier);
      confirmationResultRef.current = result;
      setShowOTPSection(true);
      showToast("OTP sent successfully!", "success");
    } catch (error) {
      console.error("Error sending OTP:", error);
      let errorMessage = "Failed to send OTP.";
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = "The provided phone number is not valid. Remember to include the country code (e.g., +91).";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many requests. Please try again later.";
      } else if (error.code === 'auth/missing-phone-number') {
        errorMessage = "Please enter your phone number.";
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = "ReCAPTCHA verification failed. Please try again.";
      } else if (error.code === 'auth/web-storage-unsupported') {
        errorMessage = "Your browser does not support local storage needed for reCAPTCHA. Please try a different browser or clear browser data.";
      }
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp = async () => {
    setLoading(true);
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      showToast("Please enter a 6-digit OTP.", "error");
      setLoading(false);
      return;
    }

    try {
      if (!confirmationResultRef.current) {
        showToast("No confirmation result found. Please resend OTP.", "error");
        setLoading(false);
        return;
      }
      const res = await confirmationResultRef.current.confirm(enteredOtp);
      setUser(res.user);
      showToast("Login successful!", "success");
    } catch (error) {
      console.error("Error verifying OTP:", error);
      let errorMessage = "Invalid OTP.";
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = "The verification code is invalid. Please double-check.";
      } else if (error.code === 'auth/code-expired') {
        errorMessage = "The verification code has expired. Please resend OTP.";
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = "This user account has been disabled.";
      }
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-emerald-500 flex items-center justify-center h-screen font-sans">
      <div id="toast-container"></div>
      <div id="recaptcha-container"></div>

      {user ? (
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-emerald-700 font-bold text-3xl mb-4">
            👍 Login Successful!
          </h2>
          <p className="text-gray-700 text-lg">Welcome, {user.phoneNumber}!</p>
        </div>
      ) : (
        <div className="w-80 sm:w-96 bg-white rounded-lg shadow-xl p-6 flex flex-col gap-6">
          <h1 className="text-center text-emerald-600 text-4xl font-extrabold mb-4">
            Welcome to <br /> CODE A PROGRAM
          </h1>

          {showOTPSection ? (
            <>
              <div className="bg-emerald-500 text-white mx-auto p-4 rounded-full shadow-md w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0c-.621 0-1.162.295-1.557.75l-.364.444A.75.75 0 0 1 5.5 1.5V3H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1.5V1.5A.75.75 0 0 1 10 1h-.543a.75.75 0 0 1-.527-.22L8 0zm-1 3V1.5a.75.75 0 0 1 1.5 0V3h-1.5zM4 5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5zM8 7a.75.75 0 0 0-.75.75V9.5a.75.75 0 0 0 1.5 0V7.75A.75.75 0 0 0 8 7z"/>
                </svg>
              </div>
              <label htmlFor="otp-input-0" className="text-emerald-700 text-xl text-center font-semibold mt-2">
                Enter your OTP
              </label>
              <div className="otp-container flex justify-center gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-input-${index}`}
                    type="number"
                    className="otp-input-field w-10 h-10 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    maxLength="1"
                    min="0"
                    max="9"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    ref={(el) => (otpInputRefs.current[index] = el)}
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <button
                onClick={onVerifyOtp}
                className="bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200 w-full flex gap-2 items-center justify-center py-3 text-white rounded-md text-lg font-semibold shadow-md"
                disabled={loading}
              >
                {loading && (
                  <span className="animate-spin">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v4"></path>
                      <path d="M12 18v4"></path>
                      <path d="M4.93 4.93l2.83 2.83"></path>
                      <path d="M16.24 16.24l2.83 2.83"></path>
                      <path d="M2 12h4"></path>
                      <path d="M18 12h4"></path>
                      <path d="M4.93 19.07l2.83-2.83"></path>
                      <path d="M16.24 7.76l2.83-2.83"></path>
                    </svg>
                  </span>
                )}
                <span>Verify OTP</span>
              </button>
            </>
          ) : (
            <>
              <div className="bg-emerald-500 text-white mx-auto p-4 rounded-full shadow-md w-fit">
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.313 1.725c.436.325.548.935.28 1.464l-.587 1.22c-.2.414-.668.657-1.18.618A12.7 12.7 0 0 1 .51 1.27C.471.758.714.29.924.08l1.22-.587zM1.8 1.4l-.427.206c-.1.048-.184.116-.24.188L.524 2.1a1 1 0 0 0 .151.365l.54 1.12c.162.338.48.567.84.618l2.19.548c.176.044.354-.002.5-.125l1.725-2.313a.5.5 0 0 0-.124-.5L4.475 2.1c-.072-.056-.14-.14-.188-.24L4.01 1.473a.85.85 0 0 0-.163-.261L2.046 1.096c-.347-.16-.766-.12-1.077.086z"/>
                </svg>
              </div>
              <label htmlFor="phone-input" className="text-emerald-700 text-xl text-center font-semibold mt-2">
                Verify your phone number
              </label>
              <input
                type="tel"
                id="phone-input"
                placeholder="e.g., +919876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-700"
              />
              <button
                onClick={onSendOtp}
                className="bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200 w-full flex gap-2 items-center justify-center py-3 text-white rounded-md text-lg font-semibold shadow-md"
                disabled={loading}
              >
                {loading && (
                  <span className="animate-spin">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v4"></path>
                      <path d="M12 18v4"></path>
                      <path d="M4.93 4.93l2.83 2.83"></path>
                      <path d="M16.24 16.24l2.83 2.83"></path>
                      <path d="M2 12h4"></path>
                      <path d="M18 12h4"></path>
                      <path d="M4.93 19.07l2.83-2.83"></path>
                      <path d="M16.24 7.76l2.83-2.83"></path>
                    </svg>
                  </span>
                )}
                <span>Send code via SMS</span>
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default Login;
