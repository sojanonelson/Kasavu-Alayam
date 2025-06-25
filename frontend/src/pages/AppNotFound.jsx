import { useNavigate } from 'react-router-dom';
import NotFound from '../assets/not-found.svg';

const AppNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="lg:h-[80vh]  flex flex-col justify-center items-center bg-white px-4 text-center">
      <div className="bg-white p-8 ">
        <img
          src={NotFound}
          alt="Page Not Found"
          className="w-64 h-64 mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-600 mb-4">
          We're sorry, but the page you requested could not be found.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors border border-gray-200"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppNotFound;
