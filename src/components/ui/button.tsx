import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  primary:
    "bg-brand-600 text-brand-foreground shadow-sm hover:bg-brand-700 active:bg-brand-700 disabled:bg-brand-300 disabled:shadow-none",
  secondary:
    "bg-surface text-foreground border border-border-strong shadow-xs hover:bg-surface-muted hover:border-brand-300 disabled:text-muted-foreground disabled:hover:bg-surface",
  subtle:
    "bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:text-brand-300",
  danger:
    "bg-red-600 text-white shadow-sm hover:bg-red-700 disabled:bg-red-300 disabled:shadow-none",
  ghost:
    "text-muted hover:bg-surface-sunken hover:text-foreground disabled:text-muted-foreground",
} as const;

const SIZES = {
  sm: "h-8 px-3 text-[13px] rounded-md",
  md: "h-10 px-4 text-sm rounded-lg",
  lg: "h-12 px-6 text-[15px] rounded-lg",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", type = "button", ...props },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex select-none items-center justify-center gap-2 font-medium",
        "transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out",
        "hover:-translate-y-px active:translate-y-0 active:scale-[0.985]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:translate-y-0 disabled:active:scale-100",
        SIZES[size],
        VARIANTS[variant],
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
