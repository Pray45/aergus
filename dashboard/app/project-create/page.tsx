"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProjectCreateRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/workspace/projects/create");
  }, [router]);

  return null;
}
