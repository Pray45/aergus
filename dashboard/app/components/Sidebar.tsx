"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useWorkspaceStore } from "../store/workspaceStore";
import { useProjectStore } from "../store/projectStore";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Terminal,
  Blocks,
  Activity,
  Globe,
  FileText,
  ActivitySquare,
  ShieldAlert,
  HeartPulse,
  Sliders,
  Cpu,
} from "lucide-react";

export type NavItemData = {
  id: string;
  title: string;
  icon: React.ElementType;
  badge?: number | string;
  shortcut?: string;
  children?: NavItemData[];
  href?: string;
};

export type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};

function WorkspaceSwitcher() {
  const { workspaces, activeWorkspace, setActiveWorkspace } =
    useWorkspaceStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const currentName = activeWorkspace?.name || "Select Workspace";

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-aergus-md py-aergus-sm mb-aergus-md rounded-lg bg-aergus-text/[0.02] border border-aergus-border hover:bg-aergus-text/[0.04] cursor-pointer transition-colors select-none group"
      >
        <div className="flex items-center gap-aergus-md">
          <div className="w-7 h-7 rounded-[5px] bg-aergus-primary text-aergus-text flex items-center justify-center font-bold text-[13px] shadow-[0_0_10px_color-mix(in_srgb,var(--aergus-primary)_20%,transparent)] shrink-0">
            {currentName.charAt(0)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[12.5px] font-medium leading-none mb-aergus-xs text-aergus-text truncate max-w-[120px]">
              {currentName}
            </span>
            <span className="text-[9px] text-aergus-text-dim leading-none uppercase tracking-wider font-semibold">
              Secure Instance
            </span>
          </div>
        </div>
        <ChevronDown
          className="w-3.5 h-3.5 text-aergus-text-dim group-hover:text-aergus-text transition-colors shrink-0"
          strokeWidth={1.5}
        />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-[48px] left-0 w-full bg-aergus-bg border border-aergus-border rounded-lg shadow-2xl z-50 py-aergus-xs flex flex-col gap-aergus-xs animate-in fade-in zoom-in-95 duration-100">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                onClick={() => {
                  setActiveWorkspace(ws);
                  setIsOpen(false);
                  router.push(`/workspace/projects`);
                }}
                className={`px-aergus-md py-aergus-sm mx-aergus-xs text-[12.5px] rounded-md cursor-pointer transition-colors ${activeWorkspace?.id === ws.id ? "bg-aergus-primary/10 text-aergus-primary font-medium" : "text-aergus-text-dim hover:text-aergus-text hover:bg-aergus-text/[0.05]"}`}
              >
                {ws.name}
              </div>
            ))}
            <div className="h-px bg-aergus-border my-aergus-xs mx-aergus-sm" />
            <div
              onClick={() => {
                setIsOpen(false);
                router.push("/workspace-create");
              }}
              className="px-aergus-md py-aergus-sm mx-aergus-xs text-[12.5px] text-aergus-text-dim hover:text-aergus-text hover:bg-aergus-text/[0.05] rounded-md cursor-pointer flex items-center gap-aergus-sm transition-colors"
            >
              <span className="text-[15px] leading-none mb-0.5">+</span> Create
              Workspace
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function ProjectSwitcher() {
  const { activeWorkspace } = useWorkspaceStore();
  const { projects, activeProject, setActiveProject, fetchProjects } =
    useProjectStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (activeWorkspace) {
      fetchProjects(activeWorkspace.id).catch(() => {});
    }
  }, [activeWorkspace, fetchProjects]);

  const currentName = activeProject?.name || "Select Project";

  return (
    <div className="relative mb-aergus-lg">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-aergus-md py-aergus-sm rounded-lg bg-aergus-text/[0.02] border border-aergus-border hover:bg-aergus-text/[0.04] cursor-pointer transition-colors select-none group"
      >
        <div className="flex items-center gap-aergus-md">
          <div className="w-7 h-7 rounded-[5px] bg-aergus-text text-aergus-bg flex items-center justify-center font-bold text-[13px] shrink-0">
            {currentName.charAt(0)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[12.5px] font-medium leading-none mb-aergus-xs text-aergus-text truncate max-w-[120px]">
              {currentName}
            </span>
            <span className="text-[9px] text-aergus-text-dim leading-none uppercase tracking-wider font-semibold">
              Current Project
            </span>
          </div>
        </div>
        <ChevronDown
          className="w-3.5 h-3.5 text-aergus-text-dim group-hover:text-aergus-text transition-colors shrink-0"
          strokeWidth={1.5}
        />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-[48px] left-0 w-full bg-aergus-bg border border-aergus-border rounded-lg shadow-2xl z-50 py-aergus-xs flex flex-col gap-aergus-xs animate-in fade-in zoom-in-95 duration-100">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => {
                  setActiveProject(proj);
                  setIsOpen(false);
                  if (activeWorkspace) {
                    router.push(
                      `/w/${activeWorkspace.slug}/p/${proj.slug}/dashboard`,
                    );
                  }
                }}
                className={`px-aergus-md py-aergus-sm mx-aergus-xs text-[12.5px] rounded-md cursor-pointer transition-colors ${activeProject?.id === proj.id ? "bg-aergus-primary/10 text-aergus-primary font-medium" : "text-aergus-text-dim hover:text-aergus-text hover:bg-aergus-text/[0.05]"}`}
              >
                {proj.name}
              </div>
            ))}
            <div className="h-px bg-aergus-border my-aergus-xs mx-aergus-sm" />
            <div
              onClick={() => {
                setIsOpen(false);
                router.push("/workspace/projects");
              }}
              className="px-aergus-md py-aergus-sm mx-aergus-xs text-[12.5px] text-aergus-text-dim hover:text-aergus-text hover:bg-aergus-text/[0.05] rounded-md cursor-pointer flex items-center gap-aergus-sm transition-colors"
            >
              <span className="text-[15px] leading-none mb-0.5">+</span> Create /
              Manage Projects
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NavItem({
  item,
  activeId,
  onSelect,
  level = 0,
}: {
  item: NavItemData;
  activeId: string;
  onSelect: (id: string) => void;
  level?: number;
}) {
  const { activeWorkspace } = useWorkspaceStore();
  const { activeProject } = useProjectStore();
  const isActive = activeId === item.id;
  const hasChildren = !!item.children;
  const isChildActive =
    hasChildren && item.children!.some((child) => child.id === activeId);
  const [isOpen, setIsOpen] = useState(isChildActive);
  const router = useRouter();

  useEffect(() => {
    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isChildActive]);

  const resolveHref = (href?: string) => {
    if (!href) return undefined;
    if (href.startsWith("/workspace/") || href.startsWith("/developer/")) {
      return href;
    }
    if (activeWorkspace && activeProject) {
      return `/w/${activeWorkspace.slug}/p/${activeProject.slug}${href}`;
    }
    return href;
  };

  const resolvedHref = resolveHref(item.href);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onSelect(item.id);
      if (resolvedHref) {
        router.push(resolvedHref);
      }
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      <div
        className={`group relative flex items-center justify-between px-aergus-md py-aergus-sm rounded-lg cursor-pointer transition-all duration-150 select-none
          ${
            isActive
              ? "bg-aergus-text/[0.05] text-aergus-text font-medium"
              : "text-aergus-text-dim hover:bg-aergus-text/[0.02] hover:text-aergus-text"
          }
        `}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={handleClick}
      >
        {isActive && (
          <div className="absolute left-0 w-[3px] h-3.5 bg-aergus-primary rounded-r" />
        )}

        <div className="flex items-center gap-2.5">
          <item.icon
            className={`w-[15px] h-[15px] transition-colors
              ${isActive ? "text-aergus-primary" : "text-aergus-text-dim group-hover:text-aergus-text"}
            `}
            strokeWidth={1.5}
          />
          <span className="text-[12.5px] tracking-wide truncate">
            {item.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {item.shortcut && (
            <kbd className="hidden group-hover:inline-flex items-center justify-center h-4.5 px-1.5 text-[9px] font-mono text-aergus-text-dim/80 bg-aergus-text/5 border border-aergus-border rounded">
              {item.shortcut}
            </kbd>
          )}
          {item.badge && (
            <span className="flex items-center justify-center min-w-[18px] h-4.5 px-1.5 text-[9px] font-bold rounded-full bg-aergus-primary/10 text-aergus-primary border border-aergus-primary/20">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronRight
              className={`w-3 h-3 text-aergus-text-dim/60 transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}
              strokeWidth={2}
            />
          )}
        </div>
      </div>

      {hasChildren && (
        <div
          className={`grid transition-[grid-template-rows,opacity] duration-200 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden min-h-0 relative flex flex-col gap-aergus-xs mt-aergus-xs">
            <div
              className="absolute top-0 bottom-0 border-l border-aergus-border"
              style={{ left: `${level * 12 + 19}px` }}
            />
            {item.children!.map((child) => (
              <NavItem
                key={child.id}
                item={child}
                activeId={activeId}
                onSelect={onSelect}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({
  className = "",
  activeId,
  onSelect,
}: {
  className?: string;
  activeId?: string;
  onSelect?: (id: string) => void;
}) {
  const { activeWorkspace } = useWorkspaceStore();
  const { activeProject } = useProjectStore();
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const [internalId, setInternalId] = useState("home");

  const workspaceNavItems: NavItemData[] = [
    {
      id: "ws-projects",
      title: "Projects",
      icon: FolderKanban,
      href: "/workspace/projects",
    },
    { id: "ws-team", title: "Team", icon: Users, href: "/workspace/team" },
    {
      id: "ws-activity",
      title: "Activity",
      icon: Activity,
      href: "/workspace/activity",
    },
  ];

  const projectNavItems: NavItemData[] = [
    {
      id: "grp-ops",
      title: "Operations",
      icon: FolderKanban,
      children: [
        { id: "p-dashboard", title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
        { id: "p-resources", title: "Resources", icon: Globe, href: "/resources" },
        { id: "p-settings", title: "Settings", icon: Settings, href: "/settings" },
      ]
    },
    {
      id: "grp-observability",
      title: "Observability",
      icon: Cpu,
      children: [
        { id: "p-monitoring", title: "Monitoring", icon: ActivitySquare, href: "/monitoring" },
        { id: "p-insights", title: "Insights", icon: Cpu, href: "/insights" },
        { id: "p-alerts", title: "Alerts", icon: ShieldAlert, href: "/alerts" },
        { id: "p-health", title: "Health", icon: HeartPulse, href: "/health" },
      ]
    },
    {
      id: "grp-extensions",
      title: "Extensions",
      icon: Blocks,
      children: [
        { id: "p-automation", title: "Automation", icon: Sliders, href: "/automation" },
        { id: "p-integrations", title: "Integrations", icon: Blocks, href: "/integrations" },
      ]
    }
  ];

  const developerNavItems: NavItemData[] = [
    {
      id: "grp-dev-access",
      title: "Access Control",
      icon: Terminal,
      children: [
        { id: "d-api", title: "API Keys", icon: Terminal, href: "/developer/api" },
        { id: "d-webhooks", title: "Webhooks", icon: Blocks, href: "/developer/webhooks" },
      ]
    },
    {
      id: "grp-dev-tools",
      title: "Developer Tools",
      icon: FileText,
      children: [
        { id: "d-docs", title: "Documentation", icon: FileText, href: "/developer/docs" },
        { id: "d-cli", title: "CLI", icon: Terminal, href: "/developer/cli" },
        { id: "d-sdk", title: "SDK", icon: Blocks, href: "/developer/sdk" },
      ]
    }
  ];

  const bottomItems: NavItemData[] = [
    { id: "logout", title: "Log out", icon: LogOut },
  ];

  const getActiveId = () => {
    if (activeId) return activeId;

    const resolveHref = (item: NavItemData) => {
      const href = item.href;
      if (!href) return undefined;
      if (href.startsWith("/workspace/") || href.startsWith("/developer/")) {
        return href;
      }
      if (activeWorkspace && activeProject) {
        return `/w/${activeWorkspace.slug}/p/${activeProject.slug}${href}`;
      }
      return href;
    };

    // Check workspace items
    for (const item of workspaceNavItems) {
      if (resolveHref(item) === pathname) return item.id;
    }

    // Check project items
    if (activeProject) {
      for (const item of projectNavItems) {
        if (resolveHref(item) === pathname) return item.id;
        if (item.children) {
          for (const child of item.children) {
            if (resolveHref(child) === pathname) return child.id;
          }
        }
      }
    }

    // Check developer items
    for (const item of developerNavItems) {
      if (resolveHref(item) === pathname) return item.id;
      if (item.children) {
        for (const child of item.children) {
          if (resolveHref(child) === pathname) return child.id;
        }
      }
    }

    return internalId;
  };

  const currentId = getActiveId();

  const handleSelect = (id: string) => {
    if (id === "logout") {
      logout();
      router.push("/login");
    } else {
      if (onSelect) {
        onSelect(id);
      } else {
        setInternalId(id);
      }
    }
  };

  return (
    <div
      className={`flex flex-col w-sidebar-width h-screen bg-aergus-bg border-r border-aergus-border p-aergus-md font-mono text-aergus-text select-none ${className}`}
    >
      <WorkspaceSwitcher />

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-aergus-lg mt-aergus-sm">
        {/* Workspace section */}
        <div className="flex flex-col gap-aergus-xs">
          <span className="px-aergus-md mb-aergus-xs text-[9px] font-semibold tracking-[0.15em] text-aergus-text-dim uppercase">
            Workspace
          </span>
          {workspaceNavItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              activeId={currentId}
              onSelect={handleSelect}
            />
          ))}
        </div>

        {/* Current Project section */}
        {activeWorkspace && (
          <div className="flex flex-col gap-aergus-xs border-t border-aergus-border pt-aergus-md">
            <span className="px-aergus-md mb-aergus-xs text-[9px] font-semibold tracking-[0.15em] text-aergus-text-dim uppercase">
              Current Project
            </span>
            <ProjectSwitcher />
            {activeProject ? (
              projectNavItems.map((item) => (
                <NavItem
                  key={item.id}
                  item={item}
                  activeId={currentId}
                  onSelect={handleSelect}
                />
              ))
            ) : (
              <p className="px-aergus-md py-aergus-sm text-[10.5px] text-aergus-text-dim/60 italic">
                No active project. Create one below to enable project modules.
              </p>
            )}
          </div>
        )}

        {/* Developer section */}
        <div className="flex flex-col gap-aergus-xs border-t border-aergus-border pt-aergus-md">
          <span className="px-aergus-md mb-aergus-xs text-[9px] font-semibold tracking-[0.15em] text-aergus-text-dim uppercase">
            Developer
          </span>
          {developerNavItems.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              activeId={currentId}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      <div className="mt-auto pt-aergus-lg border-t border-aergus-border flex flex-col gap-aergus-xs">
        {bottomItems.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            activeId={currentId}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}
