import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success' | 'sun' | 'lime';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold whitespace-nowrap transition-all duration-200 ease-out cursor-pointer select-none active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100';

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-700 text-white shadow-sm shadow-brand-700/25 hover:-translate-y-px hover:bg-brand-800 hover:shadow-lg hover:shadow-brand-700/30 before:absolute before:inset-0 before:-z-10 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transition-transform before:duration-700 hover:before:translate-x-full',
  secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
  outline: 'border border-slate-300 bg-white text-slate-700 hover:-translate-y-px hover:border-brand-400 hover:text-brand-700 hover:shadow-sm',
  sun: 'bg-sun-300 text-brand-900 hover:-translate-y-px hover:bg-sun-400 hover:shadow-md',
  lime: 'bg-lime-brand text-brand-950 hover:brightness-95',
  ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
};

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

const buttonClasses = (variant: ButtonVariant = 'primary', size: ButtonSize = 'md', className?: string) =>
  cn(base, variants[variant], sizes[size], className);

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', loading, icon, iconRight, fullWidth, className, children, disabled, type = 'button', ...rest },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={buttonClasses(variant, size, cn(fullWidth && 'w-full', className))}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {children}
      {!loading && iconRight}
    </button>
  ),
);
Button.displayName = 'Button';

export interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export const ButtonLink = ({ variant = 'primary', size = 'md', icon, iconRight, className, children, ...rest }: ButtonLinkProps) => (
  <Link className={buttonClasses(variant, size, typeof className === 'string' ? className : undefined)} {...rest}>
    {icon}
    {children}
    {iconRight}
  </Link>
);
