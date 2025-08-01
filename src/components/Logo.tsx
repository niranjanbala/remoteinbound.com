'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'text';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'full'
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  if (variant === 'text') {
    return (
      <div className={`font-bold text-orange-500 ${textSizeClasses[size]} ${className}`}>
        Remote Inbound
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer circle representing "Remote" - global reach */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="#f97316"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Inner connected nodes representing "Inbound" - connections */}
          <circle cx="20" cy="12" r="2" fill="#f97316" />
          <circle cx="28" cy="20" r="2" fill="#f97316" />
          <circle cx="20" cy="28" r="2" fill="#f97316" />
          <circle cx="12" cy="20" r="2" fill="#f97316" />
          <circle cx="20" cy="20" r="2" fill="#f97316" />
          
          {/* Connection lines */}
          <line x1="20" y1="12" x2="20" y2="20" stroke="#f97316" strokeWidth="1.5" />
          <line x1="28" y1="20" x2="20" y2="20" stroke="#f97316" strokeWidth="1.5" />
          <line x1="20" y1="28" x2="20" y2="20" stroke="#f97316" strokeWidth="1.5" />
          <line x1="12" y1="20" x2="20" y2="20" stroke="#f97316" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // Full logo with icon and text
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={sizeClasses[size]}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer circle representing "Remote" - global reach */}
          <circle
            cx="20"
            cy="20"
            r="18"
            stroke="#f97316"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Inner connected nodes representing "Inbound" - connections */}
          <circle cx="20" cy="12" r="2" fill="#f97316" />
          <circle cx="28" cy="20" r="2" fill="#f97316" />
          <circle cx="20" cy="28" r="2" fill="#f97316" />
          <circle cx="12" cy="20" r="2" fill="#f97316" />
          <circle cx="20" cy="20" r="2" fill="#f97316" />
          
          {/* Connection lines */}
          <line x1="20" y1="12" x2="20" y2="20" stroke="#f97316" strokeWidth="1.5" />
          <line x1="28" y1="20" x2="20" y2="20" stroke="#f97316" strokeWidth="1.5" />
          <line x1="20" y1="28" x2="20" y2="20" stroke="#f97316" strokeWidth="1.5" />
          <line x1="12" y1="20" x2="20" y2="20" stroke="#f97316" strokeWidth="1.5" />
        </svg>
      </div>
      <div className={`font-bold text-orange-500 ${textSizeClasses[size]}`}>
        Remote Inbound
      </div>
    </div>
  );
};

export default Logo;