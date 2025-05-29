import React, { useState } from 'react';
import orderService from '../services/orderservices';


const OrderForm = () => {
  const [formData, setFormData] = useState({
    customer: '',
    items:[],
    paymentMethod: '',
    shippingAddress: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await orderService.createOrder(formData);
    setFormData({
      customer: '',
      items: [],
      paymentMethod: '',
      shippingAddress: '',
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="customer"
        placeholder="Customer ID"
        value={formData.customer}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="items"
        placeholder="Items (JSON format)"
        value={formData.items}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="paymentMethod"
        placeholder="Payment Method"
        value={formData.paymentMethod}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="shippingAddress"
        placeholder="Shipping Address"
        value={formData.shippingAddress}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
      />
      <button type="submit">Create Order</button>
    </form>
  );
};

export default OrderForm;
