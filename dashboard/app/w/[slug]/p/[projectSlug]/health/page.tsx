"use client";

import React from "react";
import { HeartPulse, Check, AlertTriangle, ShieldCheck, ArrowUpRight } from "lucide-react";
import { useResourceStore } from "../../../../../store/resourceStore";
import { useParams } from "next/navigation";

export default function ProjectHealth() {
  const params = useParams();
  const resources = useResourceStore((state) => state.resources);

  const categories = [
    { name: "Node Performance", score: resources.length > 0 ? "96 / 100" : "0 / 100", status: resources.length > 0 ? "OPTIMAL" : "NO_DATA", color: resources.length > 0 ? "text-green-500" : "text-aergus-text-dim" },
    { name: "System Reliability", score: resources.length > 0 ? "99 / 100" : "0 / 100", status: resources.length > 0 ? "HIGH" : "NO_DATA", color: resources.length > 0 ? "text-green-500" : "text-aergus-text-dim" },
    { name: "Security Architecture", score: resources.length > 0 ? "100 / 100" : "0 / 100", status: resources.length > 0 ? "SECURE" : "NO_DATA", color: resources.length > 0 ? "text-green-500" : "text-aergus-text-dim" },
  ];

  const recommendations = [
    {
      id: "1",
      title: "Enable Cloudflare Railgun cache optimization",
      category: "Performance",
      impact: "HIGH",
      desc: "Improves HTML loading performance by caching dynamic changes on upstream resources.",
    },
    {
      id: "2",
      title: "Restrict open TCP ports on bare server nodes",
      category: "Security",
      impact: "CRITICAL",
      desc: "Ports 22 and 80 should be locked down to private proxy addresses to mitigate brute force probes.",
    },
    {
      id: "3",
      title: "Configure primary postgres replica node auto-failover",
      category: "Reliability",
      impact: "MEDIUM",
      desc: "Enable zero-data-loss standby failover mappings to guard against physical host crash failures.",
    },
  ];

  if (resources.length === 0) {
    return (
      <div className="space-y-6 font-mono text-aergus-text">
        <div className="flex justify-between items-center border-b border-aergus-border pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">Health Audit</h1>
            <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
              Security audits, latency benchmarks, and optimization assessments
            </p>
          </div>
        </div>
        <div className="py-16 text-center border border-dashed border-aergus-border rounded bg-aergus-card/20">
          <HeartPulse className="w-10 h-10 text-aergus-text-dim opacity-35 mx-auto mb-3" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-aergus-text">No health score calculated</h4>
          <p className="text-[11px] text-aergus-text-dim mt-1 uppercase font-semibold">
            Connect a resource to run system speed, redundancy, and security vulnerability audits
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
          <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">Health Audit</h1>
          <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
            Security audits, latency benchmarks, and optimization assessments
          </p>
        </div>
      </div>

      {/* Main Score Board */}
      <div className="bg-aergus-card border border-aergus-border rounded p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 left-0 h-full w-[4px] bg-aergus-primary" />
        <div className="space-y-2">
          <span className="text-[9px] text-aergus-text-dim uppercase font-bold tracking-widest block leading-none">
            WORKSPACE CLUSTER REPORT
          </span>
          <h2 className="text-2xl font-bold uppercase tracking-wider text-aergus-text mt-2">
            OVERALL SYSTEM INDEX
          </h2>
          <p className="text-xs text-aergus-text-dim leading-relaxed max-w-lg">
            This grade reflects performance speed, redundancy setups, and credential security.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 select-none">
          <div className="text-right">
            <span className="text-3xl font-bold tracking-tighter text-green-500">98 / 100</span>
            <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest block mt-1">
              ● ACCREDITED_SECURE
            </span>
          </div>
          <div className="w-14 h-14 bg-green-500/10 text-green-500 border border-green-500/25 rounded flex items-center justify-center">
            <HeartPulse className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Performance Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-aergus-card border border-aergus-border p-5 rounded relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold text-aergus-text-dim uppercase tracking-wider">{cat.name}</span>
              <span className={`text-[9px] font-bold bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-sm ${cat.color}`}>
                {cat.status}
              </span>
            </div>
            <h3 className="text-lg font-bold text-aergus-text uppercase">{cat.score}</h3>
          </div>
        ))}
      </div>

      {/* Recommendations index list */}
      <div className="bg-aergus-card border border-aergus-border rounded p-6">
        <h2 className="text-xs font-bold uppercase tracking-wider text-aergus-text border-b border-aergus-border pb-3 mb-4">
          OPTIMIZATION RECOMMENDATIONS ({recommendations.length})
        </h2>
        
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 border border-aergus-border bg-aergus-bg/25 rounded flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-aergus-border px-1.5 py-0.5 rounded text-aergus-text-dim font-bold">
                    {rec.category}
                  </span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm border ${rec.impact === "CRITICAL" ? "text-aergus-primary bg-aergus-primary/10 border-aergus-primary/20" : rec.impact === "HIGH" ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" : "text-blue-500 bg-blue-500/10 border-blue-500/20"}`}>
                    IMPACT: {rec.impact}
                  </span>
                </div>
                <h4 className="font-bold text-xs uppercase text-aergus-text tracking-wide mt-2">
                  {rec.title}
                </h4>
                <p className="text-xs text-aergus-text-dim font-sans leading-relaxed">
                  {rec.desc}
                </p>
              </div>

              <button className="h-8 px-3 border border-aergus-border hover:bg-aergus-card hover:border-aergus-primary/50 text-[10px] font-bold uppercase tracking-wider rounded text-aergus-text-dim hover:text-aergus-text transition-all flex items-center gap-1 shrink-0 cursor-pointer">
                APPLY PATCH <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
