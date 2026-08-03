"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { useProjectStore } from "../../store/projectStore";
import AergusLoader from "../../components/Loaing";

export default function WorkspaceHomePage() {
  const router = useRouter();
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  const { projects, fetchProjects, hasFetched } = useProjectStore();

  useEffect(() => {
    if (activeWorkspace) {
      fetchProjects(activeWorkspace.id).catch(() => {});
    }
  }, [activeWorkspace, fetchProjects]);

  useEffect(() => {
    if (activeWorkspace && hasFetched) {
      if (projects.length > 0) {
        router.replace(`/w/${activeWorkspace.slug}/p/${projects[0].slug}/dashboard`);
      } else {
        router.replace("/workspace/projects");
      }
    }
  }, [activeWorkspace, hasFetched, projects, router]);

  return <AergusLoader />;
}
