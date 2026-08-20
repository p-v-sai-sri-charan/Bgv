import type { SVGProps } from "react";

/**
 * Minimal hand-rolled stroke icon set (no external icon library dependency).
 * All icons default to `currentColor` — set text color on the wrapper/props
 * to recolor (e.g. `className="text-blue-900"`).
 */
function iconProps(props: SVGProps<SVGSVGElement>): SVGProps<SVGSVGElement> {
  return {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props,
  };
}

export function IconLayoutDashboard(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" />
    </svg>
  );
}

export function IconUsers(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19" />
      <circle cx="9" cy="8" r="3.25" />
      <path d="M17 19v-1.5a3.5 3.5 0 0 0-2.3-3.29" />
      <path d="M14.5 5.1a3.25 3.25 0 0 1 0 6.3" />
    </svg>
  );
}

export function IconFileCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M8 3h6l4 4v12.5A1.5 1.5 0 0 1 16.5 21h-9A1.5 1.5 0 0 1 6 19.5V4.5A1.5 1.5 0 0 1 8 3Z" />
      <path d="M14 3v4h4" />
      <path d="m9.5 14 2 2 3.5-3.75" />
    </svg>
  );
}

export function IconShieldCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 3 5 5.75V11c0 4.5 3 7.75 7 9 4-1.25 7-4.5 7-9V5.75L12 3Z" />
      <path d="m9 12 2 2 4-4.25" />
    </svg>
  );
}

export function IconUserCog(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="9" cy="7.5" r="3.25" />
      <path d="M3.5 19v-1a4.5 4.5 0 0 1 4.5-4.5h2" />
      <circle cx="17.5" cy="16.5" r="2.25" />
      <path d="M17.5 12.75v.9M17.5 19.35v.9M20.65 14.6l-.78.45M14.63 18.15l-.78.45M20.65 18.4l-.78-.45M14.63 14.85l-.78-.45" />
    </svg>
  );
}

export function IconBuilding(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <rect x="4" y="3" width="12" height="18" rx="1" />
      <path d="M16 8h4v13h-4" />
      <path d="M8 7h.01M12 7h.01M8 11h.01M12 11h.01M8 15h.01M12 15h.01" />
    </svg>
  );
}

export function IconClipboardList(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <rect x="6" y="4" width="12" height="17" rx="1.5" />
      <rect x="9" y="2.5" width="6" height="3" rx="1" />
      <path d="M9 11h6M9 14.5h6M9 18h4" />
    </svg>
  );
}

export function IconClock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}
