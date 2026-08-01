"use client";

import Link from "next/link";
import { useAuthStore } from "./store/authStore";

export default function NotFound() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="min-h-screen bg-[#000000] text-[#e5e2e1] flex flex-col items-center justify-center p-6 select-none font-mono">
      <div className="max-w-md w-full flex flex-col items-center text-center">
        {/* Simple 404 Text */}
        <h1 className="text-8xl font-bold tracking-tight text-[#ff3100]">
          404
        </h1>

        <h2 className="text-lg font-semibold uppercase tracking-wider mt-4 text-[#e5e2e1]">
          Page Not Found
        </h2>

        <p className="text-xs text-[#e5e2e1]/65 max-w-xs mt-3 leading-relaxed">
          The requested address does not exist or has been moved.
        </p>

        {/* Action Button */}
        <Link
          href={isLoggedIn ? "/dash" : "/"}
          className="mt-8 px-5 py-2.5 bg-[#ff3100] text-white hover:bg-[#ff451a] font-bold text-xs rounded transition-all select-none duration-150 cursor-pointer"
        >
          {isLoggedIn ? "Go to Dashboard" : "Go to Home"}
        </Link>
      </div>
    </div>
  );
}
