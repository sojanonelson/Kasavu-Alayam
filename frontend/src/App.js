// src/App.js
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';


import AppRoutes from './routes/AppRoute';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
