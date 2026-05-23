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

export function IconWhatsApp(props: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      focusable={false}
      {...props}
    >
      <path d="M19.05 4.91A10 10 0 0 0 2.05 16l-1 4.94a1 1 0 0 0 1.22 1.22L7.21 21A10 10 0 0 0 19.05 4.91Zm-7 15.5a8.4 8.4 0 0 1-4.27-1.17l-.3-.18-2.96.65.66-2.88-.2-.31a8.42 8.42 0 1 1 7.07 3.89Zm4.62-6.3c-.25-.13-1.49-.74-1.72-.82-.23-.08-.4-.13-.56.13-.17.25-.65.82-.8.99-.15.17-.3.19-.55.06-.25-.13-1.06-.39-2.02-1.24-.75-.66-1.25-1.48-1.4-1.73-.15-.25-.02-.39.11-.51.11-.11.25-.3.38-.45.13-.15.17-.26.25-.43.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.86-.2-.49-.41-.42-.56-.43-.14-.01-.31-.01-.48-.01a.92.92 0 0 0-.67.31c-.23.25-.87.85-.87 2.07 0 1.21.89 2.39 1.02 2.55.13.17 1.75 2.66 4.23 3.73.59.26 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.49-.61 1.7-1.2.21-.59.21-1.09.15-1.2-.06-.11-.23-.17-.48-.3Z" />
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
