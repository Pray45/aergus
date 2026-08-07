"use client";

import { motion } from "framer-motion";

export default function AergusLoader() {
  return (
    <div className="flex items-center justify-center h-screen bg-aergus-bg">
      <div className="relative w-32 h-32">
        {/* Orange Piece */}
        <motion.div
          className="absolute"
          style={{
            width: 62,
            height: 48,
            left: 20,
            top: 60,
            background: "#ff3100",
            clipPath: "polygon(0 100%,35% 0,100% 0,75% 55%,100% 100%)",
          }}
          initial={{
            opacity: 0,
            y: 20,
            scale: 0.9,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [20, 0, 0, -20],
            scale: [0.9, 1, 1, 0.9],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.2, 0.7, 1],
          }}
        />

        {/* White Arch */}
        <svg className="absolute inset-0" viewBox="0 0 120 120">
          <motion.path
            d="M32 30 H66 A28 28 0 0 1 94 58 V102"
            fill="none"
            stroke="var(--aergus-text)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{
              pathLength: 0,
              opacity: 0,
            }}
            animate={{
              pathLength: [0, 1, 1, 0],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.3, 0.7, 1],
            }}
          />
        </svg>
      </div>
    </div>
  );
}
