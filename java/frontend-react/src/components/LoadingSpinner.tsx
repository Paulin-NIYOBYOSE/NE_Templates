import React from 'react';

interface Props { size?: 'sm' | 'md' | 'lg'; text?: string }

const sizes = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

const LoadingSpinner: React.FC<Props> = ({ size = 'md', text }) => (
  <div className="flex flex-col items-center justify-center gap-3 py-10">
    <div className={`${sizes[size]} animate-spin rounded-full border-4 border-primary-200 border-t-primary-600`} />
    {text && <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>}
  </div>
);

export default LoadingSpinner;
