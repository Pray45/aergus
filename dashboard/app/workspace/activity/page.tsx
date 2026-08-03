"use client";

import React, { useState } from "react";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { Activity, User, Terminal, Calendar, SlidersHorizontal } from "lucide-react";

interface ActivityItem {
  id: string;
  user: string;
  event: string;
  target: string;
  category: "USER" | "RESOURCE" | "SYSTEM" | "DEPLOYMENT";
  timestamp: string;
}

export default function WorkspaceActivityPage() {
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const [filter, setFilter] = useState<string>("ALL");

  const activities: ActivityItem[] = [
    {
      id: "1",
      user: "Hermione Granger",
      event: "PROVISIONED PROJECT SUB-INSTANCE",
      target: "production-cluster",
      category: "RESOURCE",
      timestamp: "10 mins ago",
    },
    {
      id: "2",
      user: "Harry Potter",
      event: "INVITED NEW DEVELOPER ROLE",
      target: "ron@aergus.sh",
      category: "USER",
      timestamp: "1 hour ago",
    },
    {
      id: "3",
      user: "System Daemon",
      event: "AUTO-UPGRADED WORKSPACE NODE TO SECURE_TIER",
      target: "Aergus Core",
      category: "SYSTEM",
      timestamp: "4 hours ago",
    },
    {
      id: "4",
      user: "Hermione Granger",
      event: "UPDATED GENERAL CONFIGURATION FOR WORKSPACE",
      target: activeWorkspace?.name || "Workspace",
      category: "USER",
      timestamp: "Yesterday",
    },
    {
      id: "5",
      user: "System Compiler",
      event: "TRIGGERED INTEGRATED CI PIPELINE BUILD",
      target: "docker-agent-worker-01",
      category: "DEPLOYMENT",
      timestamp: "2 days ago",
    },
  ];

  const filteredActivities = activities.filter((act) => {
    if (filter === "ALL") return true;
    return act.category === filter;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "RESOURCE":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "USER":
        return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "DEPLOYMENT":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      default:
        return "text-aergus-primary bg-aergus-primary/10 border-aergus-primary/20";
    }
  };

  return (
    <div className="space-y-6 font-mono text-aergus-text max-w-5xl mx-auto">
      <div className="flex justify-between items-center border-b border-aergus-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">Workspace Activity</h1>
          <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
            Comprehensive audit timeline of secure operations and events
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 border border-aergus-border rounded bg-aergus-card/30">
        <div className="flex items-center gap-2 text-xs">
          <SlidersHorizontal className="w-3.5 h-3.5 opacity-60" />
          <span className="font-bold text-aergus-text uppercase">FILTERS:</span>
        </div>
        <div className="flex gap-2">
          {["ALL", "USER", "RESOURCE", "DEPLOYMENT", "SYSTEM"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border cursor-pointer transition-colors ${filter === cat ? "bg-aergus-primary text-white border-aergus-primary" : "border-aergus-border bg-aergus-card text-aergus-text-dim hover:text-aergus-text"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline list */}
      <div className="relative pl-6 border-l border-aergus-border/60 ml-3 space-y-8 py-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((act) => (
            <div key={act.id} className="relative group animate-in fade-in slide-in-from-left-2 duration-200">
              {/* timeline dot */}
              <div className="absolute -left-[31px] top-1.5 w-2.5 h-2.5 bg-aergus-bg border-2 border-aergus-primary rounded-full group-hover:bg-aergus-primary transition-colors" />

              <div className="bg-aergus-card border border-aergus-border rounded p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-sm border text-[9px] font-bold tracking-wider ${getCategoryColor(act.category)}`}>
                      {act.category}
                    </span>
                    <span className="text-[10px] text-aergus-text-dim font-semibold uppercase flex items-center gap-1">
                      <User className="w-3 h-3 opacity-60" /> {act.user}
                    </span>
                  </div>
                  <h3 className="font-bold text-xs text-aergus-text tracking-wider uppercase mt-2">
                    {act.event}
                  </h3>
                  <p className="text-[11px] text-aergus-text-dim font-mono leading-none">
                    TARGET: <span className="text-aergus-text opacity-95">{act.target}</span>
                  </p>
                </div>

                <div className="text-right shrink-0 flex items-center gap-1.5 text-[10px] text-aergus-text-dim font-mono uppercase font-semibold">
                  <Calendar className="w-3.5 h-3.5 opacity-60" />
                  {act.timestamp}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center border border-dashed border-aergus-border rounded bg-aergus-card/20 font-mono">
            <Activity className="w-10 h-10 text-aergus-text-dim opacity-30 mx-auto mb-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-aergus-text font-mono">No matching records found</h3>
            <p className="text-xs text-aergus-text-dim mt-2 font-mono">
              Modify your filter settings above to view other workspace audit records.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
