import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5.5 3.5h3l1.6 4-2 1.3a11.5 11.5 0 0 0 6.1 6.1l1.3-2 4 1.6v3a2 2 0 0 1-2.1 2A16.5 16.5 0 0 1 3.5 5.6a2 2 0 0 1 2-2.1Z" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function PinIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21s-6.5-6-6.5-11a6.5 6.5 0 0 1 13 0c0 5-6.5 11-6.5 11Z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </svg>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14m0 0-6-6m6 6 6-6" />
    </svg>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14m0 0-6-6m6 6-6 6" />
    </svg>
  );
}

/** Takeaway bag with a bowl and chopsticks, as on the flyer. */
export function TakeawayIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.6} {...props}>
      <path d="M6 8.5h12l1 12H5l1-12Z" />
      <path d="M9 8.5V7a3 3 0 0 1 6 0v1.5" />
      <path d="M8.5 14.5h7a3.5 3.5 0 0 1-7 0Z" />
      <path d="m10 11 5-3M12 11.5l4-3" />
    </svg>
  );
}

/** Table and two chairs, as on the flyer. */
export function TableIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.6} {...props}>
      <path d="M3 9h18M12 9v10M8 19h8" />
      <path d="M3 6v12M5.5 13h2M21 6v12M16.5 13h2" />
    </svg>
  );
}

export function HeartIcon(props: IconProps) {
  return (
    <svg {...base} strokeWidth={1.6} {...props}>
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}
