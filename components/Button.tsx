import React from 'react';

interface ButtonProps {
  link?: string;
  target?: string;
  children: React.ReactNode;
  className?: string;
  background?: string;
  id?: string;
}

export const Button: React.FC<ButtonProps> = ({ link, target, children, className = '', background, id }) => {
  const bg = background ?? 'bg-gradient-to-r from-fuchsia-500 via-amber-500 to-fuchsia-500';
  
  return (
    <a 
      id={id}
      href={link} 
      target={target} 
      className={`btn-container relative inline-block hover:scale-105 transition-all ${className}`}
    >
      <div className={`btn-blur ${bg} absolute top-0 left-0 right-0 bottom-0 -z-10 rounded-md`}>
      </div>
      <div className={`tickets-btn ${bg} relative transition-all duration-300 rounded-md p-0.5 font-bold`}>
        <div className="content uppercase transition-all duration-1000 bg-dark-500 text-white w-full h-full px-12 rounded-md py-3">
          {children}
        </div>
      </div>
    </a>
  );
}; 