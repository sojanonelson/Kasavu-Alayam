import './App.css';
import { Helmet } from 'react-helmet';

function App() {
  return (
    <div className="App bg-gray-900 text-white flex justify-center items-center h-screen">
      <Helmet>
        <title>My Awesome App</title> {/* Tab title */}
        <link rel="icon" type="image/png" href="/favicon.png" /> {/* Favicon */}
      </Helmet>

      <header className="App-header">
        <h1 className="text-6xl animate-pulse font-extrabold"> lets do it!😎.....</h1>
      </header>
    </div>
  );
}

export default App;
