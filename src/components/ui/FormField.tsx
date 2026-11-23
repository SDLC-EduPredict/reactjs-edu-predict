import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

const control =
  'w-full rounded-xl border bg-slate-50/70 px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 focus:bg-white disabled:bg-slate-100 disabled:text-slate-500';
const tone = (invalid?: boolean) =>
  invalid
    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
    : 'border-slate-200 focus:border-brand-400 focus:ring-brand-100';

interface FieldShellProps {
  label?: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

export const Field = ({ label, htmlFor, error, hint, required, children, className }: FieldShellProps) => (
  <div className={cn('space-y-1.5', className)}>
    {label && (
      <label htmlFor={htmlFor} className="block text-xs font-semibold text-slate-700">
        {label}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
    )}
    {children}
    {error ? (
      <p className="text-xs font-medium text-rose-600">{error}</p>
    ) : hint ? (
      <p className="text-xs text-slate-400">{hint}</p>
    ) : null}
  </div>
);

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightSlot?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightSlot, id, name, required, className, containerClassName, ...rest }, ref) => {
    const inputId = id ?? name;
    return (
      <Field label={label} htmlFor={inputId} error={error} hint={hint} required={required} className={containerClassName}>
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">{leftIcon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            name={name}
            aria-invalid={Boolean(error)}
            className={cn(control, tone(Boolean(error)), leftIcon && 'pl-10', rightSlot && 'pr-11', className)}
            {...rest}
          />
          {rightSlot && <span className="absolute inset-y-0 right-2 flex items-center">{rightSlot}</span>}
        </div>
      </Field>
    );
  },
);
Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, name, required, className, containerClassName, rows = 4, ...rest }, ref) => (
    <Field label={label} htmlFor={id ?? name} error={error} hint={hint} required={required} className={containerClassName}>
      <textarea
        ref={ref}
        id={id ?? name}
        name={name}
        rows={rows}
        aria-invalid={Boolean(error)}
        className={cn(control, tone(Boolean(error)), 'resize-y', className)}
        {...rest}
      />
    </Field>
  ),
);
Textarea.displayName = 'Textarea';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  containerClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, id, name, required, options, placeholder, className, containerClassName, ...rest }, ref) => (
    <Field label={label} htmlFor={id ?? name} error={error} hint={hint} required={required} className={containerClassName}>
      <select
        ref={ref}
        id={id ?? name}
        name={name}
        aria-invalid={Boolean(error)}
        className={cn(control, tone(Boolean(error)), 'appearance-none bg-[length:16px] bg-[right_0.75rem_center] bg-no-repeat pr-9', className)}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        }}
        {...rest}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  ),
);
Select.displayName = 'Select';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  description?: string;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ label, description, id, name, className, ...rest }, ref) => (
  <label htmlFor={id ?? name} className={cn('flex cursor-pointer items-start justify-between gap-4', className)}>
    <span>
      <span className="block text-sm font-semibold text-slate-700">{label}</span>
      {description && <span className="block text-xs text-slate-500">{description}</span>}
    </span>
    <span className="relative inline-flex shrink-0">
      <input ref={ref} id={id ?? name} name={name} type="checkbox" className="peer sr-only" {...rest} />
      <span className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-brand-600 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-300" />
      <span className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
    </span>
  </label>
));
Switch.displayName = 'Switch';
