
import React from 'react';

const ProductSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="w-full h-64 bg-gray-200 skeleton"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-200 skeleton rounded mb-2"></div>
        <div className="h-4 bg-gray-200 skeleton rounded mb-1"></div>
        <div className="h-4 bg-gray-200 skeleton rounded w-3/4 mb-3"></div>
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 skeleton rounded w-20"></div>
          <div className="h-10 w-10 bg-gray-200 skeleton rounded"></div>
        </div>
        <div className="h-4 bg-gray-200 skeleton rounded w-24 mt-2"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;
