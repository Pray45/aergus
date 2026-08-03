"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../(auth)/authComponent/Card";
import { Field } from "../(auth)/authComponent/Field";
import { Button } from "../(auth)/authComponent/Button";
import { useWorkspaceStore } from "../store/workspaceStore";
import { useToastStore } from "../store/toastStore";
import { useAuthStore } from "../store/authStore";

const CreateWS: React.FC = () => {
  const router = useRouter();
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);
  const addToast = useToastStore((state) => state.addToast);
  const upgradeTier = useAuthStore((state) => state.upgradeTier);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTierLimitError, setIsTierLimitError] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const newWS = await createWorkspace(name, description);
      addToast("WORKSPACE INSTANCE ACTIVATED", "success");
      router.push(`/w/${newWS.slug}`);
    } catch (err: any) {
      console.error(err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create workspace.";
      
      const is403 = err.response?.status === 403;
      const isTier = errMsg.includes("limit") || errMsg.includes("upgrade") || errMsg.includes("tier") || errMsg.includes("Free tier");
      
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
                          <span className="text-[12px] font-bold text-aergus-text uppercase">TEAM TIER</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-aergus-primary/20 text-aergus-primary rounded-sm font-bold">POPULAR</span>
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
                            addToast("SUBSCRIBED TO TEAM TIER SECURE INSTANCE", "success");
                            setIsTierLimitError(false);
                            setError(null);
                          } catch (err: any) {
                            addToast(err.message || "Failed to upgrade tier", "error");
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
                        <span className="text-[12px] font-bold text-aergus-text uppercase mb-1 block">ENTERPRISE</span>
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
                            addToast("SUBSCRIBED TO ENTERPRISE TIER SECURE INSTANCE", "success");
                            setIsTierLimitError(false);
                            setError(null);
                          } catch (err: any) {
                            addToast(err.message || "Failed to upgrade tier", "error");
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
    <div className="font-mono text-aergus-text min-h-screen flex flex-col items-center justify-center relative bg-aergus-bg selection:bg-aergus-primary selection:text-white">
      <main className="flex items-center justify-center w-full px-4 md:px-16 z-10 py-12">
        <div className="w-full max-w-[480px]">
          <Card
            title="Create Workspace"
            subtitle="Configure and spin up a new secure workspace instance"
            systemState={
              submitting ? "STATUS: PROVISIONING..." : "STATUS: READY"
            }
          >
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <Field
                label="WORKSPACE NAME"
                placeholder="ACME CORP"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Field
                label="DESCRIPTION"
                placeholder="Primary secure development node"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button type="submit" disabled={submitting} className="mt-6">
                {submitting
                  ? "PROVISIONING INSTANCE..."
                  : "INITIALIZE INSTANCE"}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateWS;
