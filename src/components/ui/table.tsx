import { cn } from "@/lib/utils";

export function Table({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-x-auto">
      <table className={cn("w-full text-left text-sm", className)}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <thead className={cn("border-b border-slate-200", className)}>
      {children}
    </thead>
  );
}

export function TableBody({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <tbody className={className}>{children}</tbody>;
}

export function TableRow({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <tr
      className={cn(
        "border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50/75",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function TableHeaderCell({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <th
      className={cn(
        "whitespace-nowrap pb-3 pr-4 text-xs font-semibold uppercase tracking-wide text-slate-500",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <td className={cn("whitespace-nowrap py-3 pr-4 text-slate-700", className)}>
      {children}
    </td>
  );
}
