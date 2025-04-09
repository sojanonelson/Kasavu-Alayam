import React from "react";
import "./App.css";
import OrderList from "./components/orderlist";
import OrderForm from "./components/orderfrom";
import ProductList from "./components/productlist";
import ProductForm from "./components/productform";
import CustomerList from "./components/customerlist";
import CustomerForm from "./components/customerform";
import AppRoutes from "./routes/AppRoute";
import HomePage from "./pages/Home";

function App() {
  return (
    <div className="App">
    <AppRoutes/>
    </div>
  );
}

export default App;
