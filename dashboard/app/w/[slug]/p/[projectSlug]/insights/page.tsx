"use client";

import React, { useState } from "react";
import { Cpu, Database, HardDrive, Network, Terminal, RefreshCw, BarChart2 } from "lucide-react";
import { useResourceStore } from "../../../../../store/resourceStore";
import { useParams } from "next/navigation";

export default function ProjectInsights() {
  const params = useParams();
  const resources = useResourceStore((state) => state.resources);
  const [activeMetricTab, setActiveMetricTab] = useState<"system" | "logs" | "events">("system");

  const systemMetrics = [
    { name: "CPU Utilization", value: "24.6%", desc: "Average core load", icon: Cpu, progress: 24.6, status: "OPTIMAL" },
    { name: "Memory (RAM) Allocation", value: "3.1 GB / 8.0 GB", desc: "Shared swap cache", icon: Database, progress: 38.7, status: "HEALTHY" },
    { name: "Disk NVMe Capacity", value: "112 GB / 500 GB", desc: "Storage space utilized", icon: HardDrive, progress: 22.4, status: "LOW_DISK_LOAD" },
    { name: "Network Throughput", value: "480 Mb/s", desc: "Ingress/Egress bandwidth", icon: Network, progress: 48.0, status: "STABLE" },
  ];

  const mockLogs = [
    "[INFO]  2026-08-03 12:00:15 - worker-pool-03 started client handshake processes",
    "[INFO]  2026-08-03 12:01:04 - loaded dynamic ssl certs from cloudflare gateway keychains",
    "[DEBUG] 2026-08-03 12:02:11 - query resolved: SELECT * FROM workspaces LIMIT 1 (duration: 3ms)",
    "[WARN]  2026-08-03 12:05:00 - worker-02 threadpool exhaustion threshold reached. Auto-recycling worker thread...",
    "[INFO]  2026-08-03 12:05:02 - worker-02 thread pool recycled. Net threads: 128 active.",
    "[INFO]  2026-08-03 12:10:45 - cache sync complete. redis keys matched: 4,059 items updated."
  ];

  if (resources.length === 0) {
    return (
      <div className="space-y-6 font-mono text-aergus-text">
        <div className="flex justify-between items-center border-b border-aergus-border pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">Observability Insights</h1>
            <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
              Live telemetry, system logs stream, and analytical container events
            </p>
          </div>
        </div>
        <div className="py-16 text-center border border-dashed border-aergus-border rounded bg-aergus-card/20">
          <Terminal className="w-10 h-10 text-aergus-text-dim opacity-35 mx-auto mb-3" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-aergus-text">No metrics telemetry</h4>
          <p className="text-[11px] text-aergus-text-dim mt-1 uppercase font-semibold">
            Connect a resource to initialize container CPU, RAM, and logs streams
          </p>
          <a
            href={`/w/${params.slug}/p/${params.projectSlug}/resources`}
            className="mt-4 inline-block px-4 py-2 border border-aergus-primary text-aergus-primary text-[10px] font-bold uppercase tracking-wider rounded-sm hover:bg-aergus-primary/10 transition-colors"
          >
            CONNECT NEW RESOURCE
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-mono text-aergus-text">
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-aergus-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">Observability Insights</h1>
          <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
            Live telemetry, system logs stream, and analytical container events
          </p>
        </div>
        <div className="flex gap-2">
          {["system", "logs", "events"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveMetricTab(tab as any)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border cursor-pointer transition-colors ${activeMetricTab === tab ? "bg-aergus-primary text-white border-aergus-primary" : "border-aergus-border bg-aergus-card text-aergus-text-dim hover:text-aergus-text"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeMetricTab === "system" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Metrics grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemMetrics.map((met, idx) => (
              <div key={idx} className="bg-aergus-card border border-aergus-border p-5 rounded relative overflow-hidden">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <met.icon className="w-4 h-4 text-aergus-primary" />
                    <span className="text-[10px] font-bold text-aergus-text uppercase tracking-wider">{met.name}</span>
                  </div>
                  <span className="text-[9px] text-green-500 font-bold bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-sm">
                    {met.status}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-aergus-text uppercase mb-1">{met.value}</h3>
                <p className="text-[10px] text-aergus-text-dim/60 font-mono mb-4">{met.desc}</p>
                <div className="w-full h-1.5 bg-aergus-bg border border-aergus-border rounded-full overflow-hidden">
                  <div className="bg-aergus-primary h-full rounded-full" style={{ width: `${met.progress}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Performance chart outline */}
          <div className="bg-aergus-card border border-aergus-border rounded p-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-aergus-text border-b border-aergus-border pb-3 mb-4">
              Resource Telemetry History (CPU vs RAM)
            </h2>
            <div className="h-32 border border-dashed border-aergus-border bg-aergus-bg/25 rounded flex items-center justify-center">
              <BarChart2 className="w-10 h-10 text-aergus-primary opacity-30 animate-pulse" />
            </div>
          </div>
        </div>
      )}

      {activeMetricTab === "logs" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="bg-aergus-card border border-aergus-border rounded p-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-aergus-text">Stdout / Stderr Streams</span>
            <button className="h-7 px-3 border border-aergus-border hover:bg-aergus-card text-[9px] font-bold uppercase tracking-wider rounded text-aergus-text-dim hover:text-aergus-text transition-colors flex items-center gap-1 cursor-pointer">
              <RefreshCw className="w-3 h-3" /> CLEAR BUFFER
            </button>
          </div>

          <div className="bg-aergus-bg border border-aergus-border rounded p-5 h-96 overflow-y-auto font-mono text-xs text-aergus-text-dim space-y-3 leading-relaxed shadow-inner">
            {mockLogs.map((line, idx) => {
              const isWarn = line.includes("[WARN]");
              return (
                <div key={idx} className="flex gap-2.5">
                  <span className="text-aergus-border select-none">{idx + 1}</span>
                  <span className={isWarn ? "text-yellow-500" : "text-green-500"}>{line.split(" - ")[0]}</span>
                  <span className="text-aergus-text/90">{line.split(" - ")[1]}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeMetricTab === "events" && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="border border-aergus-border bg-aergus-card/20 rounded p-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-aergus-text mb-4">Event Logs Index</h3>
            
            <div className="relative pl-6 border-l border-aergus-border space-y-6">
              <div className="relative">
                <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full bg-green-500" />
                <div className="text-xs">
                  <span className="font-bold text-aergus-text block uppercase">Resource health verification passed</span>
                  <span className="text-[10px] text-aergus-text-dim">10 mins ago • Gateway check</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full bg-yellow-500" />
                <div className="text-xs">
                  <span className="font-bold text-aergus-text block uppercase">Server CPU load spike warning [docker-worker-01]</span>
                  <span className="text-[10px] text-aergus-text-dim">4 hours ago • Telemetry warning</span>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -left-[29px] top-1.5 w-2 h-2 rounded-full bg-green-500" />
                <div className="text-xs">
                  <span className="font-bold text-aergus-text block uppercase">Initial secure project schema synchronized</span>
                  <span className="text-[10px] text-aergus-text-dim">Yesterday • Schema config sync</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
