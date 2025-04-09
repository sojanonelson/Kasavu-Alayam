import React from 'react';
import './App.css';
import OrderList from './components/orderlist';
import OrderForm from './components/orderform';
import ProductList from './components/productlist';
import ProductForm from './components/productform';
import CustomerList from './components/customerlist';
import CustomerForm from './components/customerform';

function App() {
  return (
    <div className="App">
      <h1>Shop Management</h1>
      <section>
        <h2>Orders</h2>
        <OrderForm />
        <OrderList />
      </section>
      <section>
        <h2>Products</h2>
        <ProductForm />
        <ProductList />
      </section>
      <section>
        <h2>Customers</h2>
        <CustomerForm />
        <CustomerList />
      </section>
    </div>
  );
}

export default App;
