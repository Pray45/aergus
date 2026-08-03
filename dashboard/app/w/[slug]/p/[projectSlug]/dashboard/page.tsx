"use client";

import React from "react";
import { useWorkspaceStore } from "../../../../../store/workspaceStore";
import { useProjectStore } from "../../../../../store/projectStore";
import { useResourceStore } from "../../../../../store/resourceStore";
import { useAlertStore } from "../../../../../store/alertStore";
import { 
  ShieldCheck, 
  Activity, 
  Database, 
  Server, 
  AlertTriangle, 
  TrendingUp, 
  Zap, 
  UserPlus, 
  PlusCircle, 
  Terminal 
} from "lucide-react";
import Link from "next/link";

export default function ProjectDashboard() {
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const activeProject = useProjectStore((state) => state.activeProject);
  const resources = useResourceStore((state) => state.resources);
  const alerts = useAlertStore((state) => state.alerts);
  const activeAlerts = alerts.filter((a) => a.status === "ACTIVE");

  const stats = [
    { label: "Active Resources", value: `${resources.length} Nodes`, detail: resources.length > 0 ? "All nodes live" : "No nodes mapped", icon: Server },
    { label: "Uptime Metric", value: resources.length > 0 ? "99.98%" : "0.00%", detail: "Last 30 days", icon: Activity },
    { label: "Open Alerts", value: `${activeAlerts.length}`, detail: activeAlerts.length > 0 ? "Action required" : "System secure", icon: activeAlerts.length > 0 ? AlertTriangle : ShieldCheck },
    { label: "Health Score", value: resources.length > 0 ? "98 / 100" : "0 / 100", detail: resources.length > 0 ? "EXCELLENT" : "NO TELEMETRY", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6 font-mono text-aergus-text">
      {/* Hero Header Banner */}
      <div className="bg-aergus-card border border-aergus-border rounded p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 h-full w-[4px] bg-aergus-primary" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 bg-green-500/10 text-green-500 border border-green-500/20 font-bold rounded-sm uppercase tracking-wider">
              ONLINE
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-aergus-primary/10 text-aergus-primary border border-aergus-primary/20 font-bold rounded-sm uppercase tracking-wider">
              PRODUCTION ENV
            </span>
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-wider text-aergus-text mt-2">
            {activeProject?.name || "Project Dashboard"}
          </h1>
          <p className="text-xs text-aergus-text-dim/80 uppercase font-semibold font-mono tracking-tight leading-none mt-1">
            CONTROL CONSOLE INSTANCE FOR PROJECT • {activeProject?.slug}
          </p>
        </div>

        <div className="flex items-center gap-4 border-l border-aergus-border/40 pl-6 shrink-0 select-none">
          <div className="text-right">
            <span className="text-[9px] text-aergus-text-dim uppercase font-bold tracking-widest block mb-0.5">
              HEALTH SCORE
            </span>
            <span className="text-2xl font-bold tracking-tighter text-green-500">98%</span>
          </div>
          <div className="w-11 h-11 bg-green-500/10 text-green-500 border border-green-500/25 rounded flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-aergus-card border border-aergus-border p-5 rounded relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-bold text-aergus-text-dim uppercase tracking-wider">
                {stat.label}
              </span>
              <stat.icon className="w-4 h-4 text-aergus-primary opacity-60" />
            </div>
            <h3 className="text-xl font-bold tracking-tight text-aergus-text uppercase mb-1">
              {stat.value}
            </h3>
            <p className="text-[10px] text-aergus-text-dim/60 font-mono leading-none">
              {stat.detail}
            </p>
          </div>
        ))}
      </div>

      {/* Main Grid content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Live summary logs & items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-aergus-card border border-aergus-border rounded p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-aergus-text border-b border-aergus-border pb-3 mb-4">
              PROJECT CONSOLE FEED
            </h2>
            
            <div className="font-mono text-[11px] leading-relaxed text-aergus-text-dim space-y-3">
              <div className="flex gap-2">
                <span className="text-green-500 shrink-0">[13:04:12]</span>
                <span className="text-aergus-text">[RESOURCE]</span>
                <span>Active Server instance: web-server-node-01 initialized OK</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-500 shrink-0">[12:45:00]</span>
                <span className="text-aergus-text">[MONITORING]</span>
                <span>DNS verification passed. SSL certificate status active (exp. 89 days)</span>
              </div>
              <div className="flex gap-2">
                <span className="text-yellow-500 shrink-0">[08:21:09]</span>
                <span className="text-yellow-500">[ALERT]</span>
                <span className="text-aergus-text/80">CPU spike detected on docker-agent-worker-01 (89%). Automatically mitigated.</span>
              </div>
              <div className="flex gap-2">
                <span className="text-green-500 shrink-0">[04:00:00]</span>
                <span className="text-aergus-text">[SYSTEM]</span>
                <span>Automatic daily compliance scan completed. Health index remains at 98.</span>
              </div>
            </div>
          </div>

          <div className="bg-aergus-card border border-aergus-border rounded p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-aergus-text border-b border-aergus-border pb-3 mb-4">
              MONITORING OVERVIEW
            </h2>
            <div className="h-32 border border-dashed border-aergus-border bg-aergus-bg/25 rounded flex items-center justify-center">
              <div className="text-center font-mono space-y-2">
                <Activity className="w-8 h-8 text-aergus-primary opacity-40 mx-auto" />
                <p className="text-[11px] text-aergus-text-dim font-bold uppercase tracking-wider">
                  Latency graphs and requests statistics will compile below
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Actions & Details */}
        <div className="space-y-6">
          <div className="bg-aergus-card border border-aergus-border rounded p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-aergus-text border-b border-aergus-border pb-3 mb-4">
              QUICK COMMANDS
            </h2>
            
            <div className="space-y-3">
              <Link
                href={`/w/${activeWorkspace?.slug}/p/${activeProject?.slug}/resources`}
                className="w-full flex items-center gap-3 p-3 bg-aergus-bg hover:bg-aergus-text/[0.03] border border-aergus-border rounded text-xs text-aergus-text hover:border-aergus-primary/50 transition-colors uppercase font-bold tracking-wider"
              >
                <PlusCircle className="w-4 h-4 text-aergus-primary" />
                Add Resource
              </Link>
              <Link
                href={`/w/${activeWorkspace?.slug}/p/${activeProject?.slug}/monitoring`}
                className="w-full flex items-center gap-3 p-3 bg-aergus-bg hover:bg-aergus-text/[0.03] border border-aergus-border rounded text-xs text-aergus-text hover:border-aergus-primary/50 transition-colors uppercase font-bold tracking-wider"
              >
                <Terminal className="w-4 h-4 text-aergus-primary" />
                Install Host Agent
              </Link>
              <Link
                href={`/w/${activeWorkspace?.slug}/p/${activeProject?.slug}/alerts`}
                className="w-full flex items-center gap-3 p-3 bg-aergus-bg hover:bg-aergus-text/[0.03] border border-aergus-border rounded text-xs text-aergus-text hover:border-aergus-primary/50 transition-colors uppercase font-bold tracking-wider"
              >
                <Zap className="w-4 h-4 text-aergus-primary" />
                Configure Alerts
              </Link>
              <Link
                href={`/workspace/team`}
                className="w-full flex items-center gap-3 p-3 bg-aergus-bg hover:bg-aergus-text/[0.03] border border-aergus-border rounded text-xs text-aergus-text hover:border-aergus-primary/50 transition-colors uppercase font-bold tracking-wider"
              >
                <UserPlus className="w-4 h-4 text-aergus-primary" />
                Invite Co-Developer
              </Link>
            </div>
          </div>

          <div className="bg-aergus-card border border-aergus-border rounded p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-aergus-text border-b border-aergus-border pb-3 mb-4">
              ACTIVE INCIDENTS
            </h2>
            {activeAlerts.length > 0 ? (
              <div className="space-y-3">
                {activeAlerts.map((a) => (
                  <div key={a.id} className="p-3 bg-red-500/5 border border-red-500/20 rounded-sm flex items-start gap-2.5">
                    <AlertTriangle className="w-4.5 h-4.5 text-aergus-primary shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[9px] font-bold text-aergus-primary uppercase block">{a.severity} • {a.source}</span>
                      <span className="text-[10.5px] text-aergus-text-dim block">{a.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-sm flex items-start gap-2.5">
                <ShieldCheck className="w-4.5 h-4.5 text-green-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest block leading-none">
                    HEALTH_SECURE
                  </span>
                  <span className="text-[11px] text-aergus-text-dim block font-sans">
                    No active warnings. System running as expected.
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
