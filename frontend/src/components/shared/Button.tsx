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
    bg-orange-500 text-white
    hover:bg-orange-400
    active:bg-orange-600
    disabled:bg-orange-500/50
  `,
  secondary: `
    bg-transparent text-orange-300
    border border-orange-500/40
    hover:bg-orange-500/10 hover:border-orange-400
    active:bg-orange-500/20
    disabled:border-orange-500/20 disabled:text-orange-300/50
  `,
  ghost: `
    bg-transparent text-zinc-300
    hover:bg-white/5 hover:text-white
    active:bg-white/10
    disabled:text-zinc-500
  `,
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-8 py-4 text-lg gap-2.5',
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
    font-medium rounded-lg
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
