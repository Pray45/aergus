"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../(auth)/authComponent/Card";
import { useWorkspaceStore } from "../store/workspaceStore";
import { useToastStore } from "../store/toastStore";
import { useAuthStore } from "../store/authStore";
import Image from "next/image";
import Input from "../components/ui/Input";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";

const CreateWS: React.FC = () => {
  const router = useRouter();
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);
  const addToast = useToastStore((state) => state.addToast);
  const upgradeTier = useAuthStore((state) => state.upgradeTier);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isTierLimitError, setIsTierLimitError] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Workspace name is required.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const newWS = await createWorkspace(name.trim(), description.trim());
      addToast("WORKSPACE INSTANCE ACTIVATED", "success");
      router.push(`/w/${newWS.slug}`);
    } catch (err: any) {
      console.error(err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create workspace.";

      const is403 = err.response?.status === 403;
      const isTier =
        errMsg.includes("limit") ||
        errMsg.includes("upgrade") ||
        errMsg.includes("tier") ||
        errMsg.includes("Free tier");

      if (is403 || isTier) {
        setIsTierLimitError(true);
        setError(errMsg);
      } else {
        setError(errMsg);
        addToast(errMsg, "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isTierLimitError) {
    return (
      <div className="font-mono text-aergus-text min-h-screen flex flex-col items-center justify-center relative bg-aergus-bg selection:bg-aergus-primary selection:text-white">
        <main className="flex items-center justify-center w-full px-4 md:px-16 z-10 py-12">
          <div className="w-full max-w-[540px]">
            <Card
              title="QUOTA EXCEEDED"
              subtitle="Instance limit reached for your current subscription"
              systemState="STATUS: SECURITY_BLOCKED"
            >
              <div className="space-y-6 mt-6">
                {/* Warning box */}
                <div className="p-4 bg-aergus-primary/5 border border-aergus-primary/30 rounded-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 h-full w-[3px] bg-aergus-primary" />
                  <p className="text-sm font-medium text-aergus-primary uppercase tracking-wider mb-2">
                    [PROVISIONING_FAILED]
                  </p>
                  <p className="text-xs leading-relaxed text-aergus-text opacity-90">
                    {error}
                  </p>
                </div>

                <div className="border-t border-aergus-border pt-6">
                  <h3 className="text-xs uppercase tracking-widest text-aergus-text font-bold mb-4">
                    AVAILABLE UPGRADES:
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Team Tier Card */}
                    <div className="border border-aergus-border rounded-sm p-4 bg-aergus-card/50 flex flex-col justify-between hover:border-aergus-primary/50 transition-colors">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[12px] font-bold text-aergus-text uppercase">
                            TEAM TIER
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-aergus-primary/20 text-aergus-primary rounded-sm font-bold">
                            POPULAR
                          </span>
                        </div>
                        <p className="text-[10px] text-aergus-text-dim uppercase tracking-tight mb-2">
                          $29 / MONTH
                        </p>
                        <ul className="text-[10.5px] text-aergus-text-dim space-y-1 font-sans">
                          <li>• Up to 5 secure workspaces</li>
                          <li>• Invite ADMIN / MEMBER roles</li>
                          <li>• High priority node performance</li>
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          setUpgrading(true);
                          try {
                            await upgradeTier("team");
                            addToast(
                              "SUBSCRIBED TO TEAM TIER SECURE INSTANCE",
                              "success",
                            );
                            setIsTierLimitError(false);
                            setError(null);
                          } catch (err: any) {
                            addToast(
                              err.message || "Failed to upgrade tier",
                              "error",
                            );
                          } finally {
                            setUpgrading(false);
                          }
                        }}
                        disabled={upgrading}
                        className="mt-4 w-full h-9 bg-aergus-primary text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-sm hover:bg-aergus-primary/95 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {upgrading ? "UPGRADING..." : "UPGRADE TO TEAM"}
                      </button>
                    </div>

                    {/* Enterprise Tier Card */}
                    <div className="border border-aergus-border rounded-sm p-4 bg-aergus-card/50 flex flex-col justify-between hover:border-aergus-primary/50 transition-colors">
                      <div>
                        <span className="text-[12px] font-bold text-aergus-text uppercase mb-1 block">
                          ENTERPRISE
                        </span>
                        <p className="text-[10px] text-aergus-text-dim uppercase tracking-tight mb-2">
                          CUSTOM / BILLING
                        </p>
                        <ul className="text-[10.5px] text-aergus-text-dim space-y-1 font-sans">
                          <li>• Unlimited secure workspaces</li>
                          <li>• Enterprise SLA & custom SSO</li>
                          <li>• Dedicated private nodes</li>
                        </ul>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          setUpgrading(true);
                          try {
                            await upgradeTier("enterprise");
                            addToast(
                              "SUBSCRIBED TO ENTERPRISE TIER SECURE INSTANCE",
                              "success",
                            );
                            setIsTierLimitError(false);
                            setError(null);
                          } catch (err: any) {
                            addToast(
                              err.message || "Failed to upgrade tier",
                              "error",
                            );
                          } finally {
                            setUpgrading(false);
                          }
                        }}
                        disabled={upgrading}
                        className="mt-4 w-full h-9 bg-aergus-primary text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-sm hover:bg-aergus-primary/95 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {upgrading ? "UPGRADING..." : "UPGRADE TO ENTERPRISE"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTierLimitError(false);
                      setError(null);
                    }}
                    className="flex-1 h-12 border border-aergus-border text-aergus-text font-mono font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-aergus-text/[0.05] transition-colors cursor-pointer"
                  >
                    CANCEL & BACK
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-aergus-bg font-mono text-aergus-text selection:bg-aergus-primary selection:text-white">
      <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[minmax(300px,0.9fr)_minmax(520px,1.1fr)]">
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
          {/* <div className="relative z-10 max-w-sm">
            <p className="mb-4 text-[10px] uppercase tracking-[0.3em] text-aergus-primary">
              Provision a new space
            </p>
            <h2 className="font-sans text-5xl font-bold leading-[0.95] tracking-tight xl:text-6xl">
              Give your team room to move.
            </h2>
            <p className="mt-6 max-w-xs font-sans text-sm leading-6 text-aergus-text-dim">
              Workspaces keep your projects, resources, and people organized in one secure operating layer.
            </p>
          </div> */}
        </aside>

        <section className="flex items-center px-5 py-8 sm:px-10 lg:px-16 xl:px-24">
          <div className="w-full max-w-[620px]">
            <button
              type="button"
              onClick={() => router.back()}
              className="mb-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-aergus-text-dim transition-colors hover:text-aergus-text"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>

            <div className="mb-10">
              <h1 className="font-sans text-4xl font-bold tracking-tight sm:text-5xl">
                Create your  
                <span className="text-aergus-primary"> workspace</span>
              </h1>
            </div>

            <form onSubmit={handleSubmit} className="workspace-create-card border border-aergus-border bg-aergus-card/60 p-5 sm:p-8">

              <div className="space-y-6">
                <Input
                  label="name"
                  placeholder="e.g. Northstar Engineering"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="workspace-name"
                />

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
                    description <span className="font-sans font-normal normal-case tracking-normal text-aergus-text-dim">(optional)</span>
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
                <div role="alert" className="mt-6 border-l-2 border-aergus-primary bg-aergus-primary/5 px-4 py-3 text-xs leading-5 text-aergus-text">
                  {error}
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 border-t border-aergus-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 font-sans text-xs text-aergus-text-dim">
                  <Check className="h-3.5 w-3.5 text-aergus-primary" />
                  Ready to provision
                </p>
                <button
                  type="submit"
                  disabled={submitting || !name.trim()}
                  className="btn-chamfer inline-flex h-12 items-center justify-center gap-3 bg-aergus-primary px-6 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-aergus-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  {submitting ? "Provisioning..." : "Create workspace"}
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CreateWS;
