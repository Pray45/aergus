"use client";

import React, { useState } from "react";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useToastStore } from "../../store/toastStore";
import { Card } from "../../(auth)/authComponent/Card";
import { Field } from "../../(auth)/authComponent/Field";
import { Button } from "../../(auth)/authComponent/Button";
import axios from "axios";
import { Users, UserPlus, Shield } from "lucide-react";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";
  status: "ACTIVE" | "PENDING";
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export default function WorkspaceTeamPage() {
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const addToast = useToastStore((state) => state.addToast);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"ADMIN" | "MEMBER" | "VIEWER">("MEMBER");
  const [inviting, setInviting] = useState(false);
  const [showInviteForm, setShowInviteForm] = useState(false);

  // realistic mock members list
  const [members, setMembers] = useState<Member[]>([
    {
      id: "1",
      name: "Hermione Granger",
      email: "hermione@aergus.sh",
      role: "OWNER",
      status: "ACTIVE",
    },
    {
      id: "2",
      name: "Harry Potter",
      email: "harry@aergus.sh",
      role: "ADMIN",
      status: "ACTIVE",
    },
    {
      id: "3",
      name: "Ron Weasley",
      email: "ron@aergus.sh",
      role: "MEMBER",
      status: "ACTIVE",
    },
  ]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace) return;
    if (!email) return;

    setInviting(true);
    try {
      await axios.post(`${API_BASE_URL}/workspace/${activeWorkspace.id}/members`, {
        email,
        role,
      });

      addToast("INVITATION DISPATCHED SUCCESSFULLY", "success");
      
      // Add pending invitation to local list for feedback
      const newMember: Member = {
        id: Math.random().toString(),
        name: email.split("@")[0],
        email,
        role,
        status: "PENDING",
      };
      setMembers((prev) => [...prev, newMember]);
      setEmail("");
      setShowInviteForm(false);
    } catch (err: any) {
      addToast(err.response?.data?.message || err.message || "Failed to invite member", "error");
    } finally {
      setInviting(false);
    }
  };

  const getRoleBadgeColor = (roleStr: string) => {
    switch (roleStr) {
      case "OWNER":
        return "bg-aergus-primary/20 text-aergus-primary border-aergus-primary/30";
      case "ADMIN":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "MEMBER":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-aergus-text-dim/10 text-aergus-text-dim border-aergus-text-dim/20";
    }
  };

  return (
    <div className="space-y-6 font-mono text-aergus-text max-w-5xl mx-auto">
      <div className="flex justify-between items-center border-b border-aergus-border pb-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-aergus-text uppercase">Team Settings</h1>
          <p className="text-xs text-aergus-text-dim/80 mt-1 uppercase font-semibold font-mono tracking-tight">
            Manage user roles and permissions access to secure instances
          </p>
        </div>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="h-9 px-4 bg-aergus-primary text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-aergus-primary-hover active:scale-[0.99] transition-all cursor-pointer"
        >
          {showInviteForm ? "CLOSE CONSOLE" : "+ INVITE CO-DEVELOPER"}
        </button>
      </div>

      {showInviteForm && (
        <div className="max-w-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <Card
            title="Invite Member"
            subtitle="Grant platform access to a new team member"
            systemState={inviting ? "STATUS: DISPATCHING..." : "STATUS: READY"}
          >
            <form onSubmit={handleInvite} className="space-y-4 mt-6">
              <Field
                label="EMAIL ADDRESS"
                placeholder="developer@aergus.sh"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
              />
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-bold text-aergus-text uppercase tracking-widest">
                  ACCESS ROLE
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="h-12 bg-aergus-card border border-aergus-border px-4 rounded text-xs focus:outline-none focus:border-aergus-primary font-mono text-aergus-text"
                >
                  <option value="ADMIN">ADMIN (Configure & Modify)</option>
                  <option value="MEMBER">MEMBER (Read & Manage Services)</option>
                  <option value="VIEWER">VIEWER (Read-Only access)</option>
                </select>
              </div>
              <Button type="submit" disabled={inviting}>
                {inviting ? "DISPATCHING INVITATION..." : "DISPATCH INVITATION"}
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Members Catalog Table */}
      <div className="bg-aergus-card border border-aergus-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-aergus-border bg-aergus-bg/40 flex items-center gap-2">
          <Users className="w-4 h-4 text-aergus-primary" />
          <span className="text-xs font-bold uppercase tracking-wider text-aergus-text">
            Active Members ({members.length})
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-aergus-border text-[10px] text-aergus-text-dim uppercase tracking-wider">
                <th className="p-4 font-bold">MEMBER</th>
                <th className="p-4 font-bold">ROLE</th>
                <th className="p-4 font-bold">STATUS</th>
                <th className="p-4 font-bold text-right">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id} className="border-b border-aergus-border/40 hover:bg-aergus-text/[0.01] transition-colors">
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-aergus-text">{m.name}</span>
                      <span className="text-[10px] text-aergus-text-dim mt-0.5">{m.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-sm border text-[9px] font-bold tracking-wider ${getRoleBadgeColor(m.role)}`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-semibold tracking-tight ${m.status === "ACTIVE" ? "text-green-500" : "text-yellow-500"}`}>
                      ● {m.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {m.role !== "OWNER" && (
                      <button
                        onClick={() => {
                          setMembers((prev) => prev.filter((item) => item.id !== m.id));
                          addToast("ACCESS REVOKED", "success");
                        }}
                        className="text-[10px] font-bold text-aergus-primary hover:underline cursor-pointer"
                      >
                        REVOKE ACCESS
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
