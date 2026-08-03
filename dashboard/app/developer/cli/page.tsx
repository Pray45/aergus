"use client";

import React from "react";
import { Terminal } from "lucide-react";

export default function DeveloperCli() {
  return (
    <div className="font-mono text-aergus-text min-h-[70vh] flex flex-col items-center justify-center relative">
      <div className="max-w-md text-center space-y-4">
        <div className="w-12 h-12 bg-aergus-primary/10 text-aergus-primary border border-aergus-primary/25 rounded flex items-center justify-center mx-auto animate-pulse">
          <Terminal className="w-6 h-6" />
        </div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-aergus-text">
          Command Line Interface (CLI)
        </h2>
        <p className="text-xs text-aergus-text-dim leading-relaxed uppercase tracking-tight">
          Manage resources, query logs, and trigger automation rules directly from your terminal shell.
        </p>
        <div className="pt-2">
          <pre className="p-3 bg-aergus-bg border border-aergus-border rounded text-[10px] text-aergus-primary inline-block text-left font-mono">
            npm install -g @aergus/cli
          </pre>
        </div>
        <div className="pt-2">
          <span className="px-3 py-1.5 border border-aergus-border rounded text-[9px] text-aergus-text font-bold uppercase tracking-wider bg-aergus-card">
            STATUS: COMPILING BINARIES • ESTIMATED Q4 2026
          </span>
        </div>
      </div>
    </div>
  );
}
