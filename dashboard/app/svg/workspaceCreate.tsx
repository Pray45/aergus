import React from 'react';
import "./svg.css"
/**
 * Air-Gapped Architecture Schematic Component
 * Exact visual match to the original schematic diagram.
 */
export default function CreateWorkspaceSVG() {
  // Center coordinates
  const cx = 500;
  const cy = 375;

  return (
    <div className="w-full bg-[#111215] text-[#cfd4dc] flex items-center justify-center p-4 select-none overflow-hidden font-mono">
      <div className="relative w-full aspect-[4/3] max-w-5xl max-h-[92vh] flex items-center justify-center">
        <svg
          viewBox="0 0 1000 750"
          className="w-full object-contain overflow-visible"
        >
          <defs>
            {/* Red glow filter for icons and severed labels */}
            <filter id="red-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            {/* Green glow filter for rig active text */}
            <filter id="green-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. BACKGROUND GRID GUIDELINES */}
          {/* Horizontal lines */}
          <line
            x1="0"
            y1="190"
            x2="1000"
            y2="190"
            stroke="#1b1e24"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1="560"
            x2="1000"
            y2="560"
            stroke="#1b1e24"
            strokeWidth="1"
          />

          {/* Vertical dashed lines */}
          <line
            x1="250"
            y1="0"
            x2="250"
            y2="750"
            stroke="#242831"
            strokeWidth="1"
            strokeDasharray="6 6"
          />
          <line
            x1="500"
            y1="0"
            x2="500"
            y2="750"
            stroke="#2d323c"
            strokeWidth="1.2"
            strokeDasharray="6 6"
          />
          <line
            x1="750"
            y1="0"
            x2="750"
            y2="750"
            stroke="#242831"
            strokeWidth="1"
            strokeDasharray="6 6"
          />

          {/* 2. CONCENTRIC ELLIPTICAL ORBITS */}
          {/* Outer Ellipse */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={520}
            ry={330}
            fill="none"
            stroke="#22252c"
            strokeWidth="1"
          />

          {/* Middle Ellipse */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={430}
            ry={260}
            fill="none"
            stroke="#252932"
            strokeWidth="1.1"
          />

          {/* Inner Ellipse */}
          <ellipse
            cx={cx}
            cy={cy}
            rx={340}
            ry={190}
            fill="none"
            stroke="#22252c"
            strokeWidth="1"
          />

          {/* 3. ORBITAL PARTICLES / SATELLITES */}
          {/* Top small particle */}
          <circle cx="425" cy="190" r="4.5" fill="#585e6b" />
          {/* Right small particle */}
          <circle cx="545" cy="485" r="5.5" fill="#626875" />
          {/* Bottom small particle */}
          <circle cx="380" cy="660" r="6" fill="#4d535e" />
          {/* Bottom-left corner tiny particle */}
          <circle cx="125" cy="710" r="4.5" fill="#3b404a" />

          {/* 4. LEFT TARGET RETICLE */}
          <g id="reticle-target">
            {/* Target outer scope ring */}
            <circle
              cx="240"
              cy={cy}
              r="50"
              fill="#111215"
              stroke="#272b33"
              strokeWidth="1"
            />

            {/* Glowing Red Crossed Reticle */}
            <g filter="url(#red-glow)">
              {/* Outer reticle circle */}
              <circle
                cx="240"
                cy={cy}
                r="13"
                fill="none"
                stroke="#f87171"
                strokeWidth="1.2"
              />
              {/* Inner center ring */}
              <circle
                cx="240"
                cy={cy}
                r="4.5"
                fill="none"
                stroke="#ef4444"
                strokeWidth="1"
              />
              {/* 4 tick lines */}
              <line x1="240" y1="357" x2="240" y2="361" stroke="#f87171" strokeWidth="1.2" />
              <line x1="240" y1="389" x2="240" y2="393" stroke="#f87171" strokeWidth="1.2" />
              <line x1="222" y1="375" x2="226" y2="375" stroke="#f87171" strokeWidth="1.2" />
              <line x1="254" y1="375" x2="258" y2="375" stroke="#f87171" strokeWidth="1.2" />

              {/* Crossed X lines */}
              <line x1="231" y1="366" x2="249" y2="384" stroke="#f87171" strokeWidth="1.2" />
              <line x1="249" y1="366" x2="231" y2="384" stroke="#f87171" strokeWidth="1.2" />
            </g>
          </g>

          {/* 5. TOP SEVERED CONNECTION */}
          <g id="top-connection">
            {/* Dotted Red Line */}
            <line
              x1="500"
              y1="216"
              x2="500"
              y2="335"
              stroke="#ef4444"
              strokeWidth="1.2"
              strokeDasharray="2 3"
              strokeOpacity="0.85"
            />

            {/* Red Cross X */}
            <g filter="url(#red-glow)">
              <line
                x1="492"
                y1="253"
                x2="508"
                y2="269"
                stroke="#f87171"
                strokeWidth="1.6"
                strokeLinecap="square"
              />
              <line
                x1="508"
                y1="253"
                x2="492"
                y2="269"
                stroke="#f87171"
                strokeWidth="1.6"
                strokeLinecap="square"
              />
            </g>

            {/* Text SEVERED */}
            <text
              x="500"
              y="283"
              textAnchor="middle"
              fill="#f87171"
              fontSize="11"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="0.25em"
              fontWeight="500"
            >
              SEVERED
            </text>
          </g>

          {/* 6. BOTTOM SEVERED CONNECTION */}
          <g id="bottom-connection">
            {/* Dotted Red Line */}
            <line
              x1="500"
              y1="435"
              x2="500"
              y2="550"
              stroke="#ef4444"
              strokeWidth="1.2"
              strokeDasharray="2 3"
              strokeOpacity="0.85"
            />

            {/* Red Cross X */}
            <g filter="url(#red-glow)">
              <line
                x1="492"
                y1="475"
                x2="508"
                y2="491"
                stroke="#f87171"
                strokeWidth="1.6"
                strokeLinecap="square"
              />
              <line
                x1="508"
                y1="475"
                x2="492"
                y2="491"
                stroke="#f87171"
                strokeWidth="1.6"
                strokeLinecap="square"
              />
            </g>

            {/* Text SEVERED */}
            <text
              x="500"
              y="505"
              textAnchor="middle"
              fill="#f87171"
              fontSize="11"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="0.25em"
              fontWeight="500"
            >
              SEVERED
            </text>
          </g>

          {/* 7. TOP NODE: CLOUD SERVERS */}
          <g id="cloud-servers">
            <rect
              x="395"
              y="166"
              width="210"
              height="50"
              fill="#16181d"
              stroke="#30343d"
              strokeWidth="1"
            />
            <text
              x="500"
              y="197"
              textAnchor="middle"
              fill="#cfd4dc"
              fontSize="14"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="0.22em"
              fontWeight="400"
            >
              CLOUD SERVERS
            </text>
          </g>

          {/* 8. CENTER NODE: YOUR MACHINE */}
          <g id="your-machine">
            <rect
              x="365"
              y="335"
              width="270"
              height="100"
              fill="#16181d"
              stroke="#333740"
              strokeWidth="1.2"
            />
            <text
              x="500"
              y="377"
              textAnchor="middle"
              fill="#e2e8f0"
              fontSize="18"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="0.24em"
              fontWeight="500"
            >
              YOUR MACHINE
            </text>
            <g filter="url(#green-glow)">
              <text
                x="500"
                y="408"
                textAnchor="middle"
                fontSize="12.5"
                fontFamily="JetBrains Mono, monospace"
                letterSpacing="0.18em"
                fontWeight="500"
                fill="#4ade80"
              >
                ✓ RIG MODEL ACTIVE
              </text>
            </g>
          </g>

          {/* 9. BOTTOM NODE: NOTHING LEAVES */}
          <g id="nothing-leaves">
            <rect
              x="388"
              y="550"
              width="224"
              height="50"
              fill="#16181d"
              stroke="#30343d"
              strokeWidth="1"
            />
            <text
              x="500"
              y="581"
              textAnchor="middle"
              fill="#cfd4dc"
              fontSize="14"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="0.22em"
              fontWeight="400"
            >
              NOTHING LEAVES
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
