import React from "react";
import "./App.css";

import AppRoutes from "./routes/AppRoute";
import { Provider } from "react-redux";
import { store } from "./redux/store";

import { ToastProvider } from "./components/ui/ToastContext";
// import Navbar from "./components/Navbar"; // Uncomment when needed
// import Footer from "./components/Footer"; // Uncomment when needed

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <div className="App">
          {/* <Navbar /> */}
          <AppRoutes />
          {/* <Footer /> */}
        </div>
      </ToastProvider>
    </Provider>
  );
}

export default App;
