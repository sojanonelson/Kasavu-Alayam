import React, { useState } from 'react';
import productService from '../services/productservice';

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    fabricType: '',
    availableColors: '',
    pricePerUnit: '',
    unit: '',
    stock: '',
    minimumOrderQuantity: '',
    images: '',
    isActive: true
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
    await productService.createProduct(formData);
    setFormData({
      name: '',
      description: '',
      category: '',
      fabricType: '',
      availableColors: '',
      pricePerUnit: '',
      unit: '',
      stock: '',
      minimumOrderQuantity: '',
      images: '',
      isActive: true
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={formData.category}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="fabricType"
        placeholder="Fabric Type"
        value={formData.fabricType}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="availableColors"
        placeholder="Available Colors (comma-separated)"
        value={formData.availableColors}
        onChange={handleChange}
      />
      <input
        type="number"
        name="pricePerUnit"
        placeholder="Price Per Unit"
        value={formData.pricePerUnit}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="unit"
        placeholder="Unit"
        value={formData.unit}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={formData.stock}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="minimumOrderQuantity"
        placeholder="Minimum Order Quantity"
        value={formData.minimumOrderQuantity}
        onChange={handleChange}
      />
      <input
        type="text"
        name="images"
        placeholder="Images (comma-separated URLs)"
        value={formData.images}
        onChange={handleChange}
      />
      <button type="submit">Create Product</button>
    </form>
  );
};

export default ProductForm;
