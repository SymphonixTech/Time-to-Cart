
import React from 'react';

export const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="card p-4">
      <div className="skeleton h-48 w-full mb-4"></div>
      <div className="skeleton h-4 w-3/4 mb-2"></div>
      <div className="skeleton h-3 w-1/2 mb-2"></div>
      <div className="skeleton h-6 w-1/4"></div>
    </div>
  );
};

export const ProductDetailSkeleton: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="skeleton h-96 w-full rounded-lg"></div>
        <div className="space-y-4">
          <div className="skeleton h-8 w-3/4"></div>
          <div className="skeleton h-6 w-1/4"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-2/3"></div>
          <div className="skeleton h-12 w-1/3 mt-6"></div>
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(8)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export const ProductSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
    <div className="w-full h-64 bg-gray-300"></div>
    <div className="p-4">
      <div className="h-6 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 rounded mb-3 w-3/4"></div>
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 bg-gray-300 rounded mb-1 w-20"></div>
          <div className="h-4 bg-gray-300 rounded w-16"></div>
        </div>
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
      </div>
    </div>
  </div>
);
