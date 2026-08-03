"use client";

import React, { useState } from "react";
import { ShieldCheck, ShieldAlert, Sliders, Bell, Check, Clock } from "lucide-react";

import { useAlertStore, AlertItem, AlertRule, AlertChannel } from "../../../../../store/alertStore";

export default function ProjectAlerts() {
  const [activeTab, setActiveTab] = useState<"incidents" | "rules" | "channels">("incidents");

  const alerts = useAlertStore((state) => state.alerts);
  const rules = useAlertStore((state) => state.rules);
  const channels = useAlertStore((state) => state.channels);

  const addAlert = useAlertStore((state) => state.addAlert);
  const resolveAlert = useAlertStore((state) => state.resolveAlert);
  const addRule = useAlertStore((state) => state.addRule);
  const addChannel = useAlertStore((state) => state.addChannel);

  const getSeverityBadgeColor = (sev: string) => {
    switch (sev) {
      case "CRITICAL":
        return "text-aergus-primary bg-aergus-primary/10 border-aergus-primary/20";
      default:
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    }
  };

  const handleResolve = (id: string) => {
    resolveAlert(id);
  };

  const activeIncidents = alerts.filter((a) => a.status === "ACTIVE");
  const resolvedIncidents = alerts.filter((a) => a.status === "RESOLVED");

  return (
    <div className="space-y-6 font-mono text-aergus-text">
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-aergus-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">Alerting Console</h1>
          <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
            Configure system rules, resolve incidents, and map notification channels
          </p>
        </div>
        <div className="flex gap-2">
          {["incidents", "rules", "channels"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded border cursor-pointer transition-colors ${activeTab === tab ? "bg-aergus-primary text-white border-aergus-primary" : "border-aergus-border bg-aergus-card text-aergus-text-dim hover:text-aergus-text"}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "incidents" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Active warnings list */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-aergus-text">
              Active Warnings ({activeIncidents.length})
            </h3>
            
            {activeIncidents.length > 0 ? (
              activeIncidents.map((a) => (
                <div key={a.id} className="bg-aergus-card border border-aergus-border p-5 rounded relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="absolute top-0 left-0 h-full w-[3px] bg-aergus-primary" />
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-sm border text-[9px] font-bold tracking-wider ${getSeverityBadgeColor(a.severity)}`}>
                        {a.severity}
                      </span>
                      <span className="text-[10px] text-aergus-text-dim font-bold uppercase tracking-wider">
                        SOURCE: {a.source}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-aergus-text uppercase tracking-wide mt-2">
                      {a.message}
                    </p>
                    <span className="text-[9px] text-aergus-text-dim/60 font-mono uppercase block">
                      DETECTED {a.timestamp}
                    </span>
                  </div>

                  <button
                    onClick={() => handleResolve(a.id)}
                    className="h-8 px-4 border border-green-500/30 hover:bg-green-500 hover:text-white rounded text-[10px] font-bold uppercase tracking-wider text-green-500 transition-colors cursor-pointer"
                  >
                    RESOLVE WARNING
                  </button>
                </div>
              ))
            ) : (
              <div className="py-12 text-center border border-dashed border-aergus-border rounded bg-aergus-card/20">
                <ShieldCheck className="w-9 h-9 text-green-500 mx-auto mb-3" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-aergus-text">No active incidents</h4>
                <p className="text-[11px] text-aergus-text-dim mt-1 uppercase font-semibold">ALL SUB-INSTANCES HEALTHY</p>
                <button
                  onClick={() => addAlert({
                    id: Math.random().toString(),
                    source: "primary-db-postgres",
                    message: "Database connection pool capacity maxed out (94%)",
                    severity: "CRITICAL",
                    timestamp: "Just now",
                    status: "ACTIVE"
                  })}
                  className="mt-4 px-4 py-2 border border-aergus-primary text-aergus-primary text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-aergus-primary/10 transition-colors cursor-pointer"
                >
                  TRIGGER TEST INCIDENT
                </button>
              </div>
            )}
          </div>

          {/* Resolved list */}
          {resolvedIncidents.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-aergus-text-dim">
                RESOLVED INCIDENTS ({resolvedIncidents.length})
              </h3>
              {resolvedIncidents.map((a) => (
                <div key={a.id} className="bg-aergus-card/45 border border-aergus-border/40 p-4 rounded opacity-75 flex justify-between items-center text-xs">
                  <div className="space-y-1">
                    <span className="text-[9px] text-green-500 font-bold uppercase bg-green-500/10 px-1.5 py-0.25 rounded-sm">
                      RESOLVED
                    </span>
                    <span className="text-[10px] text-aergus-text-dim uppercase tracking-wider ml-2">{a.source}</span>
                    <p className="font-bold text-aergus-text uppercase tracking-tight mt-1">{a.message}</p>
                  </div>
                  <span className="text-[9px] text-aergus-text-dim flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {a.timestamp}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "rules" && (
        <div className="animate-in fade-in duration-200">
          {rules.length > 0 ? (
            <div className="bg-aergus-card border border-aergus-border rounded-lg overflow-hidden">
              <div className="p-4 border-b border-aergus-border bg-aergus-bg/40 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-aergus-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-aergus-text">
                  Active Trigger Rules ({rules.length})
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse font-mono text-xs">
                  <thead>
                    <tr className="border-b border-aergus-border text-[10px] text-aergus-text-dim uppercase tracking-wider">
                      <th className="p-4 font-bold">RULE NAME</th>
                      <th className="p-4 font-bold">METRIC CONDITION</th>
                      <th className="p-4 font-bold">TRIGGER DELAY</th>
                      <th className="p-4 font-bold text-right">DISPATCH TARGETS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rules.map((rule, idx) => (
                      <tr key={idx} className="border-b border-aergus-border/40">
                        <td className="p-4 font-bold text-aergus-text uppercase">{rule.name}</td>
                        <td className="p-4 text-aergus-primary font-bold">{rule.condition}</td>
                        <td className="p-4 text-aergus-text-dim">{rule.trigger}</td>
                        <td className="p-4 text-right">
                          <div className="flex gap-1.5 justify-end">
                            {rule.channels.map((chan, cIdx) => (
                              <span key={cIdx} className="text-[9px] bg-aergus-bg border border-aergus-border px-1.5 py-0.5 rounded text-aergus-text-dim">
                                {chan}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-aergus-border rounded bg-aergus-card/20 font-mono">
              <Sliders className="w-9 h-9 text-aergus-text-dim opacity-30 mx-auto mb-3" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-aergus-text">No alert rules configured</h4>
              <p className="text-[11px] text-aergus-text-dim mt-1 uppercase font-semibold">Define trigger conditions for automated notifications</p>
              <button
                onClick={() => addRule({
                  id: Math.random().toString(),
                  name: "High CPU threshold",
                  condition: "cpu.load > 85%",
                  trigger: "Immediate",
                  channels: ["Slack", "Email"]
                })}
                className="mt-4 px-4 py-2 border border-aergus-primary text-aergus-primary text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-aergus-primary/10 transition-colors cursor-pointer"
              >
                CREATE DEFAULT RULE
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === "channels" && (
        <div className="animate-in fade-in duration-200">
          {channels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {channels.map((chan, idx) => (
                <div key={idx} className="bg-aergus-card border border-aergus-border p-5 rounded relative overflow-hidden flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-bold text-aergus-text-dim uppercase">{chan.type}</span>
                      <span className="text-[9px] text-green-500 font-bold bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-sm">
                        {chan.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-xs uppercase text-aergus-text tracking-wide mb-1">
                      {chan.name}
                    </h4>
                    <p className="text-[11px] text-aergus-text-dim/80 font-mono break-all mt-2">
                      {chan.target}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-aergus-border/40 flex justify-end">
                    <button className="text-[10px] font-bold text-aergus-primary hover:underline cursor-pointer">
                      TEST PATH
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center border border-dashed border-aergus-border rounded bg-aergus-card/20 font-mono col-span-3">
              <Bell className="w-9 h-9 text-aergus-text-dim opacity-30 mx-auto mb-3" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-aergus-text">No dispatch channels configured</h4>
              <p className="text-[11px] text-aergus-text-dim mt-1 uppercase font-semibold">Map email, Slack, or PagerDuty integrations</p>
              <button
                onClick={() => addChannel({
                  id: Math.random().toString(),
                  name: "Slack Ops channel",
                  type: "Slack Webhook",
                  target: "#ops-alerts",
                  status: "VERIFIED"
                })}
                className="mt-4 px-4 py-2 border border-aergus-primary text-aergus-primary text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-aergus-primary/10 transition-colors cursor-pointer"
              >
                REGISTER DEFAULT CHANNEL
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
