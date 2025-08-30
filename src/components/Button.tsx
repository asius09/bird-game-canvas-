'use client';
import { COLORS } from '@/constant/theme.constant';
import { cn } from '@/lib/utils';

export function Button({
  children,
  onClick,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        `flex items-center justify-center rounded-xl font-semibold transition-all duration-150 focus:ring-2 focus:ring-yellow-400/40 focus:outline-none active:scale-97`,
        className,
        'size-16 p-5 backdrop-blur-md',
        'cursor-pointer transition-colors duration-75'
      )}
      style={{
        background: COLORS.buttonBg,
        color: COLORS.buttonText,
        border: `2px solid ${COLORS.buttonBorder}`,
        // Increased shadow for strong visibility on white backgrounds
        boxShadow:
          '0 6px 32px 0 rgba(0,0,0,0.22), 0 2.5px 12px 0 rgba(0,0,0,0.18), 0 1px 2px 0 rgba(0,0,0,0.12)',
      }}
      onMouseDown={onClick}
      onClick={onClick}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = COLORS.buttonHover)
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.buttonBg)}
      {...props}
    >
      {children}
    </button>
  );
}
