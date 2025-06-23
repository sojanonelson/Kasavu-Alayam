import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';

const Login = ({ switchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      console.log('Login form submitted');
    }, 2000);
  };

  return (
    <div className="w-full max-h- mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-red-600">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="login-email">
            <Mail className="inline-block mr-2" /> Email
          </label>
          <input
            type="email"
            id="login-email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="login-password">
            <Lock className="inline-block mr-2" /> Password
          </label>
          <input
            type="password"
            id="login-password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isLoading ? <Loader2 className="animate-spin mr-2" /> : null}
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className="mt-4 text-center">
        Don't have an account?{' '}
        <button onClick={switchToRegister} className="text-orange-500 hover:underline">
          Register
        </button>
      </p>
    </div>
  );
};

export default Login;
