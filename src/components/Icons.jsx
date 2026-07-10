// Minimal inline platform glyphs — 1em, currentColor, sit beside link text.

function Svg({ children, ...props }) {
  return (
    <svg
      className="icon"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function SoundcloudIcon() {
  return (
    <Svg fill="currentColor">
      <rect x="0.6" y="13" width="1.7" height="5" rx="0.85" />
      <rect x="3.5" y="11" width="1.7" height="7" rx="0.85" />
      <rect x="6.4" y="9.5" width="1.7" height="8.5" rx="0.85" />
      <rect x="9.3" y="10.5" width="1.7" height="7.5" rx="0.85" />
      <path d="M12.6 18 V8.4 c0.9-0.5 2-0.8 3.1-0.8 a6 6 0 0 1 5.9 4.9 a3.3 3.3 0 0 1-1 6.5 h-8 Z" />
    </Svg>
  );
}

export function MixcloudIcon() {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 18.5 a4.2 4.2 0 1 1 .7-8.35 A5.6 5.6 0 0 1 18.5 9.2 a4.1 4.1 0 0 1-.9 8.1 Z" />
      <path d="M9.5 14.8 v-2.6 M12.5 15.5 v-4 M15.5 14.8 v-2.6" strokeLinecap="round" />
    </Svg>
  );
}

export function YoutubeIcon() {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9.4 L16 12 L10 14.6 Z" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export function WandererIcon() {
  return (
    <Svg fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4.4" />
      <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(-28 12 12)" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none" />
    </Svg>
  );
}

export const PLATFORM_ICONS = {
  wanderer: WandererIcon,
  youtube: YoutubeIcon,
  soundcloud: SoundcloudIcon,
  mixcloud: MixcloudIcon,
};
