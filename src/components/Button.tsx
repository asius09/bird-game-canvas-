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
        boxShadow: COLORS.shadow,
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
