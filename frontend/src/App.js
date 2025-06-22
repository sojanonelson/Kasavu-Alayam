import React from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoute";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ToastProvider } from "./components/ui/ToastContext";
import DevelopmentBadge from "./components/DevelopmentBadge"; // Adjust the path as necessary

function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <div className="App">
          {/* <Navbar /> */}
          <AppRoutes />
          {/* <Footer /> */}
          <DevelopmentBadge />
        </div>
      </ToastProvider>
    </Provider>
  );
}

export default App;
