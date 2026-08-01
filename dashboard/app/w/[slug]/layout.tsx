"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import AergusLoader from "../../components/Loaing";

export default function WorkspaceSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { checkSession, isLoggedIn, checkingAuth } = useAuthStore();
  const {
    workspaces,
    fetchWorkspaces,
    loading: loadingWorkspaces,
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
      } else {
        const matchingWorkspace = workspaces.find((w) => w.slug === slug);
        if (matchingWorkspace) {
          if (activeWorkspace?.id !== matchingWorkspace.id) {
            setActiveWorkspace(matchingWorkspace);
          }
        } else {
          router.replace(`/w/${workspaces[0].slug}`);
        }
      }
    }
  }, [
    checkingAuth,
    isLoggedIn,
    hasFetched,
    workspaces,
    slug,
    activeWorkspace,
    setActiveWorkspace,
    router,
  ]);

  if (checkingAuth || (isLoggedIn && !hasFetched)) {
    return <AergusLoader />;
  }

  if (!isLoggedIn || workspaces.length === 0) {
    return null;
  }

  return <>{children}</>;
}
