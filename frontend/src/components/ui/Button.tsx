import { Loader2 } from 'lucide-react';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';

const VARIANT_CLASS = {
  primary: 'bg-brand text-white hover:bg-brand-dark disabled:opacity-60',
  secondary: 'border border-border bg-bg text-text hover:bg-bg-subtle disabled:opacity-60',
  ghost: 'text-text hover:bg-bg-subtle disabled:opacity-60',
  danger: 'border border-danger text-danger hover:bg-danger/10 disabled:opacity-60',
} as const;

const SIZE_CLASS = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-[0.9375rem]',
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANT_CLASS;
  size?: keyof typeof SIZE_CLASS;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, disabled, className = '', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-1.5 rounded-xl font-semibold transition-all hover:-translate-y-px disabled:translate-y-0 disabled:cursor-not-allowed ${VARIANT_CLASS[variant]} ${SIZE_CLASS[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 size={14} className="animate-spin" />}
        {children}
      </button>
    );
  },
);
Button.displayName = 'Button';
