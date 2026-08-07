import { useWorkspaceStore } from "../store/workspaceStore";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

const WorkspaceSwitcher = () => {
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

export default WorkspaceSwitcher;