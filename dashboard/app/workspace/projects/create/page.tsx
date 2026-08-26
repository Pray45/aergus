"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWorkspaceStore } from "@/app/store/workspaceStore";
import { useProjectStore } from "@/app/store/projectStore";
import { useToastStore } from "@/app/store/toastStore";
import CreateWorkspaceSVG from "@/app/svg/workspaceCreate";

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
        description.trim(),
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
  <div className="w-full h-full flex gap-5">
    <div className="w-full h-auto flex flex-col justify-between">
      <div>
        <h1 className="text-2xl font-bold font-space">Create Project</h1>
      </div>
      <p className="text-xs text-aergus-text-dim">Provisioning a new project sub-instance</p>
    </div>
    
    <CreateWorkspaceSVG/>
  
  </div>
);
}
