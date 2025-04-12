// src/components/SareesSection.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ScrolledNavbar from '../components/ScrolledNavbar';
import FilterSidebar from '../components/ui/FilterSidebar';
import sarees from '../Data/sarees-collection';

const categories = ['Silk', 'Cotton', 'Handlooms', 'Kerala Sarees', 'Kanchipuram Sarees'];
const colors = ['Red', ' blue', 'Darkgreen', 'Yellow', 'White', 'Gold'];
const patterns = ['Floral', 'Striped', 'Solid', 'Polka Dot'];
const brands = ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand E'];

const SareesSection = () => {
  const [filters, setFilters] = useState({ category: '', color: '', pattern: '', brand: '', price: 5000 });

  const filteredSarees = sarees.filter((saree) => {
    return (
      (filters.category ? saree.category === filters.category : true) &&
      (filters.color ? saree.color === filters.color : true) &&
      (filters.pattern ? saree.pattern === filters.pattern : true) &&
      (filters.brand ? saree.brand === filters.brand : true) &&
      saree.price <= filters.price
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
          <Link to="/" className="text-blue-600 hover:underline">Home</Link> / <span>Sarees Collection</span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filteredSarees.map((saree) => (
            <div key={saree.id} className="border rounded-sm cursor-pointer overflow-hidden transition">
              <img src={saree.image} alt={saree.title} className="w-full object-cover aspect-[3/4]" />
              <div className="p-3">
                <h3 className="text-md font-medium poppins-regular-bold mb-1">{saree.title}</h3>
                <p className="text-sm text-gray-600 poppins-regular">₹{saree.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SareesSection;
