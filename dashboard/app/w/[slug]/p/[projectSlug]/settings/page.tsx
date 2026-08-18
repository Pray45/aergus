"use client";

import React, { useState, useEffect } from "react";
import { useWorkspaceStore } from "../../../../../store/workspaceStore";
import { useProjectStore } from "../../../../../store/projectStore";
import { useToastStore } from "../../../../../store/toastStore";
import { Card } from "../../../../../(auth)/authComponent/Card";
import { Field } from "../../../../../(auth)/authComponent/Field";
import { Button } from "../../../../../(auth)/authComponent/Button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Settings, Trash2, ShieldAlert } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export default function ProjectSettings() {
  const router = useRouter();
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const { activeProject, setActiveProject, fetchProjects } = useProjectStore();
  const addToast = useToastStore((state) => state.addToast);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [env, setEnv] = useState("PRODUCTION");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (activeProject) {
      setName(activeProject.name);
      setDescription(activeProject.description || "");
    }
  }, [activeProject]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject || !activeWorkspace) return;

    setSaving(true);
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/project/${activeProject.id}`,
        {
          name,
          description,
        },
      );

      if (response.data && response.data.success) {
        addToast("PROJECT SUB-INSTANCE SETTINGS UPDATED", "success");
        await fetchProjects(activeWorkspace.id);
        
        // If name changes, slug might change, redirect to updated URL
        const updatedProj = response.data.data;
        setActiveProject(updatedProj);
        router.push(`/w/${activeWorkspace.slug}/p/${updatedProj.slug}/settings`);
      }
    } catch (err: any) {
      addToast(err.response?.data?.message || err.message || "Failed to update project", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeProject || !activeWorkspace) return;
    const confirmDelete = window.confirm(
      `CONFIRM INSTRUCTION: Are you sure you want to permanently delete the project node "${activeProject.name}"? This cannot be undone.`,
    );

    if (!confirmDelete) return;

    setDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/project/${activeProject.id}`);
      addToast("PROJECT NODE INVENTORY TERMINATED", "success");
      
      // Clear active project, fetch projects, and redirect back to workspace
      await fetchProjects(activeWorkspace.id);
      setActiveProject(null);
      router.push(`/w/${activeWorkspace.slug}`);
    } catch (err: any) {
      addToast(err.response?.data?.message || err.message || "Failed to delete project", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 font-mono text-aergus-text max-w-4xl mx-auto">
      {/* Header section */}
      <div className="border-b border-aergus-border pb-4">
        <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">Console Settings</h1>
        <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
          Modify active project sub-instance variables and environment configurations
        </p>
      </div>

      {/* Edit Form */}
      <div className="max-w-xl">
        <Card
          title="Project Profile"
          subtitle="Configure metadata fields of your active node"
          systemState={saving ? "STATUS: COMMITTING..." : "STATUS: SYNCED"}
        >
          <form onSubmit={handleUpdate} className="space-y-4 mt-6">
            <Field
              label="PROJECT NAME"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Field
              label="DESCRIPTION"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-aergus-text uppercase tracking-widest">
                ENVIRONMENT CONFIG
              </label>
              <select
                value={env}
                onChange={(e) => setEnv(e.target.value)}
                className="h-12 bg-aergus-card border border-aergus-border px-4 rounded text-xs focus:outline-none focus:border-aergus-primary font-mono text-aergus-text"
              >
                <option value="PRODUCTION">PRODUCTION NETWORK</option>
                <option value="STAGING">STAGING TESTING NODE</option>
                <option value="DEVELOPMENT">SANDBOX DEVELOPMENT CLUSTER</option>
              </select>
            </div>

            <Button type="submit" disabled={saving}>
              {saving ? "SAVING CONFIG..." : "COMMIT CHANGES"}
            </Button>
          </form>
        </Card>
      </div>

      {/* Danger Zone */}
      <div className="border border-red-500/30 rounded p-6 bg-red-500/5 space-y-6">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <h3 className="font-bold text-xs uppercase text-red-500 tracking-widest">DANGER CONTROL PANEL</h3>
            <p className="text-[10px] text-aergus-text-dim/80 uppercase font-mono mt-0.5">
              Warning: Actions executed here are absolute and permanent
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-red-500/20 bg-aergus-bg rounded text-xs">
          <div className="space-y-1">
            <span className="font-bold text-aergus-text uppercase">TERMINATE PROJECT CLUSTER</span>
            <p className="text-[10.5px] text-aergus-text-dim font-sans leading-relaxed">
              Delete the active project, connected resources, metrics database logs, and all configurations.
            </p>
          </div>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="h-10 px-4 bg-red-600 hover:bg-red-500 text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-sm shrink-0 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            {deleting ? "DELETING..." : "DELETE NODE"}
          </button>
        </div>
      </div>
    </div>
  );
}
