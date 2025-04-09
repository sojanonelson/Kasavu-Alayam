import React, { useState } from 'react';
import customerService from '../services/customerService';

const CustomerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    customerType: '',
    discount: '',
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
    await customerService.createCustomer(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      customerType: '',
      discount: '',
      notes: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Customer Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />
      <input
        type="text"
        name="customerType"
        placeholder="Customer Type"
        value={formData.customerType}
        onChange={handleChange}
      />
      <input
        type="number"
        name="discount"
        placeholder="Discount"
        value={formData.discount}
        onChange={handleChange}
      />
      <input
        type="text"
        name="notes"
        placeholder="Notes"
        value={formData.notes}
        onChange={handleChange}
      />
      <button type="submit">Create Customer</button>
    </form>
  );
};

export default CustomerForm;
