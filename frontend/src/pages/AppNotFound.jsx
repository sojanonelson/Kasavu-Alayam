import { useNavigate } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const AppNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-white px-4 text-center">
      <AlertTriangle size={60} className="text-yellow-500 mb-4 animate-bounce" />
      <h1 className="text-6xl font-bold text-gray-800 mb-4">Oops!</h1>
      <h2 className="text-2xl text-gray-600 mb-2">404 - Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-6">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
        >
          Go Back
        </button>

        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default AppNotFound;
