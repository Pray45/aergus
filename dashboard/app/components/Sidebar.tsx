"use client";

import React, { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [internalSelected, setInternalSelected] = useState("Acme Corp");

  const current = selected || internalSelected;
  const handleSelect = onSelect || setInternalSelected;

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between px-3 py-2 mb-4 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] cursor-pointer transition-colors select-none group"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-[5px] bg-[#ff3100] text-white flex items-center justify-center font-bold text-[13px] shadow-[0_0_10px_rgba(255,49,0,0.2)]">
            {current.charAt(0)}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[12.5px] font-medium leading-none mb-1 text-white truncate max-w-[120px]">
              {current}
            </span>
            <span className="text-[9px] text-white/30 leading-none uppercase tracking-wider font-semibold">
              Secure Instance
            </span>
          </div>
        </div>
        <ChevronDown
          className="w-3.5 h-3.5 text-white/30 group-hover:text-white/60 transition-colors shrink-0"
          strokeWidth={1.5}
        />
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-[48px] left-0 w-full bg-[#0a0a0a] border border-white/5 rounded-lg shadow-2xl z-50 py-1 flex flex-col gap-0.5 animate-in fade-in zoom-in-95 duration-100">
            {["Acme Corp", "Personal Workspace", "Client Sandbox"].map((ws) => (
              <div
                key={ws}
                onClick={() => {
                  handleSelect(ws);
                  setIsOpen(false);
                }}
                className={`px-3 py-2 mx-1 text-[12.5px] rounded-md cursor-pointer transition-colors ${current === ws ? "bg-[#ff3100]/10 text-[#ff3100] font-medium" : "text-white/70 hover:bg-white/5"}`}
              >
                {ws}
              </div>
            ))}
            <div className="h-px bg-white/5 my-1 mx-2" />
            <div className="px-3 py-2 mx-1 text-[12.5px] text-white/30 hover:bg-white/5 rounded-md cursor-pointer flex items-center gap-2 transition-colors">
              <span className="text-[15px] leading-none mb-0.5">+</span> Create Workspace
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
        className={`group relative flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 select-none
          ${
            isActive
              ? "bg-white/[0.05] text-white font-medium"
              : "text-white/50 hover:bg-white/[0.02] hover:text-white/80"
          }
        `}
        style={{ paddingLeft: `${level * 12 + 12}px` }}
        onClick={handleClick}
      >
        {/* Minimalist vertical red accent line */}
        {isActive && (
          <div className="absolute left-0 w-[3px] h-3.5 bg-[#ff3100] rounded-r" />
        )}

        <div className="flex items-center gap-2.5">
          <item.icon
            className={`w-[15px] h-[15px] transition-colors
              ${isActive ? "text-[#ff3100]" : "text-white/40 group-hover:text-white/70"}
            `}
            strokeWidth={1.5}
          />
          <span className="text-[12.5px] tracking-wide truncate">
            {item.title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {item.shortcut && (
            <kbd className="hidden group-hover:inline-flex items-center justify-center h-4.5 px-1.5 text-[9px] font-mono text-white/35 bg-white/5 border border-white/5 rounded">
              {item.shortcut}
            </kbd>
          )}
          {item.badge && (
            <span className="flex items-center justify-center min-w-[18px] h-4.5 px-1.5 text-[9px] font-bold rounded-full bg-[#ff3100]/10 text-[#ff3100] border border-[#ff3100]/20">
              {item.badge}
            </span>
          )}
          {hasChildren && (
            <ChevronRight
              className={`w-3 h-3 text-white/20 transition-transform duration-150 ${isOpen ? "rotate-90" : ""}`}
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
          <div className="overflow-hidden min-h-0 relative flex flex-col gap-0.5 mt-0.5">
            <div
              className="absolute top-0 bottom-0 border-l border-white/5"
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
  const [internalId, setInternalId] = useState("home");
  const currentId = activeId !== undefined ? activeId : internalId;
  const handleSelect = onSelect || setInternalId;

  return (
    <div
      className={`flex flex-col w-[260px] h-screen bg-[#050505] border-r border-white/5 p-3 font-mono text-white select-none ${className}`}
    >
      <WorkspaceSwitcher
        selected={activeWorkspace}
        onSelect={onWorkspaceSelect}
      />

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col gap-4 mt-2">
        {mockNavGroups.map((group, idx) => (
          <div key={idx} className="flex flex-col gap-0.5">
            {group.heading && (
              <span className="px-3 mb-1 text-[9px] font-semibold tracking-[0.15em] text-white/25 uppercase">
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

      <div className="mt-auto pt-4 border-t border-white/5 flex flex-col gap-0.5">
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
