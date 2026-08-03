"use client";

import React, { useState } from "react";
import { Terminal, Plus, Key, Copy, Check, Trash } from "lucide-react";
import { Card } from "../../(auth)/authComponent/Card";
import { Field } from "../../(auth)/authComponent/Field";
import { Button } from "../../(auth)/authComponent/Button";
import { useToastStore } from "../../store/toastStore";

interface ApiKey {
  id: string;
  name: string;
  token: string;
  scope: string;
  createdAt: string;
}

export default function DeveloperApiKeys() {
  const addToast = useToastStore((state) => state.addToast);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [scope, setScope] = useState("READ-WRITE");
  const [creating, setCreating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [keys, setKeys] = useState<ApiKey[]>([
    {
      id: "1",
      name: "CLI Tool Token",
      token: "arg_live_9a7d32c1ebf04f29a00d5a0de79ff103",
      scope: "READ-WRITE",
      createdAt: "10 days ago",
    },
    {
      id: "2",
      name: "CI/CD Deployment pipeline",
      token: "arg_live_7c8d990021ffef32aa410d5ac91ff023",
      scope: "READ-ONLY",
      createdAt: "30 days ago",
    },
  ]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    setCreating(true);
    setTimeout(() => {
      const generatedToken = "arg_live_" + Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("");
      const newKey: ApiKey = {
        id: Math.random().toString(),
        name,
        token: generatedToken,
        scope,
        createdAt: "Just now",
      };

      setKeys((prev) => [newKey, ...prev]);
      addToast("NEW LIVE API TOKEN SECURED MAPPING SUCCESS", "success");
      setName("");
      setShowCreate(false);
      setCreating(false);
    }, 600);
  };

  const handleCopy = (id: string, token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedId(id);
    addToast("TOKEN COPIED TO CLIPBOARD", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: string) => {
    setKeys((prev) => prev.filter((k) => k.id !== id));
    addToast("API KEY DE-AUTHORIZED", "success");
  };

  return (
    <div className="space-y-6 font-mono text-aergus-text max-w-5xl mx-auto">
      <div className="flex justify-between items-center border-b border-aergus-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">API Authentication</h1>
          <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
            Provision and manage secure access credentials for API integrations
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="h-9 px-4 bg-aergus-primary text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-aergus-primary-hover active:scale-[0.99] transition-all cursor-pointer"
        >
          {showCreate ? "CLOSE CONSOLE" : "+ GENERATE API KEY"}
        </button>
      </div>

      {showCreate && (
        <div className="max-w-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <Card
            title="Generate API Token"
            subtitle="Configure scope and credentials settings"
            systemState={creating ? "STATUS: GENERATING..." : "STATUS: READY"}
          >
            <form onSubmit={handleGenerate} className="space-y-4 mt-6">
              <Field
                label="API KEY LABEL"
                placeholder="PROD-GATEWAY-ACCESS"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-aergus-text uppercase tracking-widest">
                  ACCESS SCOPE
                </label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}
                  className="h-12 bg-aergus-card border border-aergus-border px-4 rounded text-xs focus:outline-none focus:border-aergus-primary font-mono text-aergus-text"
                >
                  <option value="READ-WRITE">READ-WRITE (Full access)</option>
                  <option value="READ-ONLY">READ-ONLY (Telemetry metrics access)</option>
                </select>
              </div>

              <Button type="submit" disabled={creating}>
                {creating ? "GENERATING KEY..." : "CONFIRM GENERATION"}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Keys List */}
      <div className="bg-aergus-card border border-aergus-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-aergus-border bg-aergus-bg/40 flex items-center gap-2">
          <Key className="w-4 h-4 text-aergus-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-aergus-text">
            Active Security Keys ({keys.length})
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-aergus-border text-[10px] text-aergus-text-dim uppercase tracking-wider">
                <th className="p-4 font-bold">KEY DESCRIPTION</th>
                <th className="p-4 font-bold">LIVE API TOKEN</th>
                <th className="p-4 font-bold">SCOPE</th>
                <th className="p-4 font-bold">CREATED</th>
                <th className="p-4 font-bold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id} className="border-b border-aergus-border/40 hover:bg-aergus-text/[0.01] transition-colors">
                  <td className="p-4 font-bold text-aergus-text uppercase">{k.name}</td>
                  <td className="p-4 font-mono text-[11px] text-aergus-primary flex items-center gap-2">
                    <span className="bg-aergus-bg px-2 py-1 border border-aergus-border rounded select-all font-mono">
                      {k.token.slice(0, 12)}...{k.token.slice(-6)}
                    </span>
                    <button
                      onClick={() => handleCopy(k.id, k.token)}
                      className="p-1.5 rounded hover:bg-aergus-border transition-colors text-aergus-text-dim hover:text-aergus-text cursor-pointer"
                    >
                      {copiedId === k.id ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-sm border border-aergus-primary/20 bg-aergus-primary/10 text-[9px] font-bold text-aergus-primary tracking-wider">
                      {k.scope}
                    </span>
                  </td>
                  <td className="p-4 text-aergus-text-dim">{k.createdAt}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(k.id)}
                      className="p-1.5 rounded hover:bg-aergus-primary/10 text-aergus-text-dim hover:text-aergus-primary transition-colors cursor-pointer"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
