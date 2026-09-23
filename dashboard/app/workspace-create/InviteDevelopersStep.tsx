"use client";

import React from "react";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  Plus,
  X,
  Users,
  ShieldCheck,
  Shield,
  Eye,
  Briefcase,
  Mail,
  Check,
} from "lucide-react";
import { useToastStore } from "../store/toastStore";

export interface InvitedDeveloper {
  id: string;
  email: string;
  role: "ADMIN" | "MEMBER" | "VIEWER";
  isPaid: boolean;
  tag: string;
}

interface InviteDevelopersStepProps {
  name: string;
  slug: string;
  description: string;
  developerEmail: string;
  setDeveloperEmail: (val: string) => void;
  selectedRole: "ADMIN" | "MEMBER" | "VIEWER";
  setSelectedRole: (role: "ADMIN" | "MEMBER" | "VIEWER") => void;
  isPaid: boolean;
  setIsPaid: (paid: boolean) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  invitedDevelopers: InvitedDeveloper[];
  setInvitedDevelopers: React.Dispatch<React.SetStateAction<InvitedDeveloper[]>>;
  submitting: boolean;
  error: string | null;
  onBack: () => void;
  onSubmit: (options: { skipInvites: boolean }) => void;
}

export const InviteDevelopersStep: React.FC<InviteDevelopersStepProps> = ({
  developerEmail,
  setDeveloperEmail,
  selectedRole,
  setSelectedRole,
  isPaid,
  setIsPaid,
  selectedTag,
  setSelectedTag,
  invitedDevelopers,
  setInvitedDevelopers,
  submitting,
  error,
  onBack,
  onSubmit,
}) => {
  const addToast = useToastStore((state) => state.addToast);

  const handleAddDeveloper = () => {
    const trimmed = developerEmail.trim();
    if (!trimmed) return;

    if (
      invitedDevelopers.some(
        (d) => d.email.toLowerCase() === trimmed.toLowerCase()
      )
    ) {
      addToast("Developer is already in the invite list.", "error");
      return;
    }

    setInvitedDevelopers((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        email: trimmed,
        role: selectedRole,
        isPaid,
        tag: selectedTag,
      },
    ]);
    setDeveloperEmail("");
  };

  const handleRemoveDeveloper = (id: string) => {
    setInvitedDevelopers((prev) => prev.filter((d) => d.id !== id));
  };

  const handleCycleRole = () => {
    if (selectedRole === "MEMBER") setSelectedRole("ADMIN");
    else if (selectedRole === "ADMIN") setSelectedRole("VIEWER");
    else setSelectedRole("MEMBER");
  };

  const handleTogglePaid = () => {
    setIsPaid(!isPaid);
  };

  const handleCycleTag = () => {
    const tags = ["Full-time", "Contractor", "Core", "Advisor"];
    const currentIndex = tags.indexOf(selectedTag);
    const nextIndex = (currentIndex + 1) % tags.length;
    setSelectedTag(tags[nextIndex]);
  };

  const getRoleIcon = (role: "ADMIN" | "MEMBER" | "VIEWER") => {
    switch (role) {
      case "ADMIN":
        return <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />;
      case "MEMBER":
        return <Shield className="w-3.5 h-3.5 text-aergus-primary" />;
      case "VIEWER":
        return <Eye className="w-3.5 h-3.5 text-cyan-400" />;
    }
  };

  const getRoleBadgeStyle = (role: "ADMIN" | "MEMBER" | "VIEWER") => {
    switch (role) {
      case "ADMIN":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "MEMBER":
        return "bg-aergus-primary/15 text-aergus-primary border-aergus-primary/40";
      case "VIEWER":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center py-12 px-4 sm:px-8 lg:px-14 overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-aergus-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[450px] h-[450px] bg-blue-600/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl">
        {/* Top Header Bar: Back Button & Step Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-aergus-border/40">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-aergus-text-dim hover:text-white transition-all cursor-pointer group"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-aergus-primary" />
            <span>Back to Workspace Details</span>
          </button>

          <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest text-aergus-text-dim">
            
          </div>
        </div>

        {/* Main Split Grid (Left: invitedev.svg illustration, Right: S-Tier Wireframe Form) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* ============================================================
              LEFT SIDE: invitedev.svg image requested by user
             ============================================================ */}
          <div className="lg:col-span-5 w-full flex flex-col items-center justify-center">
            <div className="relative w-full max-w-[540px] flex items-center justify-center p-2 sm:p-4">
              <Image
                src="/invitedev.svg"
                alt="Invite Developers"
                width={936}
                height={505}
                priority
                className="w-full h-auto object-contain drop-shadow-2xl transition-all duration-500 hover:scale-[1.02] select-none pointer-events-none"
              />
            </div>
          </div>

          {/* ============================================================
              RIGHT SIDE: Wireframe Invite Form (S-Tier Engineered)
             ============================================================ */}
          <div className="lg:col-span-7 w-full flex flex-col justify-center">
            {/* Header: Exact Wireframe Typography */}
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-aergus-primary block">
                Invite
              </span>
              <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
                Developers
              </h1>
              <p className="font-sans text-xs sm:text-sm text-aergus-text-dim pt-1">
                Delegate instance access keys and assemble your project co-engineers.
              </p>
            </div>

            {/* Glowing Accent Divider Line */}
            <div className="relative my-7">
              <div className="h-[2px] w-full bg-gradient-to-r from-aergus-primary/80 via-white/10 to-transparent" />
              <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-aergus-primary shadow-sm shadow-aergus-primary" />
            </div>

            {/* Interactive Inputs & Controls */}
            <div className="space-y-5">
              {/* High-tech Dark Input Field */}
              <div className="relative flex items-center group">
                <div className="absolute left-4 text-aergus-text-dim group-focus-within:text-aergus-primary transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="developer@aergus.sh or colleague@company.com"
                  value={developerEmail}
                  onChange={(e) => setDeveloperEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddDeveloper();
                    }
                  }}
                  className="w-full h-14 bg-[#111115] border border-white/10 hover:border-white/20 focus:border-aergus-primary pl-11 pr-28 font-mono text-sm text-white placeholder:text-aergus-text-dim/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-aergus-primary/20 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={handleAddDeveloper}
                  disabled={!developerEmail.trim()}
                  className="absolute right-2.5 h-9 px-4 bg-[#1f1f26] hover:bg-aergus-primary text-white text-xs font-mono font-bold uppercase tracking-wider rounded-md transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>

              {/* The 3 Wireframe Buttons: [Role] [paid] [paid] */}
              <div className="grid grid-cols-3 gap-3">
                {/* 1. ROLE BUTTON */}
                <button
                  type="button"
                  onClick={handleCycleRole}
                  title="Click to cycle role (ADMIN / MEMBER / VIEWER)"
                  className="group relative h-12 bg-[#121216] hover:bg-[#18181f] border border-white/10 hover:border-white/25 rounded-lg px-3 flex flex-col justify-center items-center transition-all cursor-pointer select-none active:scale-[0.98]"
                >
                  <span className="text-[9px] font-mono uppercase tracking-widest text-aergus-text-dim group-hover:text-white/70">
                    Role
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {getRoleIcon(selectedRole)}
                    <span className="font-mono text-xs font-bold text-white tracking-wider">
                      {selectedRole}
                    </span>
                  </div>
                </button>

                {/* 2. PAID TOGGLE BUTTON (Wireframe label: paid) */}
                <button
                  type="button"
                  onClick={handleTogglePaid}
                  title="Toggle paid seat status"
                  className={`group relative h-12 border rounded-lg px-3 flex flex-col justify-center items-center transition-all cursor-pointer select-none active:scale-[0.98] ${
                    isPaid
                      ? "bg-aergus-primary/10 border-aergus-primary/60 text-white shadow-sm shadow-aergus-primary/20"
                      : "bg-[#121216] border-white/10 text-aergus-text-dim hover:bg-[#18181f] hover:border-white/20"
                  }`}
                >
                  <span className="text-[9px] font-mono uppercase tracking-widest text-aergus-text-dim">
                    Seat
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        isPaid
                          ? "bg-aergus-primary animate-pulse"
                          : "bg-aergus-text-dim"
                      }`}
                    />
                    <span className="font-mono text-xs font-bold tracking-wider">
                      {isPaid ? "paid" : "free"}
                    </span>
                  </div>
                </button>

                {/* 3. ALLOCATION / TAG BUTTON (Wireframe label: paid) */}
                <button
                  type="button"
                  onClick={handleCycleTag}
                  title="Click to cycle employment / collaborator type"
                  className="group relative h-12 bg-[#121216] hover:bg-[#18181f] border border-white/10 hover:border-white/25 rounded-lg px-3 flex flex-col justify-center items-center transition-all cursor-pointer select-none active:scale-[0.98]"
                >
                  <span className="text-[9px] font-mono uppercase tracking-widest text-aergus-text-dim group-hover:text-white/70">
                    Type
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-aergus-text-dim" />
                    <span className="font-mono text-xs font-bold text-white tracking-wider truncate">
                      {selectedTag}
                    </span>
                  </div>
                </button>
              </div>

              {/* Roster of Queued Developers */}
              {invitedDevelopers.length > 0 ? (
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-aergus-text-dim mb-2.5">
                    <span>
                      QUEUED INVITATIONS ({invitedDevelopers.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setInvitedDevelopers([])}
                      className="hover:text-aergus-primary transition-colors cursor-pointer"
                    >
                      CLEAR ALL
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2.5 max-h-44 overflow-y-auto pr-1">
                    {invitedDevelopers.map((dev) => (
                      <div
                        key={dev.id}
                        className="inline-flex items-center gap-2.5 bg-[#141418] border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-md text-xs font-mono transition-colors shadow-sm"
                      >
                        <span className="font-semibold text-white">
                          {dev.email}
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm border uppercase ${getRoleBadgeStyle(
                            dev.role
                          )}`}
                        >
                          {dev.role}
                        </span>
                        <span className="text-[9px] font-mono text-aergus-text-dim uppercase">
                          {dev.isPaid ? "PAID" : "FREE"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveDeveloper(dev.id)}
                          className="text-aergus-text-dim hover:text-rose-400 transition-colors cursor-pointer ml-1 p-0.5 rounded-sm hover:bg-white/5"
                          aria-label="Remove developer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-lg border border-dashed border-white/10 bg-white/[0.01] flex items-center justify-between text-xs font-mono text-aergus-text-dim">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-aergus-text-dim/60" />
                    <span>No co-developers queued yet.</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-aergus-text-dim/70">
                    OPTIONAL STEP
                  </span>
                </div>
              )}
            </div>

            {/* Error Notification */}
            {error && (
              <div
                role="alert"
                className="mt-6 border-l-2 border-aergus-primary bg-aergus-primary/5 px-4 py-3 text-xs leading-5 text-aergus-text"
              >
                {error}
              </div>
            )}

            {/* Bottom Navigation Bar: [skip] (left) ... [submit] (right) */}
            <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
              {/* Skip button (Left) */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => onSubmit({ skipInvites: true })}
                className="text-xs font-mono font-bold tracking-[0.25em] uppercase text-aergus-text-dim hover:text-white transition-colors cursor-pointer py-3 px-2 disabled:opacity-40 flex items-center gap-2 group"
              >
                <span>skip</span>
                <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-aergus-primary">
                  →
                </span>
              </button>

              {/* Submit button (Right) */}
              <button
                type="button"
                disabled={submitting}
                onClick={() => onSubmit({ skipInvites: false })}
                className="btn-chamfer inline-flex h-12 items-center justify-center gap-3 bg-aergus-primary px-8 text-xs font-mono font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-aergus-primary-hover hover:shadow-lg hover:shadow-aergus-primary/25 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer active:scale-95"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Provisioning...</span>
                  </>
                ) : (
                  <>
                    <span>submit</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteDevelopersStep;
