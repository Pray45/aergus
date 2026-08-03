"use client";

import React from "react";
import { Sliders, Zap, Play, Clock, HelpCircle } from "lucide-react";

import { useAutomationStore } from "../../../../../store/automationStore";

export default function ProjectAutomation() {
  const rules = useAutomationStore((state) => state.rules);

  return (
    <div className="space-y-6 font-mono text-aergus-text relative min-h-[75vh]">
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-aergus-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">Workflow Automation</h1>
          <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
            Configure triggers, actions, and automatic scale scripts for your instances
          </p>
        </div>
      </div>

      {/* Main UI layout showing rule panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-40 select-none pointer-events-none">
        {rules.map((rule, idx) => (
          <div key={idx} className="bg-aergus-card border border-aergus-border p-5 rounded relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold text-aergus-text-dim uppercase">STATUS: {rule.status}</span>
              <Sliders className="w-4 h-4 text-aergus-primary" />
            </div>
            <h3 className="font-bold text-xs uppercase text-aergus-text tracking-wide mb-3">{rule.name}</h3>
            
            <div className="space-y-2 border-t border-aergus-border/40 pt-3 text-xs">
              <div>
                <span className="text-[9px] text-aergus-text-dim uppercase block">IF TRIGGER FIRES</span>
                <span className="font-semibold text-aergus-text">{rule.trigger}</span>
              </div>
              <div className="mt-2">
                <span className="text-[9px] text-aergus-text-dim uppercase block">THEN EXECUTE ACTIONS</span>
                <span className="font-semibold text-aergus-primary">{rule.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Polished Coming Soon Overlay */}
      <div className="absolute inset-0 bg-aergus-bg/85 backdrop-blur-sm rounded flex items-center justify-center p-6 border border-aergus-border/40 mt-16">
        <div className="max-w-md text-center space-y-4 font-mono">
          <div className="w-12 h-12 bg-aergus-primary/10 text-aergus-primary border border-aergus-primary/25 rounded flex items-center justify-center mx-auto animate-bounce">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-bold uppercase tracking-widest text-aergus-text">
            AUTOMATION CONSOLE COMING SOON
          </h2>
          <p className="text-xs text-aergus-text-dim leading-relaxed uppercase tracking-tight">
            We are working on full webhook triggers, event callbacks, and scale-up pipelines scripts integration.
          </p>
          <div className="pt-2">
            <span className="px-3 py-1.5 border border-aergus-border rounded text-[9px] text-aergus-text font-bold uppercase tracking-wider bg-aergus-card">
              ESTIMATED DEPLOYMENT: Q3 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
