"use client";

import React, { useState } from "react";
import { Card } from "../(auth)/authComponent/Card";
import { useQuotaStore } from "../store/quotaStore";
import { useAuthStore } from "../store/authStore";
import { useToastStore } from "../store/toastStore";
import { Loader2 } from "lucide-react";

interface QuotaExceededModalProps {
  isOpen?: boolean;
  error?: string | null;
  onClose?: () => void;
  onSuccess?: () => void;
}

export const QuotaExceededModal: React.FC<QuotaExceededModalProps> = ({
  isOpen: propsIsOpen,
  error: propsError,
  onClose: propsOnClose,
  onSuccess: propsOnSuccess,
}) => {
  const storeIsOpen = useQuotaStore((state) => state.isOpen);
  const storeError = useQuotaStore((state) => state.error);
  const closeQuotaModal = useQuotaStore((state) => state.closeQuotaModal);

  const upgradeTier = useAuthStore((state) => state.upgradeTier);
  const addToast = useToastStore((state) => state.addToast);

  const [upgrading, setUpgrading] = useState(false);

  // Determine visibility and active error message
  const isOpen = propsIsOpen !== undefined ? propsIsOpen : storeIsOpen;
  const activeError = propsError !== undefined ? propsError : storeError;

  const handleClose = () => {
    if (propsOnClose) {
      propsOnClose();
    } else {
      closeQuotaModal();
    }
  };

  const handleUpgrade = async (tier: "team" | "enterprise") => {
    setUpgrading(true);
    try {
      await upgradeTier(tier);
      addToast(
        `SUBSCRIBED TO ${tier.toUpperCase()} TIER SECURE INSTANCE`,
        "success"
      );
      handleClose();
      if (propsOnSuccess) propsOnSuccess();
    } catch (err: unknown) {
      const errorObj = err as Error;
      addToast(errorObj.message || "Failed to upgrade tier", "error");
    } finally {
      setUpgrading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 font-mono text-aergus-text selection:bg-aergus-primary selection:text-white animate-in fade-in duration-200"
    >
      <div className="w-full max-w-[540px]">
        <Card
          title="QUOTA EXCEEDED"
          subtitle="Instance limit reached for your current subscription"
          systemState="STATUS: SECURITY_BLOCKED"
        >
          <div className="space-y-6 mt-6">
            <div className="p-4 bg-aergus-primary/5 border border-aergus-primary/30 rounded-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 h-full w-[3px] bg-aergus-primary" />
              <p className="text-sm font-medium text-aergus-primary uppercase tracking-wider mb-2">
                [PROVISIONING_FAILED]
              </p>
              <p className="text-xs leading-relaxed text-aergus-text opacity-90">
                {activeError || "Instance limit reached for your current subscription."}
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
                    onClick={() => handleUpgrade("team")}
                    disabled={upgrading}
                    className="mt-4 w-full h-9 bg-aergus-primary text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-sm hover:bg-aergus-primary/95 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {upgrading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>UPGRADING...</span>
                      </>
                    ) : (
                      "UPGRADE TO TEAM"
                    )}
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
                    onClick={() => handleUpgrade("enterprise")}
                    disabled={upgrading}
                    className="mt-4 w-full h-9 bg-aergus-primary text-white font-mono text-[10px] font-bold uppercase tracking-wider rounded-sm hover:bg-aergus-primary/95 transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                  >
                    {upgrading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>UPGRADING...</span>
                      </>
                    ) : (
                      "UPGRADE TO ENTERPRISE"
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 h-12 border border-aergus-border text-aergus-text font-mono font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-aergus-text/[0.05] transition-colors cursor-pointer"
              >
                CANCEL & BACK
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuotaExceededModal;
