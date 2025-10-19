import React from 'react';
import { motion } from 'framer-motion';

interface BagLoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const BagLoader: React.FC<BagLoaderProps> = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center py-4';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <motion.div
          className={`${sizeClasses[size]} relative mx-auto mb-4`}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {/* Dollar sign with coins animation */}
          <div className="relative w-full h-full">
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <span className="text-green-600 font-bold text-2xl">$</span>
            </motion.div>

            {/* Floating coins */}
            <motion.div
              className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full"
              animate={{
                y: [0, -10, 0],
                x: [0, 5, 0],
                scale: [1, 1.3, 1]
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: 0.2
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-2 h-2 bg-yellow-500 rounded-full"
              animate={{
                y: [0, -8, 0],
                x: [0, -3, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: 0.4
              }}
            />
            <motion.div
              className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-orange-400 rounded-full"
              animate={{
                y: [0, -6, 0],
                x: [0, -4, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
        <motion.p
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1, repeat: Infinity }}
          className={`text-gray-600 font-medium ${textSizes[size]}`}
        >
          {text}
        </motion.p>
      </div>
    </div>
  );
};

export default BagLoader;