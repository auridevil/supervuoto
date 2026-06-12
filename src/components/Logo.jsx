// SUPERVUOTO sigil — a black-hole void mark.
// Concentric broken orbital rings, occult tick-runes, a perfect black void disc
// wrapped in a thin glowing accretion ring. The outer ring group rotates slowly.

export default function Logo({ size = 64 }) {
  return (
    <svg
      className="logo-mark"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="SUPERVUOTO void sigil"
    >
      <defs>
        {/* nebula purple -> signal cyan sweep for the accretion ring */}
        <linearGradient
          id="sv-accretion"
          x1="8"
          y1="20"
          x2="92"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#7c3aed" />
          <stop offset="0.55" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#22d3ee" />
        </linearGradient>

        {/* faint cold gradient for the outer broken orbitals */}
        <linearGradient
          id="sv-orbit"
          x1="92"
          y1="12"
          x2="8"
          y2="88"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>

        {/* soft halo bleeding out of the event horizon */}
        <radialGradient id="sv-halo" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.55" stopColor="#7c3aed" stopOpacity="0" />
          <stop offset="0.78" stopColor="#7c3aed" stopOpacity="0.35" />
          <stop offset="0.92" stopColor="#22d3ee" stopOpacity="0.18" />
          <stop offset="1" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>

        {/* the void itself: not flat black — black with deeper black inside */}
        <radialGradient id="sv-void" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0" stopColor="#050208" />
          <stop offset="0.8" stopColor="#020104" />
          <stop offset="1" stopColor="#000000" />
        </radialGradient>
      </defs>

      {/* ambient halo */}
      <circle cx="50" cy="50" r="48" fill="url(#sv-halo)" />

      {/* ── outer ritual ring: broken orbitals + tick-runes, slowly turning ── */}
      <g opacity="0.9">
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="90s"
          repeatCount="indefinite"
        />

        {/* broken orbital arcs at irregular sweeps */}
        <g stroke="url(#sv-orbit)" strokeLinecap="round" fill="none">
          <circle
            cx="50"
            cy="50"
            r="44"
            strokeWidth="1"
            strokeDasharray="52 18 9 30 4 40 21 14"
            opacity="0.85"
          />
          <circle
            cx="50"
            cy="50"
            r="38.5"
            strokeWidth="0.7"
            strokeDasharray="6 27 71 11 38 19 3 33"
            opacity="0.6"
          />
        </g>

        {/* occult tick-marks at irregular angles around the rim */}
        <g stroke="#22d3ee" strokeWidth="1.1" strokeLinecap="round">
          <line x1="50" y1="3.5" x2="50" y2="9" transform="rotate(13 50 50)" />
          <line x1="50" y1="4.5" x2="50" y2="8" transform="rotate(67 50 50)" />
          <line x1="50" y1="3" x2="50" y2="10" transform="rotate(118 50 50)" stroke="#7c3aed" />
          <line x1="50" y1="5" x2="50" y2="8.5" transform="rotate(151 50 50)" />
          <line x1="50" y1="4" x2="50" y2="9.5" transform="rotate(199 50 50)" stroke="#a78bfa" />
          <line x1="50" y1="4.5" x2="50" y2="8" transform="rotate(241 50 50)" />
          <line x1="50" y1="3" x2="50" y2="9" transform="rotate(286 50 50)" stroke="#7c3aed" />
          <line x1="50" y1="5" x2="50" y2="8" transform="rotate(331 50 50)" />
        </g>

        {/* small geometric runes orbiting with the ring */}
        <g fill="none" strokeWidth="0.9" strokeLinejoin="round">
          {/* hollow triangle rune */}
          <path
            d="M50 1.8 L52.6 6.4 L47.4 6.4 Z"
            stroke="#a78bfa"
            transform="rotate(43 50 50)"
          />
          {/* tilted square rune */}
          <rect
            x="48.2"
            y="3.2"
            width="3.6"
            height="3.6"
            stroke="#22d3ee"
            transform="rotate(172 50 50) rotate(45 50 5)"
          />
          {/* lone watcher dot */}
          <circle cx="50" cy="5.2" r="1.3" stroke="#7c3aed" transform="rotate(262 50 50)" />
        </g>
      </g>

      {/* ── counter-rotating inner orbital, slower drift the other way ── */}
      <g fill="none" stroke="url(#sv-orbit)" strokeLinecap="round" opacity="0.7">
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="360 50 50"
          to="0 50 50"
          dur="140s"
          repeatCount="indefinite"
        />
        <circle
          cx="50"
          cy="50"
          r="31"
          strokeWidth="0.8"
          strokeDasharray="40 16 7 25 60 18"
        />
        <line x1="50" y1="18" x2="50" y2="21.5" stroke="#22d3ee" strokeWidth="1" transform="rotate(95 50 50)" />
        <line x1="50" y1="18.5" x2="50" y2="21" stroke="#a78bfa" strokeWidth="1" transform="rotate(207 50 50)" />
      </g>

      {/* ── accretion ring: thin, hot, glowing ── */}
      <circle
        cx="50"
        cy="50"
        r="24"
        fill="none"
        stroke="url(#sv-accretion)"
        strokeWidth="2.4"
        opacity="0.95"
      />
      {/* blurred-feel echo of the accretion ring (cheap glow without filters) */}
      <circle
        cx="50"
        cy="50"
        r="24"
        fill="none"
        stroke="#22d3ee"
        strokeWidth="5.5"
        opacity="0.12"
      />
      <circle
        cx="50"
        cy="50"
        r="24"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="9"
        opacity="0.07"
      />

      {/* ── the void disc: a perfect black nothing ── */}
      <circle cx="50" cy="50" r="20" fill="url(#sv-void)" />
      {/* hairline event-horizon rim so the void reads against dark backgrounds */}
      <circle
        cx="50"
        cy="50"
        r="20"
        fill="none"
        stroke="#a78bfa"
        strokeWidth="0.5"
        opacity="0.55"
      />

      {/* a single point of light that did not escape */}
      <circle cx="50" cy="50" r="0.9" fill="#f8fafc" opacity="0.8">
        <animate
          attributeName="opacity"
          values="0.8;0.15;0.8"
          dur="7s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
}
