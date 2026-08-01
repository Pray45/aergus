import React from "react";

interface CardProps {
  title: string;
  subtitle?: string;
  systemState?: string;
  children: React.ReactNode;
  footerContent?: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  systemState = "SYSTEM_STATE: PENDING",
  children,
  footerContent,
  className = "",
}) => {
  return (
    <div
      className={`bg-aergus-card border border-aergus-border rounded-lg overflow-hidden relative shadow-2xl ${className}`}
    >
      {/* Decorative System State Badge */}
      <div className="absolute top-0 right-0 p-4 pointer-events-none z-10">
        <span className="font-mono text-[9px] text-aergus-text/20 tracking-widest uppercase">
          {systemState}
        </span>
      </div>

      <div className="p-8 md:p-10">
        <header className="mb-10 relative">
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-1 h-8 bg-aergus-primary" />
          <h2 className="font-headline-lg text-2xl md:text-3xl font-bold text-aergus-text uppercase tracking-wider">
            {title}
          </h2>
          {subtitle && (
            <p className="text-aergus-text-dim font-mono text-xs mt-2 uppercase tracking-tight">
              {subtitle}
            </p>
          )}
        </header>

        {children}
      </div>

      {footerContent && (
        <div className="px-8 pb-10 text-center">{footerContent}</div>
      )}

      {/* Card Decorative Accent Line */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-aergus-primary to-transparent opacity-50 pointer-events-none" />
    </div>
  );
};
