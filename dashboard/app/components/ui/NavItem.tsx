import { useWorkspaceStore } from "@/app/store/workspaceStore";
import { useProjectStore } from "@/app/store/projectStore";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { NavItemData } from "@/app/types";
import { ChevronRight } from "lucide-react";

const NavItem = ({
  item,
  activeId,
  onSelect,
  level = 0,
}: {
  item: NavItemData;
  activeId: string;
  onSelect: (id: string) => void;
  level?: number;
}) => {
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
};

export default NavItem;
