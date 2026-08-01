"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useWorkspaceStore } from "../store/workspaceStore";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  LogOut,
  Hash,
  ChevronDown,
  ChevronRight,
  Inbox,
  Calendar,
  Activity,
  CreditCard,
  Globe,
  Terminal,
  Blocks,
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

const mockNavGroups: NavGroupData[] = [
  {
    items: [
      { id: "home", title: "Home", icon: LayoutDashboard, href: "/home" },
      { id: "inbox", title: "Inbox", icon: Inbox, badge: 12, href: "/inbox" },
      {
        id: "analytics",
        title: "Analytics",
        icon: Activity,
        href: "/analytics",
      },
    ],
  },
  {
    heading: "Workspace",
    items: [
      {
        id: "projects",
        title: "Projects",
        icon: FolderKanban,
        children: [
          {
            id: "p-active",
            title: "Active Nodes",
            icon: Hash,
            href: "/projects/active",
          },
          {
            id: "p-archived",
            title: "Archived Logs",
            icon: Hash,
            href: "/projects/archived",
          },
        ],
      },
      { id: "calendar", title: "Calendar", icon: Calendar, href: "/calendar" },
      {
        id: "team",
        title: "Team Permissions",
        icon: Users,
        children: [
          {
            id: "t-design",
            title: "Designers",
            icon: Hash,
            href: "/team/design",
          },
          { id: "t-eng", title: "Engineering", icon: Hash, href: "/team/eng" },
          {
            id: "t-product",
            title: "Product",
            icon: Hash,
            href: "/team/product",
          },
        ],
      },
      {
        id: "customers",
        title: "Client nodes",
        icon: Globe,
        children: [
          {
            id: "c-enterprise",
            title: "Enterprise",
            icon: Hash,
            href: "/customers/enterprise",
          },
          { id: "c-smb", title: "SMB", icon: Hash, href: "/customers/smb" },
        ],
      },
      {
        id: "finance",
        title: "Finance/Usage",
        icon: CreditCard,
        href: "/finance",
      },
    ],
  },
  {
    heading: "Developers",
    items: [
      { id: "api", title: "API Keys", icon: Terminal, href: "/api" },
      { id: "webhooks", title: "Webhooks", icon: Blocks, href: "/webhooks" },
    ],
  },
];

const mockBottomItems: NavItemData[] = [
  {
    id: "settings",
    title: "Settings",
    icon: Settings,
    shortcut: "⌘,",
    href: "/settings",
  },
  { id: "logout", title: "Log out", icon: LogOut },
];

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
        className="flex items-center justify-between px-aergus-md py-aergus-sm mb-aergus-lg rounded-lg bg-aergus-text/[0.02] border border-aergus-border hover:bg-aergus-text/[0.04] cursor-pointer transition-colors select-none group"
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
                  router.push(`/w/${ws.slug}`);
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
    if (!activeWorkspace) return href;
    if (href === "/home") return `/w/${activeWorkspace.slug}`;
    return `/w/${activeWorkspace.slug}${href}`;
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
        style={{ paddingLeft: `${level * 12 + 12}px` }} // Aligned with --aergus-space-md (12px)
        onClick={handleClick}
      >
        {/* Minimalist vertical red accent line */}
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
  const router = useRouter();
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);
  const [internalId, setInternalId] = useState("home");

  const getActiveId = () => {
    if (activeId) return activeId;

    const resolveHref = (href?: string) => {
      if (!href) return undefined;
      if (!activeWorkspace) return href;
      if (href === "/home") return `/w/${activeWorkspace.slug}`;
      return `/w/${activeWorkspace.slug}${href}`;
    };

    // Check main groups
    for (const group of mockNavGroups) {
      for (const item of group.items) {
        const resolvedHref = resolveHref(item.href);
        if (
          resolvedHref === pathname ||
          (item.id === "home" &&
            activeWorkspace &&
            pathname === `/w/${activeWorkspace.slug}`)
        ) {
          return item.id;
        }
        if (item.children) {
          for (const child of item.children) {
            if (resolveHref(child.href) === pathname) return child.id;
          }
        }
      }
    }
    // Check bottom items
    for (const item of mockBottomItems) {
      if (resolveHref(item.href) === pathname) return item.id;
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
        {mockNavGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-aergus-xs">
            {group.heading && (
              <span className="px-aergus-md mb-aergus-xs text-[9px] font-semibold tracking-[0.15em] text-aergus-text-dim uppercase">
                {group.heading}
              </span>
            )}
            {group.items.map((item) => (
              <NavItem
                key={item.id}
                item={item}
                activeId={currentId}
                onSelect={handleSelect}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-aergus-lg border-t border-aergus-border flex flex-col gap-aergus-xs">
        {mockBottomItems.map((item) => (
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
