"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Bell, ChevronDown, Sun, Moon } from "lucide-react";
import { useWorkspaceStore } from "../store/workspaceStore";
import { useProjectStore } from "../store/projectStore";
import { useRouter } from "next/navigation";

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const { workspaces, activeWorkspace, setActiveWorkspace } =
    useWorkspaceStore();
  const { projects, activeProject, setActiveProject } = useProjectStore();
  const router = useRouter();

  const [isWsOpen, setIsWsOpen] = useState(false);
  const [isProjOpen, setIsProjOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.remove("light");
      localStorage.setItem("aergus-theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("aergus-theme", "light");
      setTheme("light");
    }
  };

  return (
    <header className="flex h-header-height items-center justify-between border-b border-aergus-border px-aergus-xl bg-aergus-bg/95 backdrop-blur-sm z-30 select-none">
      {/* Breadcrumb Switcher */}
      <div className="flex items-center font-mono gap-aergus-sm text-xs">
        <span className="text-aergus-primary font-bold text-lg pr-aergus-xs tracking-tight">{`>`}</span>

        {/* Workspace selector */}
        <div className="relative">
          <button
            onClick={() => setIsWsOpen(!isWsOpen)}
            className="text-aergus-text-dim hover:text-aergus-text transition-colors duration-200 flex items-center gap-1 uppercase font-bold tracking-wider"
          >
            {activeWorkspace?.name || "Select Workspace"}
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {isWsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsWsOpen(false)}
              />
              <div className="absolute top-[28px] left-0 bg-aergus-card border border-aergus-border rounded shadow-2xl z-50 py-aergus-xs min-w-[180px] animate-in fade-in zoom-in-95 duration-100">
                {workspaces.map((ws) => (
                  <div
                    key={ws.id}
                    onClick={() => {
                      setActiveWorkspace(ws);
                      setIsWsOpen(false);
                      router.push(`/workspace/projects`);
                    }}
                    className={`px-aergus-md py-aergus-sm text-[12px] cursor-pointer hover:bg-aergus-text/[0.03] transition-colors ${activeWorkspace?.id === ws.id ? "text-aergus-primary font-medium bg-aergus-primary/5" : "text-aergus-text-dim hover:text-aergus-text"}`}
                  >
                    {ws.name}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        {activeProject && (
          <>
            <span className="text-aergus-border">/</span>

            {/* Project selector */}
            <div className="relative">
              <button
                onClick={() => setIsProjOpen(!isProjOpen)}
                className="text-aergus-primary hover:text-aergus-primary-hover transition-colors duration-200 flex items-center gap-1 uppercase font-bold tracking-wider"
              >
                {activeProject?.name}
                <ChevronDown className="w-3.5 h-3.5 opacity-80" />
              </button>

              {isProjOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProjOpen(false)}
                  />
                  <div className="absolute top-[28px] left-0 bg-aergus-card border border-aergus-border rounded shadow-2xl z-50 py-aergus-xs min-w-[180px] animate-in fade-in zoom-in-95 duration-100">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        onClick={() => {
                          setActiveProject(proj);
                          setIsProjOpen(false);
                          if (activeWorkspace) {
                            router.push(
                              `/w/${activeWorkspace.slug}/p/${proj.slug}/dashboard`,
                            );
                          }
                        }}
                        className={`px-aergus-md py-aergus-sm text-[12px] cursor-pointer hover:bg-aergus-text/[0.03] transition-colors ${activeProject?.id === proj.id ? "text-aergus-primary font-medium bg-aergus-primary/5" : "text-aergus-text-dim hover:text-aergus-text"}`}
                      >
                        {proj.name}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      <div className="h-full flex w-1/2 justify-end items-center gap-aergus-lg">
        {/* search bar */}
        <div className="flex w-1/2 relative group">
          <input
            type="search"
            placeholder="Search resources, metrics, logs..."
            className="w-full h-8 px-aergus-md self-center border border-aergus-border rounded bg-aergus-card/20 text-xs focus:outline-none focus:border-aergus-primary transition-all duration-200 font-mono text-aergus-text placeholder:text-aergus-text-dim/40"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-0.5 pointer-events-none opacity-40 font-mono text-[9px] select-none">
            <kbd className="border border-aergus-border bg-aergus-bg px-1 rounded">
              ⌘
            </kbd>
            <kbd className="border border-aergus-border bg-aergus-bg px-1 rounded">
              K
            </kbd>
          </div>
        </div>

        <button className="h-8 px-aergus-md border cursor-pointer hover:bg-aergus-primary/10 border-aergus-border rounded text-aergus-text-dim text-xs font-mono transition-colors">
          <span className="text-aergus-text font-bold">LOG FEED</span>
        </button>

        {/* divider */}
        <div className="w-[1px] bg-aergus-border h-1/2"></div>

        <div className="flex items-center gap-aergus-md">
          {/* theme toggle button */}
          <button
            onClick={toggleTheme}
            className="p-aergus-sm rounded hover:bg-aergus-card transition-all duration-200 text-aergus-text-dim hover:text-aergus-text cursor-pointer group active:scale-95 flex items-center justify-center"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110" />
            ) : (
              <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" />
            )}
          </button>

          {/* notification button */}
          <button className="p-aergus-sm rounded hover:bg-aergus-card transition-colors relative cursor-pointer group">
            <Bell className="w-4 h-4 text-aergus-text-dim group-hover:text-aergus-text" />
            <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-aergus-primary rounded-full" />
          </button>

          {/* profile picture or icon */}
          {user?.avatar ? (
            <img
              src={user.avatar}
              className="rounded-full w-7 h-7 object-cover border border-aergus-border hover:border-aergus-primary transition-all duration-200"
            />
          ) : (
            <div className="rounded-full w-7 h-7 bg-aergus-text border border-aergus-border flex items-center justify-center hover:border-aergus-primary transition-all duration-200 select-none cursor-pointer">
              <span className="text-aergus-bg text-xs font-bold font-mono uppercase">
                {user?.userName?.charAt(0) || "?"}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
