"use client";

import React, { useState } from "react";
import { Blocks, Check, ShieldAlert, ArrowUpRight } from "lucide-react";
import { useToastStore } from "../../../../../store/toastStore";

import { useIntegrationStore, Provider } from "../../../../../store/integrationStore";

export default function ProjectIntegrations() {
  const addToast = useToastStore((state) => state.addToast);
  const providers = useIntegrationStore((state) => state.providers);
  const connectProvider = useIntegrationStore((state) => state.connectProvider);
  const disconnectProvider = useIntegrationStore((state) => state.disconnectProvider);

  const handleConnect = (id: string, name: string) => {
    connectProvider(id);
    addToast(`${name.toUpperCase()} PROVIDER CONNECTED`, "success");
  };

  const getStatusBadge = (prov: Provider) => {
    switch (prov.status) {
      case "CONNECTED":
        return (
          <span className="flex items-center gap-1 text-[9px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-sm">
            <Check className="w-3.5 h-3.5" /> CONNECTED
          </span>
        );
      case "AVAILABLE":
        return (
          <span className="text-[9px] font-bold text-blue-500 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-sm">
            AVAILABLE
          </span>
        );
      default:
        return (
          <span className="text-[9px] font-bold text-aergus-text-dim/60 bg-aergus-border border border-aergus-border px-1.5 py-0.5 rounded-sm">
            COMING SOON
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-mono text-aergus-text">
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-aergus-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">Provider Marketplace</h1>
          <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
            Integrate infrastructure networks, code repositories and database metrics
          </p>
        </div>
      </div>

      {/* Grid providers list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((prov) => (
          <div
            key={prov.id}
            className={`bg-aergus-card border border-aergus-border rounded p-5 flex flex-col justify-between transition-colors hover:border-aergus-primary/30 ${prov.status === "COMING_SOON" ? "opacity-60" : ""}`}
          >
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[10px] text-aergus-text-dim font-bold uppercase">{prov.category}</span>
                {getStatusBadge(prov)}
              </div>
              
              <h3 className="font-bold text-sm uppercase text-aergus-text tracking-wide mb-2">
                {prov.name}
              </h3>
              
              <p className="text-xs text-aergus-text-dim font-sans leading-relaxed mt-2">
                {prov.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-aergus-border/40 flex justify-end">
              {prov.status === "CONNECTED" && (
                <button
                  onClick={() => {
                    disconnectProvider(prov.id);
                    addToast("CONNECTION TERMINATED", "success");
                  }}
                  className="text-[10px] font-bold text-aergus-primary hover:underline cursor-pointer"
                >
                  DISCONNECT
                </button>
              )}
              {prov.status === "AVAILABLE" && (
                <button
                  onClick={() => handleConnect(prov.id, prov.name)}
                  className="h-8 px-4 bg-aergus-primary hover:bg-aergus-primary-hover text-white text-[10px] font-bold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  CONNECT
                </button>
              )}
              {prov.status === "COMING_SOON" && (
                <span className="text-[10px] font-bold text-aergus-text-dim/40 cursor-not-allowed">
                  RESTRICTED
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
