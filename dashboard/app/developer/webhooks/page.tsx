"use client";

import React, { useState } from "react";
import { Blocks, Plus, Globe, Shield, Trash, Check } from "lucide-react";
import { Card } from "../../(auth)/authComponent/Card";
import { Field } from "../../(auth)/authComponent/Field";
import { Button } from "../../(auth)/authComponent/Button";
import { useToastStore } from "../../store/toastStore";

interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}

export default function DeveloperWebhooks() {
  const addToast = useToastStore((state) => state.addToast);
  const [showAdd, setShowAdd] = useState(false);
  const [url, setUrl] = useState("");
  const [adding, setAdding] = useState(false);

  const [hooks, setHooks] = useState<Webhook[]>([
    {
      id: "1",
      url: "https://api.acme.sh/webhooks/aergus-receiver",
      events: ["resource.critical", "alert.triggered"],
      status: "ACTIVE",
      createdAt: "5 days ago",
    },
    {
      id: "2",
      url: "https://hooks.slack.com/services/T00/B00/X00",
      events: ["*"],
      status: "ACTIVE",
      createdAt: "12 days ago",
    },
  ]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setAdding(true);
    setTimeout(() => {
      const newHook: Webhook = {
        id: Math.random().toString(),
        url,
        events: ["resource.state_change", "alert.triggered"],
        status: "ACTIVE",
        createdAt: "Just now",
      };

      setHooks((prev) => [...prev, newHook]);
      addToast("WEBHOOK ENDPOINT SUBSCRIBED", "success");
      setUrl("");
      setShowAdd(false);
      setAdding(false);
    }, 500);
  };

  const handleDelete = (id: string) => {
    setHooks((prev) => prev.filter((h) => h.id !== id));
    addToast("WEBHOOK ENDPOINT REMOVED", "success");
  };

  return (
    <div className="space-y-6 font-mono text-aergus-text max-w-5xl mx-auto">
      <div className="flex justify-between items-center border-b border-aergus-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">Webhook Subscriptions</h1>
          <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
            Configure target webhook endpoints to listen to core infrastructure events
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="h-9 px-4 bg-aergus-primary text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-aergus-primary-hover active:scale-[0.99] transition-all cursor-pointer"
        >
          {showAdd ? "CLOSE CONSOLE" : "+ ADD ENDPOINT"}
        </button>
      </div>

      {showAdd && (
        <div className="max-w-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <Card
            title="Register Webhook"
            subtitle="Subscribe endpoint URL to event triggers"
            systemState={adding ? "STATUS: SUBSCRIBING..." : "STATUS: READY"}
          >
            <form onSubmit={handleAdd} className="space-y-4 mt-6">
              <Field
                label="TARGET ENDPOINT URL"
                placeholder="https://api.yourdomain.com/aergus-events"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                type="text"
              />

              <div className="p-4 bg-aergus-bg border border-aergus-border rounded text-xs space-y-2">
                <span className="text-[10px] font-bold text-aergus-text-dim uppercase tracking-wider">
                  DEFAULT EVENTS (AUTO-SUBSCRIBED):
                </span>
                <ul className="text-aergus-text space-y-1">
                  <li>• <span className="font-bold">resource.state_change</span></li>
                  <li>• <span className="font-bold">alert.triggered</span></li>
                </ul>
              </div>

              <Button type="submit" disabled={adding}>
                {adding ? "SUBSCRIBING ENDPOINT..." : "CONFIRM SUBSCRIPTION"}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Webhooks catalog */}
      <div className="grid grid-cols-1 gap-6">
        {hooks.map((h) => (
          <div
            key={h.id}
            className="bg-aergus-card border border-aergus-border rounded p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 rounded-sm">
                  {h.status}
                </span>
                <span className="text-[10px] text-aergus-text-dim uppercase font-semibold">
                  CREATED {h.createdAt}
                </span>
              </div>
              <h3 className="font-bold text-xs text-aergus-text break-all tracking-wide">
                {h.url}
              </h3>
              <div className="flex gap-1.5 flex-wrap">
                {h.events.map((e, idx) => (
                  <span key={idx} className="text-[9px] bg-aergus-bg border border-aergus-border px-1.5 py-0.5 rounded text-aergus-text-dim">
                    {e}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 justify-end">
              <button
                onClick={() => handleDelete(h.id)}
                className="p-2 border border-aergus-border rounded text-aergus-text-dim hover:text-aergus-primary hover:border-aergus-primary/50 transition-colors cursor-pointer"
              >
                <Trash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
