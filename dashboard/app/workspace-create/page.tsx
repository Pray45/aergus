"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/authStore";
import CreateWS from "./CreateWS";
import AergusLoader from "../components/Loaing";

export default function Page() {
  const router = useRouter();
  const { checkSession, isLoggedIn, checkingAuth } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!checkingAuth && !isLoggedIn) {
      router.replace("/login");
    }
  }, [checkingAuth, isLoggedIn, router]);

  if (checkingAuth) {
    return <AergusLoader />;
  }

  if (!isLoggedIn) {
    return null;
  }

  return <CreateWS />;
}
