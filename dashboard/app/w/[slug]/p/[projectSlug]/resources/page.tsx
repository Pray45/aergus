"use client";

import React, { useState } from "react";
import { Card } from "../../../../../(auth)/authComponent/Card";
import { Field } from "../../../../../(auth)/authComponent/Field";
import { Button } from "../../../../../(auth)/authComponent/Button";
import { useToastStore } from "../../../../../store/toastStore";
import {
  Globe,
  Database,
  Server,
  Terminal,
  Activity,
  Layers,
  Search,
  Filter,
  PlusCircle,
  X,
  Sliders,
  ChevronRight,
} from "lucide-react";

import { useResourceStore, Resource } from "../../../../../store/resourceStore";

export default function ProjectResources() {
  const addToast = useToastStore((state) => state.addToast);
  const resources = useResourceStore((state) => state.resources);
  const addResource = useResourceStore((state) => state.addResource);
  const removeResource = useResourceStore((state) => state.removeResource);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "logs" | "config">("overview");

  // modal creation state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newType, setNewType] = useState<Resource["type"]>("Server");
  const [newProvider, setNewProvider] = useState<Resource["provider"]>("Linux");
  const [newTags, setNewTags] = useState("");

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newRes: Resource = {
      id: Math.random().toString(),
      name: newName,
      type: newType,
      provider: newProvider,
      status: "ACTIVE",
      health: 100,
      tags: newTags ? newTags.split(",").map((t) => t.trim()) : ["dev"],
      lastCheck: "Just now",
    };

    addResource(newRes);
    addToast("NEW SECURE INSTANCE RESOURCE ADDED", "success");
    setNewName("");
    setNewTags("");
    setShowAddModal(false);
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "Website":
      case "Certificate":
        return Globe;
      case "Database":
        return Database;
      case "Docker Host":
      case "Container":
        return Layers;
      default:
        return Server;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "text-green-500 bg-green-500/10 border-green-500/20";
      case "WARNING":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "CRITICAL":
        return "text-aergus-primary bg-aergus-primary/10 border-aergus-primary/20";
      default:
        return "text-aergus-text-dim bg-aergus-card border-aergus-border";
    }
  };

  const filteredResources = resources.filter((res) => {
    const matchesSearch = res.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || res.type === typeFilter;
    const matchesStatus = statusFilter === "ALL" || res.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6 font-mono text-aergus-text relative min-h-[80vh]">
      {/* Header section */}
      <div className="flex justify-between items-center border-b border-aergus-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">Infrastructure Inventory</h1>
          <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
            Manage your websites, databases, nodes and containers catalog
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="h-9 px-4 bg-aergus-primary text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-aergus-primary-hover active:scale-[0.99] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4" /> ADD RESOURCE
        </button>
      </div>

      {/* Toolbar controls */}
      <div className="flex flex-col md:flex-row gap-4 p-4 border border-aergus-border rounded bg-aergus-card/20">
        <div className="flex-1 relative flex items-center">
          <Search className="w-4 h-4 text-aergus-text-dim absolute left-3 pointer-events-none" />
          <input
            type="search"
            placeholder="Search resource node name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 border border-aergus-border bg-aergus-bg rounded text-xs focus:outline-none focus:border-aergus-primary font-mono"
          />
        </div>

        <div className="flex gap-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 px-3 bg-aergus-bg border border-aergus-border text-xs rounded focus:outline-none focus:border-aergus-primary font-mono text-aergus-text-dim hover:text-aergus-text"
          >
            <option value="ALL">ALL TYPES</option>
            <option value="Website">WEBSITES</option>
            <option value="Server">SERVERS</option>
            <option value="Database">DATABASES</option>
            <option value="Docker Host">DOCKER HOSTS</option>
            <option value="Container">CONTAINERS</option>
            <option value="Certificate">CERTIFICATES</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 bg-aergus-bg border border-aergus-border text-xs rounded focus:outline-none focus:border-aergus-primary font-mono text-aergus-text-dim hover:text-aergus-text"
          >
            <option value="ALL">ALL STATUSES</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="WARNING">WARNING</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </div>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((res) => {
          const Icon = getResourceIcon(res.type);
          return (
            <div
              key={res.id}
              onClick={() => setSelectedResource(res)}
              className="bg-aergus-card border border-aergus-border rounded p-5 hover:border-aergus-primary/40 transition-colors flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-aergus-primary/5 text-aergus-primary border border-aergus-primary/20 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs uppercase text-aergus-text tracking-wider group-hover:text-aergus-primary transition-colors">
                        {res.name}
                      </h3>
                      <span className="text-[9px] text-aergus-text-dim uppercase tracking-wider block">
                        {res.type} • {res.provider}
                      </span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-sm border text-[9px] font-bold tracking-wider ${getStatusColor(res.status)}`}>
                    {res.status}
                  </span>
                </div>

                <div className="flex gap-1.5 flex-wrap my-3">
                  {res.tags.map((t, idx) => (
                    <span key={idx} className="text-[9px] bg-aergus-bg border border-aergus-border px-1.5 py-0.5 rounded text-aergus-text-dim/80 font-mono">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-aergus-border/40 flex justify-between items-center text-[10px] text-aergus-text-dim font-mono">
                <span>HEALTH: <span className="font-bold text-aergus-text">{res.health}%</span></span>
                <span>CHECKED {res.lastCheck}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Creation Modal dialog */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-[480px]">
            <Card
              title="Add Node Resource"
              subtitle="Connect a new service or server to project"
              systemState="PROVISION: SECURE"
            >
              <form onSubmit={handleAddResource} className="space-y-4 mt-6">
                <Field
                  label="RESOURCE NODE NAME"
                  placeholder="prod-redis-cache"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-aergus-text uppercase tracking-widest">
                    RESOURCE TYPE
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="h-12 bg-aergus-card border border-aergus-border px-4 rounded text-xs focus:outline-none focus:border-aergus-primary font-mono text-aergus-text"
                  >
                    <option value="Server">Server Instance</option>
                    <option value="Website">Website Endpoint</option>
                    <option value="Database">Database Cluster</option>
                    <option value="Docker Host">Docker Engine Host</option>
                    <option value="Container">Docker Container</option>
                    <option value="Certificate">SSL/TLS Certificate</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold text-aergus-text uppercase tracking-widest">
                    CLOUD PROVIDER
                  </label>
                  <select
                    value={newProvider}
                    onChange={(e) => setNewProvider(e.target.value as any)}
                    className="h-12 bg-aergus-card border border-aergus-border px-4 rounded text-xs focus:outline-none focus:border-aergus-primary font-mono text-aergus-text"
                  >
                    <option value="Linux">Bare Linux Kernel</option>
                    <option value="AWS">Amazon Web Services</option>
                    <option value="Cloudflare">Cloudflare Infrastructure</option>
                    <option value="Docker">Docker Engine</option>
                    <option value="Azure">Microsoft Azure</option>
                    <option value="Self-Hosted">Self-Hosted / Core Node</option>
                  </select>
                </div>

                <Field
                  label="TAGS (COMMA SEPARATED)"
                  placeholder="production, cache, redis"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                />

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 h-12 border border-aergus-border text-aergus-text font-mono font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-aergus-text/[0.05] cursor-pointer"
                  >
                    CANCEL
                  </button>
                  <Button type="submit">CONNECT NODE</Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* Slide-out details Drawer panel */}
      {selectedResource && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 transition-opacity" onClick={() => setSelectedResource(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-[560px] bg-aergus-card border-l border-aergus-border shadow-2xl z-50 flex flex-col font-mono animate-in slide-in-from-right duration-250">
            {/* Header info */}
            <div className="p-6 border-b border-aergus-border flex items-center justify-between bg-aergus-bg/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-aergus-primary/10 text-aergus-primary flex items-center justify-center border border-aergus-primary/20">
                  {React.createElement(getResourceIcon(selectedResource.type), { className: "w-4 h-4" })}
                </div>
                <div>
                  <h2 className="font-bold text-sm uppercase text-aergus-text tracking-wider">{selectedResource.name}</h2>
                  <span className="text-[9px] text-aergus-text-dim uppercase tracking-wider block">
                    {selectedResource.type} • {selectedResource.provider}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="p-1 rounded hover:bg-aergus-border transition-colors text-aergus-text-dim hover:text-aergus-text cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-aergus-border bg-aergus-bg/20 text-[10px] uppercase font-bold tracking-wider">
              {["overview", "metrics", "logs", "config"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex-1 py-3 text-center border-r border-aergus-border cursor-pointer transition-colors ${activeTab === tab ? "bg-aergus-bg text-aergus-primary font-bold" : "text-aergus-text-dim hover:text-aergus-text"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Drawer Body content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === "overview" && (
                <div className="space-y-6 text-xs">
                  <div className="grid grid-cols-2 gap-4 border border-aergus-border p-4 bg-aergus-bg/30 rounded-sm">
                    <div>
                      <span className="text-[10px] text-aergus-text-dim uppercase block">HEALTH STATUS</span>
                      <span className="font-bold text-aergus-text">● {selectedResource.status}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-aergus-text-dim uppercase block">HEALTH ACCURACY</span>
                      <span className="font-bold text-aergus-text">{selectedResource.health}%</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] text-aergus-text-dim uppercase block">PING DELAY</span>
                      <span className="font-bold text-aergus-text">14ms</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-[10px] text-aergus-text-dim uppercase block">LAST COMPLIANCE RUN</span>
                      <span className="font-bold text-aergus-text">{selectedResource.lastCheck}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[10px] font-bold text-aergus-text uppercase mb-2">Metadata Details</h4>
                    <p className="text-aergus-text-dim leading-relaxed bg-aergus-bg/20 p-4 border border-aergus-border rounded-sm">
                      This instance is cataloged and fully secure under secure workspace token mappings. Network traffic is routed through encrypted reverse proxy nodes.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "metrics" && (
                <div className="space-y-6">
                  <div className="border border-aergus-border rounded p-4 bg-aergus-bg/30">
                    <h4 className="text-[10px] font-bold text-aergus-text uppercase mb-3">Processor Load (CPU)</h4>
                    <div className="h-20 flex items-end gap-1 px-2 border-b border-aergus-border/40 pb-2">
                      <div className="flex-1 bg-aergus-primary/20 h-10 rounded-sm hover:bg-aergus-primary transition-colors" />
                      <div className="flex-1 bg-aergus-primary/20 h-14 rounded-sm hover:bg-aergus-primary transition-colors" />
                      <div className="flex-1 bg-aergus-primary/20 h-8 rounded-sm hover:bg-aergus-primary transition-colors" />
                      <div className="flex-1 bg-aergus-primary/20 h-12 rounded-sm hover:bg-aergus-primary transition-colors" />
                      <div className="flex-1 bg-aergus-primary/20 h-20 rounded-sm hover:bg-aergus-primary transition-colors" />
                      <div className="flex-1 bg-aergus-primary/20 h-16 rounded-sm hover:bg-aergus-primary transition-colors" />
                    </div>
                    <div className="flex justify-between text-[8px] text-aergus-text-dim mt-2">
                      <span>15:00</span>
                      <span>15:10</span>
                      <span>15:20</span>
                    </div>
                  </div>

                  <div className="border border-aergus-border rounded p-4 bg-aergus-bg/30">
                    <h4 className="text-[10px] font-bold text-aergus-text uppercase mb-3">Memory Consumption (RAM)</h4>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-aergus-text-dim">ALLOCATED MEMORY</span>
                      <span className="font-bold text-aergus-text">1.2 GB / 4.0 GB</span>
                    </div>
                    <div className="w-full h-2 bg-aergus-bg border border-aergus-border rounded-full mt-2 overflow-hidden">
                      <div className="bg-aergus-primary h-full rounded-full" style={{ width: "30%" }} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "logs" && (
                <div className="bg-aergus-bg border border-aergus-border p-4 rounded text-[10.5px] text-aergus-text-dim space-y-2 h-80 overflow-y-auto font-mono">
                  <div className="flex gap-2">
                    <span className="text-green-500">[OK]</span>
                    <span>System daemon loaded config metrics successfully.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-green-500">[OK]</span>
                    <span>Established TLS connection handshake with upstream proxy gateway.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-green-500">[OK]</span>
                    <span>Health probe sent from docker-engine. Status: 200 OK.</span>
                  </div>
                  <div className="flex gap-2 text-yellow-500">
                    <span>[WARN]</span>
                    <span>Internal database connection pool latency spike: 120ms.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-green-500">[OK]</span>
                    <span>Automatic token keys rotatated. Next check in 23h59m.</span>
                  </div>
                </div>
              )}

              {activeTab === "config" && (
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-aergus-text uppercase block mb-1">Service definition configuration (JSON)</span>
                  <pre className="p-4 bg-aergus-bg border border-aergus-border rounded text-[10.5px] text-aergus-primary overflow-x-auto font-mono leading-relaxed">
{`{
  "instance": "${selectedResource.name}",
  "type": "${selectedResource.type}",
  "provider": "${selectedResource.provider}",
  "port": 8080,
  "secure": true,
  "health_threshold": ${selectedResource.health},
  "tags": ${JSON.stringify(selectedResource.tags)}
}`}
                  </pre>
                </div>
              )}
            </div>
            
            {/* Footer deletion controls */}
            <div className="p-4 border-t border-aergus-border bg-aergus-bg/40 flex gap-4">
              <button
                onClick={() => {
                  removeResource(selectedResource.id);
                  addToast("RESOURCE TERMINATED", "success");
                  setSelectedResource(null);
                }}
                className="w-full py-2 bg-aergus-primary/10 hover:bg-aergus-primary hover:text-white border border-aergus-primary/30 rounded text-[10px] font-bold uppercase tracking-wider text-aergus-primary transition-all cursor-pointer"
              >
                TERMINATE RESOURCE NODE
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
