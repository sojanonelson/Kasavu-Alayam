import React from "react";
import "./App.css";

import AppRoutes from "./routes/AppRoute";

import Navbar from "./components/Navbar";




function App() {
  return (
    <div className="App">
       <Navbar/>
    <AppRoutes/>
    {/* <Footer/> */}
    
    </div>
  );
}

export default App;




