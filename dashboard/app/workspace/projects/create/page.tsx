"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWorkspaceStore } from "@/app/store/workspaceStore";
import { useProjectStore } from "@/app/store/projectStore";
import { useToastStore } from "@/app/store/toastStore";
import { Card } from "@/app/(auth)/authComponent/Card";
import { Field } from "@/app/(auth)/authComponent/Field";
import { Button } from "@/app/(auth)/authComponent/Button";
import { ArrowLeft, Shield, Layers, Cpu, CheckCircle2 } from "lucide-react";

export default function CreateProjectPage() {
  const router = useRouter();
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const createProject = useProjectStore((state) => state.createProject);
  const addToast = useToastStore((state) => state.addToast);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [environment, setEnvironment] = useState("production");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace) {
      setError("No active workspace selected.");
      return;
    }
    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const newProj = await createProject(
        activeWorkspace.id,
        name.trim(),
        description.trim()
      );
      addToast("PROJECT SUB-INSTANCE PROVISIONED", "success");
      router.push(`/w/${activeWorkspace.slug}/p/${newProj.slug}/dashboard`);
    } catch (err: any) {
      console.error(err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to provision project sub-instance.";
      setError(errMsg);
      addToast(errMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-mono text-aergus-text max-w-3xl mx-auto">
      {/* Header & Back link */}
      <div className="flex items-center justify-between border-b border-aergus-border pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/workspace/projects"
            className="w-8 h-8 rounded border border-aergus-border bg-aergus-card hover:border-aergus-primary flex items-center justify-center text-aergus-text-dim hover:text-aergus-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">
              Provision New Project
            </h1>
            <p className="text-xs text-aergus-text-dim/80 mt-0.5 uppercase font-semibold tracking-tight">
              Create an isolated environment inside workspace:{" "}
              <span className="text-aergus-primary">
                {activeWorkspace?.name || "..."}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Main Creation Card */}
      <Card
        title="Project Sub-Instance"
        subtitle="Configure infrastructure and deployment settings"
        systemState={submitting ? "STATUS: PROVISIONING..." : "STATUS: READY"}
      >
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-sm font-mono text-xs text-red-400">
              <span className="font-bold uppercase">[PROVISION_ERROR]:</span>{" "}
              {error}
            </div>
          )}

          <Field
            label="PROJECT NAME"
            placeholder="PROD-INFRASTRUCTURE"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            helperText="REQUIRED. UNIQUE IDENTIFIER WITHIN THIS WORKSPACE."
          />

          <div className="space-y-2">
            <label className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-aergus-text/60 flex items-center gap-2">
              DESCRIPTION
              <span className="w-1 h-1 bg-aergus-primary"></span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Production API cluster, worker nodes, and backend database instances"
              rows={3}
              className="w-full bg-aergus-bg border border-aergus-border focus:border-aergus-primary rounded-sm py-3 px-4 font-mono text-sm text-aergus-text placeholder:text-aergus-text/20 focus:outline-none focus:ring-0 transition-colors resize-none"
            />
          </div>

          {/* Environment selector */}
          <div className="space-y-2 pt-2">
            <label className="font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-aergus-text/60 flex items-center gap-2">
              INITIAL ENVIRONMENT TIER
              <span className="w-1 h-1 bg-aergus-primary"></span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "production",
                  title: "PRODUCTION",
                  desc: "High availability & live monitoring",
                  icon: Shield,
                },
                {
                  id: "staging",
                  title: "STAGING",
                  desc: "Testing & integration environment",
                  icon: Layers,
                },
                {
                  id: "development",
                  title: "DEVELOPMENT",
                  desc: "Sandbox & rapid prototyping",
                  icon: Cpu,
                },
              ].map((tier) => {
                const Icon = tier.icon;
                const isSelected = environment === tier.id;
                return (
                  <div
                    key={tier.id}
                    onClick={() => setEnvironment(tier.id)}
                    className={`p-3.5 border rounded-sm cursor-pointer transition-all ${
                      isSelected
                        ? "border-aergus-primary bg-aergus-primary/5 text-aergus-text"
                        : "border-aergus-border bg-aergus-bg/50 text-aergus-text-dim hover:border-aergus-border/80"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Icon
                        className={`w-4 h-4 ${
                          isSelected
                            ? "text-aergus-primary"
                            : "text-aergus-text-dim"
                        }`}
                      />
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-aergus-primary" />
                      )}
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider">
                      {tier.title}
                    </p>
                    <p className="text-[9.5px] opacity-75 mt-1 leading-tight">
                      {tier.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-aergus-border">
            <Link
              href="/workspace/projects"
              className="flex-1 h-12 border border-aergus-border text-aergus-text font-mono font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-aergus-text/[0.05] transition-colors flex items-center justify-center"
            >
              CANCEL
            </Link>
            <Button type="submit" disabled={submitting} className="flex-1">
              {submitting
                ? "PROVISIONING INSTANCE..."
                : "CONFIRM PROVISIONING"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
