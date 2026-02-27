import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { Link } from 'react-router-dom';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-br from-slate-100 via-white to-slate-300
    text-black font-bold
    hover:from-white hover:to-slate-200
    hover:shadow-[0_0_24px_rgba(59,130,246,0.18),0_0_8px_rgba(59,130,246,0.12)]
    active:scale-[0.98]
    shadow-[0_0_20px_rgba(255,255,255,0.1)]
    disabled:opacity-50
  `,
  secondary: `
    bg-white/5 text-white
    border border-white/10
    hover:bg-white/10 hover:border-white/20
    active:bg-white/15
    disabled:opacity-50
  `,
  ghost: `
    bg-transparent text-zinc-300
    hover:bg-white/5 hover:text-white
    active:bg-white/10
    disabled:text-zinc-500
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5 rounded-lg',
  md: 'px-6 py-3 text-base gap-2 rounded-xl',
  lg: 'px-8 py-4 text-lg gap-2.5 rounded-2xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  icon,
  iconPosition = 'left',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center
    transition-all duration-200
    disabled:cursor-not-allowed
  `;

  const combinedStyles = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `.trim();

  const content = (
    <>
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && icon && iconPosition === 'left' && icon}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && icon}
    </>
  );

  if (href) {
    return (
      <Link to={href} className={combinedStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={combinedStyles}
      disabled={disabled || isLoading}
      {...props}
    >
      {content}
    </button>
  );
}
