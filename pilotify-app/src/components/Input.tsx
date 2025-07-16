import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const Input: React.FC<InputProps> = ({
  hasError = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'h-10 px-4 text-base border rounded-md transition-all duration-200';
  const errorStyles = hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-primary focus:ring-primary';

  return (
    <input
      className={`${baseStyles} ${errorStyles} ${className}`}
      {...props}
    />
  );
};

export default Input;
