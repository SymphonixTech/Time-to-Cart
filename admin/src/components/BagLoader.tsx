
import React from 'react';

interface BagLoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

const BagLoader: React.FC<BagLoaderProps> = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} border-2 border-gray-300 border-t-black rounded-full animate-spin`}></div>
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
};

export default BagLoader;
