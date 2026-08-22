"use client";

import React, { useEffect } from "react";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useProjectStore } from "../../store/projectStore";
import Link from "next/link";
import { FolderKanban, ChevronRight, Plus } from "lucide-react";

export default function WorkspaceProjectsPage() {
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const { projects, fetchProjects } = useProjectStore();

  useEffect(() => {
    if (activeWorkspace) {
      fetchProjects(activeWorkspace.id).catch(() => {});
    }
  }, [activeWorkspace, fetchProjects]);

  return (
    <div className="space-y-6 font-mono text-aergus-text max-w-5xl mx-auto">
      <div className="flex justify-between items-center border-b border-aergus-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">
            Projects Catalog
          </h1>
          <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
            Manage infrastructure clusters inside{" "}
            {activeWorkspace?.name || "Workspace"}
          </p>
        </div>
        <Link
          href="/workspace/projects/create"
          className="h-9 px-4 bg-aergus-primary text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-aergus-primary-hover active:scale-[0.99] transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> PROVISION PROJECT
        </Link>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length > 0 ? (
          projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-aergus-card border border-aergus-border rounded p-6 hover:border-aergus-primary/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 bg-aergus-primary/10 text-aergus-primary rounded flex items-center justify-center border border-aergus-primary/20">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-aergus-text uppercase tracking-wider">
                      {proj.name}
                    </h3>
                    <p className="text-[9px] text-aergus-text-dim uppercase font-mono tracking-widest mt-0.5">
                      SLUG: {proj.slug}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-aergus-text opacity-[var(--aergus-text-dim)] leading-relaxed mt-3">
                  {proj.description || "No project description provided."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-aergus-border flex justify-between items-center">
                <span className="text-[9px] text-aergus-text-dim uppercase tracking-wider font-semibold">
                  STATUS: SECURED_NODE
                </span>
                <Link
                  href={`/w/${activeWorkspace?.slug}/p/${proj.slug}/dashboard`}
                  className="text-xs font-bold text-aergus-primary hover:text-aergus-primary-hover flex items-center gap-1 uppercase tracking-wider"
                >
                  ENTER CONSOLE <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-16 text-center border border-dashed border-aergus-border rounded bg-aergus-card/20 font-mono">
            <FolderKanban className="w-10 h-10 text-aergus-text-dim opacity-30 mx-auto mb-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-aergus-text">
              No active project nodes
            </h3>
            <p className="text-xs text-aergus-text-dim mt-2 max-w-md mx-auto">
              Projects represent isolated infrastructure environments. Configure
              and provision your first project instance to proceed.
            </p>
            <Link
              href="/workspace/projects/create"
              className="mt-6 px-4 py-2 border border-aergus-primary text-aergus-primary text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-aergus-primary/10 transition-colors inline-block cursor-pointer"
            >
              INITIALIZE YOUR FIRST PROJECT
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
