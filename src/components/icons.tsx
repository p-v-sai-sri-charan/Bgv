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

export function IconArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function IconCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="m5 12.5 4.5 4.5L19 7" />
    </svg>
  );
}

export function IconSparkles(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 4.5 13.6 9 18 10.6 13.6 12.2 12 16.7 10.4 12.2 6 10.6 10.4 9 12 4.5Z" />
      <path d="M18.5 15.5l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7.7-1.9Z" />
      <path d="M5.5 4l.6 1.6L7.7 6.2 6.1 6.8 5.5 8.4 4.9 6.8 3.3 6.2 4.9 5.6 5.5 4Z" />
    </svg>
  );
}

export function IconLock(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
      <path d="M12 14.5v2.5" />
    </svg>
  );
}

export function IconMenu(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconX(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function IconScanFace(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2" />
      <path d="M9 10h.01M15 10h.01M9.5 14.5s1 1 2.5 1 2.5-1 2.5-1" />
    </svg>
  );
}

export function IconRefresh(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4.5 9a7.5 7.5 0 0 1 12.9-3.2L20 8" />
      <path d="M20 4v4h-4" />
      <path d="M19.5 15a7.5 7.5 0 0 1-12.9 3.2L4 16" />
      <path d="M4 20v-4h4" />
    </svg>
  );
}

export function IconBell(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2.5h-15L6 16Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconGauge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 16a8 8 0 1 1 16 0" />
      <path d="M12 16 15.5 10.5" />
    </svg>
  );
}

export function IconStore(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M4 9.5 5.2 5h13.6L20 9.5" />
      <path d="M4 9.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.5" />
      <path d="M4 9.5a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0" />
      <path d="M9.5 20v-5h5v5" />
    </svg>
  );
}

export function IconBank(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M12 3.5 20 8H4l8-4.5Z" />
      <path d="M5 8v9M10 8v9M14 8v9M19 8v9" />
      <path d="M3.5 20.5h17" />
    </svg>
  );
}

export function IconFuel(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M5 21V6a2 2 0 0 1 2-2h5a2 2 0 0 1 2 2v15" />
      <path d="M4 21h11" />
      <path d="M6.5 10.5h6" />
      <path d="M14 8h2.5A1.5 1.5 0 0 1 18 9.5V16a1.5 1.5 0 0 0 3 0V9l-2.5-2.5" />
    </svg>
  );
}

export function IconFactory(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...iconProps(props)}>
      <path d="M3 21V10l6 4V10l6 4V7l3 1.5V21H3Z" />
      <path d="M7 21v-4M12 21v-4M17 21v-4" />
    </svg>
  );
}
