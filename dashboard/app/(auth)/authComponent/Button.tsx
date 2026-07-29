import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'github' | 'link';
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = true,
  children,
  icon,
  className = '',
  ...props
}) => {
  if (variant === 'github') {
    return (
      <button
        type="button"
        className={`w-full h-12 flex items-center justify-center gap-3 bg-white hover:bg-[#ff3100] transition-all duration-300 rounded-sm group mb-10 overflow-hidden relative ${className}`}
        {...props}
      >
        <div className="absolute inset-0 bg-[#ff3100] translate-y-full group-hover:translate-y-0 transition-transform duration-300 pointer-events-none" />
        {icon || (
          <svg
            className="w-5 h-5 fill-black group-hover:fill-white z-10 transition-colors duration-300"
            viewBox="0 0 24 24"
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"></path>
          </svg>
        )}
        <span className="font-mono text-sm font-bold uppercase tracking-widest text-black group-hover:text-white z-10 transition-colors duration-300">
          {children}
        </span>
      </button>
    );
  }

  if (variant === 'link') {
    return (
      <button
        type="button"
        className={`text-[#ff3100] hover:text-white hover:underline underline-offset-4 transition-colors font-mono cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <button
      className={`${
        fullWidth ? 'w-full' : ''
      } h-14 bg-[#ff3100] text-white font-mono font-bold text-sm uppercase tracking-[0.2em] rounded-sm hover:bg-[#ff451a] active:scale-[0.99] transition-all duration-200 relative overflow-hidden group cursor-pointer ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon}
        {children}
      </span>
      <div className="absolute inset-0 bg-white/10 translate-x-full group-hover:translate-x-0 transition-transform duration-500 pointer-events-none" />
    </button>
  );
};
