"use client";

import React from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

export default function WorkspaceHomePage() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-aergus-bg text-aergus-text selection:bg-aergus-primary selection:text-white font-sans">
      <Sidebar activeId="home" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-aergus-xl">
          <h1 className="text-xl font-bold tracking-tight text-aergus-text">
            hello jiii kese ho
          </h1>
          <p className="text-[12.5px] text-aergus-text opacity-[var(--aergus-text-dim)] font-mono mt-aergus-xs">
            Welcome back to your workspace.
          </p>
        </main>
      </div>
    </div>
  );
}
