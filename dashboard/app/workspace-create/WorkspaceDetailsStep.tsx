"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Input from "../components/ui/Input";
import { ArrowLeft, ArrowRight, Check, Loader2, X } from "lucide-react";

interface WorkspaceDetailsStepProps {
  name: string;
  setName: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  slug: string;
  error: string | null;
  setError: (err: string | null) => void;
  nameStatus: "idle" | "checking" | "available" | "taken";
  checkingName: boolean;
  onProceed: (e: React.FormEvent) => void;
}

export const WorkspaceDetailsStep: React.FC<WorkspaceDetailsStepProps> = ({
  name,
  setName,
  description,
  setDescription,
  slug,
  error,
  setError,
  nameStatus,
  checkingName,
  onProceed,
}) => {
  const router = useRouter();

  return (
    <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[minmax(300px,0.9fr)_minmax(520px,1.1fr)]">
      {/* Left Control Plane Branding */}
      <aside className="relative hidden overflow-hidden border-r border-aergus-border lg:flex lg:flex-col lg:justify-between lg:p-12 xl:p-16">
        <div className="relative z-10 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em]">
          <span className="h-2 w-2 bg-aergus-primary" />
          AERGUS / CONTROL PLANE
        </div>
        <div className="workspace-create-rings group absolute left-1/2 top-1/2 w-[min(720px,130%)] -translate-x-1/2 -translate-y-1/2">
          <Image
            src="/workspace.svg"
            alt=""
            width={720}
            height={620}
            priority
            aria-hidden="true"
            className="pointer-events-none w-full opacity-80 transition duration-500 group-hover:opacity-100"
          />
        </div>
        <div className="relative z-10 text-[10px] text-aergus-text-dim tracking-widest uppercase">
          STEP 01/02 // WORKSPACE METADATA
        </div>
      </aside>

      {/* Right Form Section */}
      <section className="flex items-center px-5 py-8 sm:px-10 lg:px-16 xl:px-24">
        <div className="w-full max-w-[620px]">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-aergus-text-dim transition-colors hover:text-aergus-text cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>

          <div className="mb-10">
            <h1 className="font-sans text-4xl font-bold tracking-tight sm:text-5xl">
              Create your <span className="text-aergus-primary">workspace</span>
            </h1>
          </div>

          <form
            onSubmit={onProceed}
            className="workspace-create-card border border-aergus-border bg-aergus-card/60 p-5 sm:p-8"
          >
            <div className="space-y-6">
              <div>
                <Input
                  label="name"
                  placeholder="e.g. Northstar Engineering"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                  name="workspace-name"
                />
                <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono min-h-[18px]">
                  {checkingName ? (
                    <span className="flex items-center gap-1.5 text-aergus-text-dim">
                      <Loader2 className="h-3 w-3 animate-spin text-aergus-primary" />
                      Checking availability...
                    </span>
                  ) : nameStatus === "taken" ? (
                    <span className="flex items-center gap-1.5 font-bold text-rose-500">
                      <X className="h-3 w-3 text-rose-500" />
                      Workspace name or slug is already taken
                    </span>
                  ) : nameStatus === "available" ? (
                    <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                      <Check className="h-3 w-3 text-emerald-400" />
                      Workspace name is available
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-aergus-text">
                  <span className="h-1.5 w-1.5 bg-aergus-primary" />
                  slug
                </label>
                <div className="flex items-center border border-aergus-border bg-aergus-bg px-4 py-2.5 text-sm text-aergus-text-dim">
                  <span className="mr-1 text-aergus-primary">aergus.dev/</span>
                  <span className="truncate">{slug || "your-workspace"}</span>
                </div>
                <p className="font-sans text-xs leading-5 text-aergus-text-dim">
                  Generated from the name and locked after creation.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-aergus-text">
                  description{" "}
                  <span className="font-sans font-normal normal-case tracking-normal text-aergus-text-dim">
                    (optional)
                  </span>
                </label>
                <textarea
                  name="workspace-description"
                  placeholder="What will this workspace be used for?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full resize-none border border-aergus-border bg-aergus-bg px-4 py-3 font-sans text-sm text-aergus-text placeholder:text-aergus-text-dim/40 focus:border-aergus-primary focus:outline-none focus:ring-1 focus:ring-aergus-primary/20"
                />
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-6 border-l-2 border-aergus-primary bg-aergus-primary/5 px-4 py-3 text-xs leading-5 text-aergus-text"
              >
                {error}
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-aergus-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 font-sans text-xs text-aergus-text-dim">
                <Check className="h-3.5 w-3.5 text-aergus-primary" />
                Next: Team Configuration
              </p>
              <button
                type="submit"
                disabled={!name.trim() || nameStatus === "taken" || checkingName}
                className="btn-chamfer inline-flex h-12 items-center justify-center gap-3 bg-aergus-primary px-6 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-aergus-primary-hover disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                {checkingName ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Checking...</span>
                  </>
                ) : (
                  <>
                    <span>Next</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default WorkspaceDetailsStep;
