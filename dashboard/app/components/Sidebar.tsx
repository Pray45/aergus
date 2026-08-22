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
import WorkspaceSwitcher from "./WorkspaceSwitcher";
import NavItem from "./ui/NavItem";
import { NavItemData } from "@/app/types";

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
        {
          id: "p-dashboard",
          title: "Dashboard",
          icon: LayoutDashboard,
          href: "/dashboard",
        },
        {
          id: "p-resources",
          title: "Resources",
          icon: Globe,
          href: "/resources",
        },
        {
          id: "p-settings",
          title: "Settings",
          icon: Settings,
          href: "/settings",
        },
      ],
    },
    {
      id: "grp-observability",
      title: "Observability",
      icon: Cpu,
      children: [
        {
          id: "p-monitoring",
          title: "Monitoring",
          icon: ActivitySquare,
          href: "/monitoring",
        },
        { id: "p-insights", title: "Insights", icon: Cpu, href: "/insights" },
        { id: "p-alerts", title: "Alerts", icon: ShieldAlert, href: "/alerts" },
        { id: "p-health", title: "Health", icon: HeartPulse, href: "/health" },
      ],
    },
    {
      id: "grp-extensions",
      title: "Extensions",
      icon: Blocks,
      children: [
        {
          id: "p-automation",
          title: "Automation",
          icon: Sliders,
          href: "/automation",
        },
        {
          id: "p-integrations",
          title: "Integrations",
          icon: Blocks,
          href: "/integrations",
        },
      ],
    },
  ];

  const developerNavItems: NavItemData[] = [
    {
      id: "grp-dev-access",
      title: "Access Control",
      icon: Terminal,
      children: [
        {
          id: "d-api",
          title: "API Keys",
          icon: Terminal,
          href: "/developer/api",
        },
        {
          id: "d-webhooks",
          title: "Webhooks",
          icon: Blocks,
          href: "/developer/webhooks",
        },
      ],
    },
    {
      id: "grp-dev-tools",
      title: "Developer Tools",
      icon: FileText,
      children: [
        {
          id: "d-docs",
          title: "Documentation",
          icon: FileText,
          href: "/developer/docs",
        },
        { id: "d-cli", title: "CLI", icon: Terminal, href: "/developer/cli" },
        { id: "d-sdk", title: "SDK", icon: Blocks, href: "/developer/sdk" },
      ],
    },
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

    for (const item of workspaceNavItems) {
      if (resolveHref(item) === pathname) return item.id;
    }

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
      className={`hidden md:flex md:flex-col w-sidebar-width h-screen bg-aergus-bg border-r border-aergus-border p-aergus-md font-mono text-aergus-text select-none ${className}`}
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
