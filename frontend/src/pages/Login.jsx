import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import authService from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error,setError] = useState('')
  const [keepSignedIn, setKeepSignedIn] = useState(false); // New state for the checkbox
  const navigate = useNavigate();

const handleSubmit = async (event) => {
  event.preventDefault();
  setIsLoading(true);
  setError(''); // Clear previous error

  try {
    const loginRes = await authService.LoginAccount(email, password);

    if (loginRes.user) {
      // Save user and token correctly
      localStorage.setItem('user', JSON.stringify(loginRes.user));
      localStorage.setItem('token', loginRes.token);

      navigate('/');
    } else {
      setError(loginRes.message || 'Login failed. Please try again.');
    }
  } catch (err) {
    console.error('Login error:', err);
    setError('Something went wrong. Please try again later.');
  } finally {
    setIsLoading(false);
  }
};



  const navigateToRegister = () => {
    navigate('/register');
  };

  return (
    <div className=" bg-white mt-10 lg:mt-0">
      <div className=' flex justify-center lg:my-32 items-center'>
         <div className="w-full max-w-md p-8 bg-white">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-600">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-email">
              <Mail className="inline-block mr-2" /> Email
            </label>
            <input
              type="email"
              id="login-email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="login-password">
              <Lock className="inline-block mr-2" /> Password
            </label>
            <input
              type="password"
              id="login-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="text-right mt-2">
              <button
                type="button"
                onClick={() => navigate('/reset-password')}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
           {error && (
  <p className="text-red-500 text-sm mt-2">{error}</p>
)}

          </div>
          <div className="mb-6 flex items-center">
            <input
              type="checkbox"
              id="keep-signed-in"
              name="keepSignedIn"
              checked={keepSignedIn}
              onChange={(e) => setKeepSignedIn(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="keep-signed-in" className="text-sm text-gray-700">
              Keep me signed in
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 flex items-center justify-center text-sm font-bold ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={navigateToRegister}
            className="text-orange-500 hover:underline font-bold"
          >
            Register
          </button>
        </p>
      </div>

      </div>
      
     

      <Footer/>
    </div>
  );
};

export default Login;
