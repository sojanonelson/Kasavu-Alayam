import { Search } from 'lucide-react';
import React from 'react'

const EmptyResults = ({ clearFilters }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="h-32 w-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <Search size={48} className="text-gray-400" />
    </div>
    <h3 className="text-xl font-medium mb-3">No products found</h3>
    <p className="text-gray-500 text-center max-w-md mb-8">
      We couldn't find any products matching your current filters. 
      Try adjusting your filters or search term.
    </p>
    <button
      onClick={clearFilters}
      className="bg-black text-white px-8 py-3 rounded-md hover:bg-gray-800 transition-colors"
    >
      Clear All Filters
    </button>
  </div>
);

export default EmptyResults