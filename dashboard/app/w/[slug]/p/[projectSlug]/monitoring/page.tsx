"use client";

import React from "react";
import { Activity, ShieldAlert, CheckCircle, Globe, RefreshCw, BarChart2 } from "lucide-react";
import { useResourceStore } from "../../../../../store/resourceStore";
import { useParams } from "next/navigation";

export default function ProjectMonitoring() {
  const params = useParams();
  const resources = useResourceStore((state) => state.resources);

  const monitors = resources
    .filter((r) => r.type === "Website" || r.type === "Server" || r.type === "Database")
    .map((r) => ({
      name: r.name,
      type: r.type === "Website" ? "HTTP/HTTPS" : r.type === "Database" ? "TCP PING" : "PORT PROBE",
      status: r.status === "ACTIVE" ? "ONLINE" : r.status === "WARNING" ? "DEGRADED" : "OFFLINE",
      latency: r.status === "ACTIVE" ? "12ms" : r.status === "WARNING" ? "142ms" : "N/A",
      uptime: r.status === "ACTIVE" ? "100%" : "98.4%",
      sslExp: r.type === "Website" ? "89 days" : "N/A"
    }));

  if (resources.length === 0) {
    return (
      <div className="space-y-6 font-mono text-aergus-text">
        <div className="flex justify-between items-center border-b border-aergus-border pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">External Monitors</h1>
            <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
              Live availability status, DNS propagation delays, and SSL validity
            </p>
          </div>
        </div>
        <div className="py-16 text-center border border-dashed border-aergus-border rounded bg-aergus-card/20">
          <Activity className="w-10 h-10 text-aergus-text-dim opacity-35 mx-auto mb-3" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-aergus-text">No active monitors</h4>
          <p className="text-[11px] text-aergus-text-dim mt-1 uppercase font-semibold">
            Please map a resource node to monitor latency and HTTP uptime streams
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
          <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">External Monitors</h1>
          <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
            Live availability status, DNS propagation delays, and SSL validity
          </p>
        </div>
        <button className="h-8 px-3 border border-aergus-border hover:bg-aergus-card text-[10px] font-bold uppercase tracking-wider rounded text-aergus-text-dim hover:text-aergus-text transition-colors flex items-center gap-1.5 cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" /> RE-PROBE ALL
        </button>
      </div>

      {/* Latency latency graph overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Latency status metrics */}
        <div className="bg-aergus-card border border-aergus-border p-5 rounded relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-aergus-text-dim uppercase tracking-wider">Average Delay</span>
            <Activity className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-aergus-text">12.0 ms</h3>
          <p className="text-[9px] text-green-500 font-mono mt-1">● OPTIMAL PERFORMANCE</p>
        </div>

        <div className="bg-aergus-card border border-aergus-border p-5 rounded relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-aergus-text-dim uppercase tracking-wider">SSL Validations</span>
            <CheckCircle className="w-4 h-4 text-aergus-primary" />
          </div>
          <h3 className="text-xl font-bold text-aergus-text">{monitors.filter(m => m.sslExp !== "N/A").length} Active</h3>
          <p className="text-[9px] text-aergus-text-dim/60 font-mono mt-1">NO CERTIFICATE ALERTS</p>
        </div>

        <div className="bg-aergus-card border border-aergus-border p-5 rounded relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-bold text-aergus-text-dim uppercase tracking-wider">DNS Status</span>
            <Globe className="w-4 h-4 text-green-500" />
          </div>
          <h3 className="text-xl font-bold text-aergus-text">100% Resolved</h3>
          <p className="text-[9px] text-green-500 font-mono mt-1">● PROPAGATION HEALTHY</p>
        </div>
      </div>

      {/* Monitors Listing Table */}
      <div className="bg-aergus-card border border-aergus-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-aergus-border bg-aergus-bg/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-aergus-primary" />
            <span className="text-xs font-bold uppercase tracking-wider text-aergus-text">
              Active Targets ({monitors.length})
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-aergus-border text-[10px] text-aergus-text-dim uppercase tracking-wider">
                <th className="p-4 font-bold">MONITOR HOSTNAME</th>
                <th className="p-4 font-bold">PROBE METHOD</th>
                <th className="p-4 font-bold">LATENCY</th>
                <th className="p-4 font-bold">UPTIME (30D)</th>
                <th className="p-4 font-bold">SSL EXPIRY</th>
                <th className="p-4 font-bold">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {monitors.map((m, idx) => (
                <tr key={idx} className="border-b border-aergus-border/40 hover:bg-aergus-text/[0.01] transition-colors">
                  <td className="p-4 font-bold text-aergus-text uppercase">{m.name}</td>
                  <td className="p-4 text-aergus-text-dim">{m.type}</td>
                  <td className="p-4 font-bold text-green-500">{m.latency}</td>
                  <td className="p-4 text-aergus-text">{m.uptime}</td>
                  <td className="p-4 text-aergus-text-dim">{m.sslExp}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-sm border border-green-500/20 bg-green-500/10 text-[9px] font-bold text-green-500 tracking-wider">
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Latency History Chart Outline */}
      <div className="bg-aergus-card border border-aergus-border rounded p-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-aergus-text border-b border-aergus-border pb-3 mb-4">
          LATENCY HISTORY TIMELINE (LAST 24 HOURS)
        </h2>
        <div className="h-44 border border-dashed border-aergus-border bg-aergus-bg/20 rounded flex flex-col justify-end p-4">
          <div className="flex-1 flex items-end gap-1.5 border-b border-aergus-border/30 pb-1">
            <div className="flex-1 bg-green-500/20 h-16 hover:bg-green-500 transition-all rounded-sm" title="Latency: 14ms" />
            <div className="flex-1 bg-green-500/20 h-14 hover:bg-green-500 transition-all rounded-sm" />
            <div className="flex-1 bg-green-500/20 h-18 hover:bg-green-500 transition-all rounded-sm" />
            <div className="flex-1 bg-green-500/20 h-28 hover:bg-green-500 transition-all rounded-sm" />
            <div className="flex-1 bg-green-500/20 h-16 hover:bg-green-500 transition-all rounded-sm" />
            <div className="flex-1 bg-green-500/20 h-22 hover:bg-green-500 transition-all rounded-sm" />
            <div className="flex-1 bg-green-500/20 h-14 hover:bg-green-500 transition-all rounded-sm" />
            <div className="flex-1 bg-green-500/20 h-16 hover:bg-green-500 transition-all rounded-sm" />
            <div className="flex-1 bg-green-500/20 h-18 hover:bg-green-500 transition-all rounded-sm" />
            <div className="flex-1 bg-green-500/20 h-14 hover:bg-green-500 transition-all rounded-sm" />
            <div className="flex-1 bg-green-500/20 h-20 hover:bg-green-500 transition-all rounded-sm" />
          </div>
          <div className="flex justify-between text-[8px] text-aergus-text-dim mt-2 font-mono">
            <span>24 HOURS AGO</span>
            <span>12 HOURS AGO</span>
            <span>JUST NOW</span>
          </div>
        </div>
      </div>
    </div>
  );
}
