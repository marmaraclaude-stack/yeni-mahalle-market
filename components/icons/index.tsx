import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base: SVGProps<SVGSVGElement> = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
};

export function IconApple(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M32 18c-4-6-12-6-15 0-3 6 0 18 7 24 3 2 6 2 8 0 2 2 5 2 8 0 7-6 10-18 7-24-3-6-11-6-15 0z" />
      <path d="M32 18c0-4 2-7 5-9" />
      <path d="M32 18c-1-3-3-5-6-6" />
    </svg>
  );
}

export function IconBread(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 32c0-7 6-12 14-12h12c8 0 14 5 14 12 0 4-3 7-7 7H19c-4 0-7-3-7-7z" />
      <path d="M20 32l3-5M28 32l3-5M36 32l3-5M44 32l3-5" />
      <path d="M16 39v6M48 39v6" />
    </svg>
  );
}

export function IconBasket(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M10 22h44l-4 24a4 4 0 0 1-4 3H18a4 4 0 0 1-4-3L10 22z" />
      <path d="M22 22l8-12M42 22l-8-12" />
      <path d="M22 30v10M32 30v10M42 30v10" />
    </svg>
  );
}

export function IconScooter(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="16" cy="46" r="6" />
      <circle cx="48" cy="46" r="6" />
      <path d="M22 46h20" />
      <path d="M16 46l8-22h8l8 22" />
      <path d="M32 24v-8h6" />
      <path d="M40 16l4-4h6" />
    </svg>
  );
}

export function IconPhone(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="18" y="8" width="28" height="48" rx="5" />
      <path d="M28 50h8" />
      <path d="M18 16h28M18 44h28" />
    </svg>
  );
}

export function IconClock(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="32" cy="32" r="22" />
      <path d="M32 16v16l10 6" />
      <path d="M32 8v3M32 53v3M8 32h3M53 32h3" />
    </svg>
  );
}

export function IconInstagram(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

export function IconDirections(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
      {...props}
    >
      <path d="M12 21s-7-6.4-7-12a7 7 0 0 1 14 0c0 5.6-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function IconArrow(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

export function Mark(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      focusable={false}
      {...props}
    >
      <path d="M8 24c4-12 28-12 32 0" />
      <path d="M8 24c4 12 28 12 32 0" />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </svg>
  );
}
