import { cn } from "@/lib/utils";

export function Table({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="-mx-5 overflow-x-auto">
      <table className={cn("w-full min-w-[32rem] text-sm", className)}>
        {children}
      </table>
    </div>
  );
}

export function Thead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-border text-left">{children}</tr>
    </thead>
  );
}

export function Th({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <th
      className={cn(
        "px-5 pb-2.5 text-xs font-medium uppercase tracking-wide text-muted-foreground",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Tbody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function Tr({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <tr
      className={cn(
        "border-b border-border/70 transition-colors last:border-0 hover:bg-surface-muted/60",
        className,
      )}
    >
      {children}
    </tr>
  );
}

export function Td({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <td className={cn("px-5 py-3 text-foreground", className)}>{children}</td>
  );
}
