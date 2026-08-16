"use client";

import React, { useState } from "react";
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
    </div>
  );
}
