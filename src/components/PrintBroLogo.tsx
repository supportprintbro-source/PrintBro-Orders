import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  variant?: 'vertical' | 'horizontal' | 'mark-only';
  theme?: 'navy' | 'light';
}

/**
 * Exact vector recreation of the uploaded PrintBro official logo:
 * - Left: Vertical DNA double-helix with 4 internal rungs
 * - Center: Printer cartridge/nozzle head, falling ink droplet with crescent highlight, and solid ink dot
 * - Right: Circuit board vertical traces with 3 circular terminal nodes
 * - Wordmark: "Print" (Bold) + "Bro" (Light/Regular) + "Smart Printing for Smart Students."
 */
export const PrintBroLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = false,
  variant = 'horizontal',
  theme = 'navy',
}) => {
  const primaryColor = theme === 'navy' ? '#0B1F5C' : '#FFFFFF';
  const cutoutColor = theme === 'navy' ? '#FFFFFF' : '#0B1F5C';

  const iconDimensions = {
    sm: 32,
    md: 44,
    lg: 88,
    xl: 136,
  }[size];

  const OfficialEmblemSvg = (
    <svg
      width={iconDimensions}
      height={iconDimensions}
      viewBox="0 0 220 210"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* LEFT: DNA Double Helix */}
      <g>
        {/* Left-to-Right S-Strand */}
        <path
          d="M68 26 C67 52, 28 72, 28 106 C28 138, 66 155, 43 185 C58 164, 62 140, 40 112 C24 91, 68 62, 68 26 Z"
          fill={primaryColor}
        />
        {/* Right-to-Left Counter Strand */}
        <path
          d="M52 49 C69 72, 74 96, 56 124 C42 145, 36 160, 43 185 C33 160, 44 136, 60 114 C72 95, 65 72, 48 53 Z"
          fill={primaryColor}
        />
        {/* 4 Horizontal DNA Rungs inside the central loop */}
        <rect x="40" y="79" width="20" height="3.5" rx="1.75" fill={primaryColor} />
        <rect x="37" y="92" width="25" height="3.5" rx="1.75" fill={primaryColor} />
        <rect x="38" y="105" width="24" height="3.5" rx="1.75" fill={primaryColor} />
        <rect x="42" y="118" width="17" height="3.5" rx="1.75" fill={primaryColor} />
      </g>

      {/* CENTER: Printer Cartridge / Printhead Nozzle + Droplet + Dot */}
      <g>
        {/* Top Cartridge Body */}
        <rect x="81" y="12" width="58" height="58" rx="7" fill={primaryColor} />
        {/* Top-Right Circular Cutout */}
        <circle cx="126" cy="26" r="6" fill={cutoutColor} />
        {/* Bottom-Left Parallel Slot Cutouts */}
        <rect x="89" y="48" width="22" height="4.5" fill={cutoutColor} />
        <rect x="89" y="57" width="32" height="5" fill={cutoutColor} />
        {/* Bottom-Right Square Cutout */}
        <rect x="125" y="56" width="6.5" height="6.5" fill={cutoutColor} />

        {/* Horizontal Separation Gap is at y=70..74 */}
        {/* Tapered Nozzle Cone */}
        <path d="M84 74 H136 L116 101 H104 L84 74 Z" fill={primaryColor} />

        {/* Falling Ink Droplet */}
        <path
          d="M110 105 C110 105, 94 129, 94 140 C94 149, 101.2 156, 110 156 C118.8 156, 126 149, 126 140 C126 129, 110 105, 110 105 Z"
          fill={primaryColor}
        />
        {/* Droplet Left Crescent Highlight */}
        <path
          d="M104 123 C99 132, 98.5 141, 104 148 C101.5 142, 102.5 133, 106.5 125 Z"
          fill={cutoutColor}
        />

        {/* Bottom Solid Ink Circle */}
        <circle cx="110" cy="180" r="19.5" fill={primaryColor} />
      </g>

      {/* RIGHT: Tech Circuit Board Traces & Nodes */}
      <g stroke={primaryColor} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Main Vertical Spine */}
        <line x1="176" y1="45" x2="176" y2="85" />
        {/* Upper-Left Branch to Node 1 */}
        <path d="M176 74 L164 74 L164 67" fill="none" />
        <circle cx="164" cy="62" r="4.5" fill={cutoutColor} stroke={primaryColor} strokeWidth="3.2" />

        {/* Mid-Left Branch to Node 2 & Node 3 */}
        <path d="M198 95 L168 95 L157 106 L150 106" fill="none" />
        <circle cx="145" cy="106" r="4.5" fill={cutoutColor} stroke={primaryColor} strokeWidth="3.2" />

        <path d="M168 95 L176 104 L161 120 L157 125" fill="none" />
        <circle cx="153" cy="129" r="4.5" fill={cutoutColor} stroke={primaryColor} strokeWidth="3.2" />

        {/* Lower Spine & Parallel Right-Angle Traces */}
        <path d="M198 106 L181 106 L176 112 L176 196" fill="none" />
        {/* Top-Right L-Trace */}
        <path d="M187 57 L187 84 L198 84" fill="none" />
        {/* Bottom-Right L-Traces */}
        <path d="M185 132 L185 162" fill="none" />
        <path d="M185 117 L199 117" fill="none" />
        <path d="M190 144 L190 183" fill="none" />
        <path d="M190 144 L200 144" fill="none" />
      </g>
    </svg>
  );

  if (variant === 'mark-only') {
    return <div className={`inline-flex items-center ${className}`}>{OfficialEmblemSvg}</div>;
  }

  if (variant === 'vertical') {
    return (
      <div className={`inline-flex flex-col items-center text-center select-none ${className}`}>
        {OfficialEmblemSvg}
        <div
          className="mt-2 tracking-tight leading-none"
          style={{ color: primaryColor, fontFamily: 'var(--font-display)' }}
        >
          <span className="font-bold text-3xl sm:text-4xl">Print </span>
          <span className="font-normal text-3xl sm:text-4xl">Bro</span>
        </div>
        {showTagline && (
          <p
            className="mt-1.5 text-xs sm:text-sm font-normal tracking-normal"
            style={{ color: theme === 'navy' ? '#1E293B' : '#E2E8F0' }}
          >
            Smart Printing for Smart Students.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {OfficialEmblemSvg}
      <span
        className="text-xl font-bold tracking-tight whitespace-nowrap"
        style={{ color: primaryColor, fontFamily: 'var(--font-display)' }}
      >
        Print<span className="font-normal">Bro</span>
      </span>
    </div>
  );
};
