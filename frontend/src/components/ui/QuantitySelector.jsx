import React from 'react';
import { Minus, Plus } from 'lucide-react';

const QuantitySelector = ({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  onQuantityChange,
  min = 1, 
  max = 10,
  size = 'md',
  disabled = false 
}) => {
  const handleInputChange = (e) => {
    const value = parseInt(e.target.value) || min;
    const clampedValue = Math.max(min, Math.min(max, value));
    if (onQuantityChange) {
      onQuantityChange(clampedValue);
    }
  };

  const sizeClasses = {
    sm: {
      button: 'w-6 h-6',
      input: 'w-12 h-6 text-xs',
      icon: 12
    },
    md: {
      button: 'w-8 h-8',
      input: 'w-16 h-8 text-sm',
      icon: 16
    },
    lg: {
      button: 'w-10 h-10',
      input: 'w-20 h-10 text-base',
      icon: 20
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex items-center border rounded-md overflow-hidden bg-white">
      <button
        onClick={onDecrease}
        disabled={disabled || quantity <= min}
        className={`${currentSize.button} flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-r`}
        aria-label="Decrease quantity"
      >
        <Minus size={currentSize.icon} />
      </button>
      
      <input
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        className={`${currentSize.input} text-center border-0 focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label="Quantity"
      />
      
      <button
        onClick={onIncrease}
        disabled={disabled || quantity >= max}
        className={`${currentSize.button} flex items-center justify-center bg-gray-50 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors border-l`}
        aria-label="Increase quantity"
      >
        <Plus size={currentSize.icon} />
      </button>
    </div>
  );
};

export default QuantitySelector;