import React from "react";
import "./App.css";

import AppRoutes from "./routes/AppRoute";
import { Provider } from 'react-redux';
import { store } from './redux/store';
import kidsCollection from "./Data/kids-collection";
import Navbar from "./components/Navbar";




function App() {
  return (
    <div className="App">
        <Provider store={store}>
        {/* <Navbar /> */}
    <AppRoutes/>
    {/* <Footer/> */}
    

        </Provider>
    
    </div>
  );
}

export default App;




