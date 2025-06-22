import React from "react";
import "./App.css";
import AppRoutes from "./routes/AppRoute";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ToastProvider } from "./components/ui/ToastContext";
import DevelopmentBadge from "./components/DevelopmentBadge";
function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <div className="App">
         

         
        
          <AppRoutes />
          {/* <Footer /> */}
          <DevelopmentBadge />
         
        </div>
      </ToastProvider>
    </Provider>
  );
}

export default App;
