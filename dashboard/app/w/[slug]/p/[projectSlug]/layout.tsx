"use client";

import React, { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { useWorkspaceStore } from "@/app/store/workspaceStore";
import { useProjectStore } from "@/app/store/projectStore";
import AergusLoader from "@/app/components/Loaing";
import Sidebar from "@/app/components/Sidebar";
import Header from "@/app/components/Header";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const params = useParams();
  const workspaceSlug = params.slug as string;
  const projectSlug = params.projectSlug as string;

  const { isLoggedIn } = useAuthStore();
  const { activeWorkspace } = useWorkspaceStore();

  const {
    projects,
    fetchProjects,
    hasFetched: hasFetchedProjects,
    setActiveProject,
    activeProject,
  } = useProjectStore();

  // Fetch projects when active workspace is verified
  useEffect(() => {
    if (isLoggedIn && activeWorkspace) {
      fetchProjects(activeWorkspace.id).catch(() => {});
    }
  }, [isLoggedIn, activeWorkspace, fetchProjects]);

  // Match active project
  useEffect(() => {
    if (isLoggedIn && activeWorkspace && hasFetchedProjects) {
      const matchingProject = projects.find((p) => p.slug === projectSlug);
      if (matchingProject) {
        if (activeProject?.id !== matchingProject.id) {
          setActiveProject(matchingProject);
        }
      } else if (projects.length > 0) {
        router.replace(`/w/${activeWorkspace.slug}/p/${projects[0].slug}/dashboard`);
      } else {
        // If there are no projects, user should go to the projects directory page to create one
        router.push("/workspace/projects");
      }
    }
  }, [isLoggedIn, activeWorkspace, hasFetchedProjects, projects, projectSlug, activeProject, setActiveProject, router]);

  if (!isLoggedIn || !activeWorkspace || !hasFetchedProjects) {
    return <AergusLoader />;
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
