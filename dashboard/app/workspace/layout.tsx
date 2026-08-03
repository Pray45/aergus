"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import { useWorkspaceStore } from "../store/workspaceStore";
import AergusLoader from "../components/Loaing";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { checkSession, isLoggedIn, checkingAuth } = useAuthStore();
  const {
    workspaces,
    fetchWorkspaces,
    hasFetched,
    setActiveWorkspace,
    activeWorkspace,
  } = useWorkspaceStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchWorkspaces().catch(() => {});
    }
  }, [isLoggedIn, fetchWorkspaces]);

  useEffect(() => {
    if (!checkingAuth && !isLoggedIn) {
      router.replace("/login");
    }
  }, [checkingAuth, isLoggedIn, router]);

  useEffect(() => {
    if (!checkingAuth && isLoggedIn && hasFetched) {
      if (workspaces.length === 0) {
        router.replace("/workspace-create");
      } else if (!activeWorkspace) {
        setActiveWorkspace(workspaces[0]);
      }
    }
  }, [checkingAuth, isLoggedIn, hasFetched, workspaces, activeWorkspace, setActiveWorkspace, router]);

  if (checkingAuth || (isLoggedIn && !hasFetched)) {
    return <AergusLoader />;
  }

  if (!isLoggedIn || workspaces.length === 0) {
    return null;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-aergus-bg text-aergus-text font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-aergus-xl">
          {children}
        </main>
      </div>
    </div>
  );
}
