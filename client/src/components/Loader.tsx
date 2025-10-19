
import React from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Loader: React.FC<LoaderProps> = ({ fullScreen = false, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50'
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <ShoppingBagIcon 
          className={`${sizeClasses[size]} text-black mx-auto shopping-bag-animation`} 
        />
        <p className="mt-2 text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
