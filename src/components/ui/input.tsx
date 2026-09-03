import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "block w-full rounded-lg border border-border-strong bg-surface px-3.5 text-sm text-foreground shadow-xs " +
  "transition-[border-color,box-shadow] duration-150 ease-out " +
  "placeholder:text-muted-foreground " +
  "focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 " +
  "disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      fieldBase,
      "h-10",
      type === "file" &&
        "cursor-pointer py-2 file:mr-3 file:rounded-md file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-brand-700 hover:file:bg-brand-100",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 3, ...props }, ref) => (
  <textarea
    ref={ref}
    rows={rows}
    className={cn(fieldBase, "py-2.5 leading-relaxed", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-1.5 block text-[13px] font-medium text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(fieldBase, "h-10 appearance-none bg-no-repeat pr-9", className)}
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%237a8494' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
      backgroundPosition: "right 0.65rem center",
    }}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
