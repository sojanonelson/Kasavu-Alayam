import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScrolledNavbar from '../components/ScrolledNavbar';
import FilterSidebar from '../components/ui/FilterSidebar';
import products from '../Data/mens-collection';


const categories = ['Shirt', 'Pants', 'T-Shirts', 'Jackets'];
const colors = ['White', 'Black', 'Blue', 'Red'];
const patterns = ['Solid', 'Striped', 'Checked'];
const brands = ['Brand A', 'Brand B', 'Brand C'];

const MensCollection = () => {
  const [filters, setFilters] = useState({ category: '', color: '', pattern: '', brand: '', price: 100 });

  const filteredProducts = products.filter((product) => {
    return (
      (filters.category ? product.category === filters.category : true) &&
      (filters.color ? product.color === filters.color : true) &&
      (filters.pattern ? product.pattern === filters.pattern : true) &&
      (filters.brand ? product.brand === filters.brand : true) &&
      product.price <= filters.price
    );
  });

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="relative">
      {isScrolled ? <ScrolledNavbar /> : <Navbar />}

      <FilterSidebar
        filters={filters}
        handleFilterChange={handleFilterChange}
        categories={categories}
        colors={colors}
        patterns={patterns}
        brands={brands}
      />

      <div className="md:ml-[20%] px-6 md:px-10 py-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-600 mb-4 mt-32">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link> / <span>Men’s Collection</span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="border rounded-sm cursor-pointer overflow-hidden transition">
              <img src={product.image} alt={product.title} className="w-full object-cover aspect-[3/4]" />
              <div className="p-3">
                <h3 className="text-md font-medium poppins-regular-bold mb-1">{product.title}</h3>
                <p className="text-sm text-gray-600 poppins-regular">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MensCollection;
