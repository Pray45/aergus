"use client";

import React from "react";
import Sidebar from "../../../components/Sidebar";
import Header from "../../../components/Header";

interface PageProps {
  params: Promise<{
    slug: string;
    subpath: string[];
  }>;
}

export default function WorkspaceSubpathPage({ params }: PageProps) {
  const { subpath } = React.use(params);
  const path = "/" + subpath.join("/");

  const getPageMeta = () => {
    return {
      title: subpath
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" > "),
      description: "Secure instance module.",
    };
  };

  const meta = getPageMeta();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-aergus-bg text-aergus-text selection:bg-aergus-primary selection:text-white font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-aergus-xl">
          <h1 className="text-xl font-bold tracking-tight text-aergus-text">
            {meta.title}
          </h1>
          <p className="text-[12.5px] text-aergus-text opacity-[var(--aergus-text-dim)] font-mono mt-aergus-xs">
            {meta.description}
          </p>
        </main>
      </div>
    </div>
  );
}
