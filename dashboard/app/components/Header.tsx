"use client";

import { useAuthStore } from "../store/authStore";
import { Bell } from "lucide-react";
import { useWorkspaceStore } from "../store/workspaceStore";
import Link from "next/link";
const Header = () => {
  const user = useAuthStore((state) => state.user);
  const workspace = useWorkspaceStore((state) => state.activeWorkspace);

  return (
    <header className="flex h-header-height items-center justify-between border-b border-aergus-border px-aergus-xl">
      <div className="flex items-center font-sans">
        <p className="text-aergus-primary font-bold text-xl pr-aergus-md tracking-tight">{`>`}</p>
        <Link
          href={`/w/${workspace?.slug}`}
          className="text-aergus-text-dim text-sm font-sm cursor-pointer hover:text-aergus-text transition-all duration-200"
        >
          {workspace?.name}
        </Link>
        <p className="ml-aergus-sm text-aergus-primary text-sm font-medium">
          / project name
        </p>
      </div>

      <div className="h-full flex w-1/2 justify-end">
        {/* search bar */}
        <div className="flex mr-aergus-xl w-1/2">
          <input
            type="search"
            placeholder="Search"
            className="w-full h-8 p-aergus-sm self-center border border-aergus-border rounded-sm  focus:outline-none focus:border-aergus-primary transition-all duration-200"
          />
        </div>

        <button className="h-8 w-24 border self-center cursor-pointer bg-aergus-primary/70 border-aergus-border rounded-sm text-aergus-text-dim text-sm font-sm">
          <p className="text-aergus-text font-sm">Logs</p>
        </button>

        {/* devider */}
        <div className="ml-aergus-xl w-[1px] bg-aergus-border h-1/2 self-center"></div>

        <div className="flex items-center gap-aergus-md px-aergus-md">
          {/* notification button */}
          <div className="p-aergus-md">
            <Bell className="w-5 h-5 text-aergus-text-dim" />
          </div>

          {/* profile picture or icon */}
          {user?.avatar ? (
            <img
              src={user.avatar}
              className="rounded-full w-8 h-8 object-cover border border-aergus-border hover:border-aergus-primary/70 transition-all duration-200"
            />
          ) : (
            <div className="rounded-full w-8 h-8 bg-aergus-text border border-aergus-border flex items-center justify-center hover:border-aergus-primary/70 transition-all duration-200 select-none">
              <span className="text-aergus-primary text-sm font-bold font-mono uppercase">
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
