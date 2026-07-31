"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
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
};

export type NavGroupData = {
  heading?: string;
  items: NavItemData[];
};

const mockNavGroups: NavGroupData[] = [
  {
    items: [
      { id: "home", title: "Home", icon: LayoutDashboard },
      { id: "inbox", title: "Inbox", icon: Inbox, badge: 12 },
      { id: "analytics", title: "Analytics", icon: Activity },
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
          { id: "p-active", title: "Active Nodes", icon: Hash },
          { id: "p-archived", title: "Archived Logs", icon: Hash },
        ],
      },
      { id: "calendar", title: "Calendar", icon: Calendar },
      {
        id: "team",
        title: "Team Permissions",
        icon: Users,
        children: [
          { id: "t-design", title: "Designers", icon: Hash },
          { id: "t-eng", title: "Engineering", icon: Hash },
          { id: "t-product", title: "Product", icon: Hash },
        ],
      },
      {
        id: "customers",
        title: "Client nodes",
        icon: Globe,
        children: [
          { id: "c-enterprise", title: "Enterprise", icon: Hash },
          { id: "c-smb", title: "SMB", icon: Hash },
        ],
      },
      { id: "finance", title: "Finance/Usage", icon: CreditCard },
    ],
  },
  {
    heading: "Developers",
    items: [
      { id: "api", title: "API Keys", icon: Terminal },
      { id: "webhooks", title: "Webhooks", icon: Blocks },
    ],
  },
];

const mockBottomItems: NavItemData[] = [
  { id: "settings", title: "Settings", icon: Settings, shortcut: "⌘," },
  { id: "logout", title: "Log out", icon: LogOut },
];

function WorkspaceSwitcher({
  selected,
  onSelect,
}: {
  selected?: string;
  onSelect?: (ws: string) => void;
}) {

  const workSpaces = ["Acme Corp", "Personal Workspace", "Client Sandbox"]
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState("Acme Corp");

  const current = selected || internalSelected;
  const handleSelect = onSelect || setInternalSelected;

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-aergus-md py-aergus-sm mb-aergus-lg rounded-lg bg-aergus-text/[0.02] border border-aergus-border hover:bg-aergus-text/[0.04] cursor-pointer transition-colors select-none group"
      >
        <div className="flex items-center gap-aergus-md">
          <div className="w-7 h-7 rounded-[5px] bg-aergus-primary text-aergus-text flex items-center justify-center font-bold text-[13px] shadow-[0_0_10px_color-mix(in_srgb,var(--aergus-primary)_20%,transparent)]">
            {current.charAt(0)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[12.5px] font-medium leading-none mb-aergus-xs text-aergus-text truncate max-w-[120px]">
              {current}
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
            {workSpaces.map((ws) => (
              <div
                key={ws}
                onClick={() => {
                  handleSelect(ws);
                  setIsOpen(false);
                }}
                className={`px-aergus-md py-aergus-sm mx-aergus-xs text-[12.5px] rounded-md cursor-pointer transition-colors ${current === ws ? "bg-aergus-primary/10 text-aergus-primary font-medium" : "text-aergus-text-dim hover:text-aergus-text hover:bg-aergus-text/[0.05]"}`}
              >
                {ws}
              </div>
            ))}
            <div className="h-px bg-aergus-border my-aergus-xs mx-aergus-sm" />
            <div className="px-aergus-md py-aergus-sm mx-aergus-xs text-[12.5px] text-aergus-text-dim hover:text-aergus-text hover:bg-aergus-text/[0.05] rounded-md cursor-pointer flex items-center gap-aergus-sm transition-colors">
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
  const isActive = activeId === item.id;
  const hasChildren = !!item.children;
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen);
    } else {
      onSelect(item.id);
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
  activeWorkspace,
  onWorkspaceSelect,
}: {
  className?: string;
  activeId?: string;
  onSelect?: (id: string) => void;
  activeWorkspace?: string;
  onWorkspaceSelect?: (ws: string) => void;
}) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const [internalId, setInternalId] = useState("home");
  const currentId = activeId !== undefined ? activeId : internalId;

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
      <WorkspaceSwitcher
        selected={activeWorkspace}
        onSelect={onWorkspaceSelect}
      />

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
