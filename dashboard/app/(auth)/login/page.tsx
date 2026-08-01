"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import { Card } from "../authComponent/Card";
import { Field } from "../authComponent/Field";
import { Button } from "../authComponent/Button";

import AergusLoader from "../../components/Loaing";

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const { login, register, googleLogin, checkSession, isLoggedIn } =
    useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const fetchWorkspaces = useWorkspaceStore((state) => state.fetchWorkspaces);

  const [mode, setMode] = useState<"register" | "login">("register");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    const handleRedirect = async () => {
      if (isLoggedIn) {
        try {
          const list = await fetchWorkspaces();
          if (list.length === 0) {
            router.replace("/workspace-create");
          } else {
            router.replace(`/w/${list[0].slug}`);
          }
        } catch (err) {
          router.replace("/workspace-create");
        }
      }
    };
    handleRedirect();
  }, [isLoggedIn, fetchWorkspaces, router]);

  const handleGoogleAuth = () => {
    googleLogin();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === "register") {
        await register(fullName, email, password);
        addToast("NODE REGISTRATION CONFIRMED. REDIRECTING...", "success");
      } else {
        await login(email, password);
        addToast("CREDENTIALS ACCEPTED. ENABLING ACCESS...", "success");
      }
    } catch (err: any) {
      console.error(err);
      const errMsg =
        err.response?.data?.message || err.message || "Authentication failed.";
      setError(errMsg);
      addToast(errMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoggedIn) {
    return <AergusLoader />;
  }

  return (
    <div className="font-mono text-aergus-text min-h-screen flex flex-col items-center justify-between relative bg-aergus-bg">
      {/* Main Content Area */}
      <main className="flex-grow flex items-center justify-center w-full px-4 md:px-16 z-10 py-12">
        <div className="w-full max-w-[480px]">
          {/* Centralized Card Component */}
          <Card
            title={"aergus"}
            subtitle={
              mode === "register"
                ? "Welcome to Aergus, let's get setup!"
                : "Welcome back to Aergus!"
            }
            systemState={
              submitting
                ? "STATUS: RUNNING..."
                : error
                  ? "STATUS: ERROR_ENCOUNTERED"
                  : "STATUS: STANDBY"
            }
            footerContent={
              <p className="font-mono text-[11px] uppercase tracking-wider text-aergus-text-dim">
                {mode === "register" ? (
                  <>
                    AUTHENTICATED?{" "}
                    <Button
                      variant="link"
                      onClick={() => {
                        setMode("login");
                        setError(null);
                      }}
                      className="text-aergus-primary"
                    >
                      EXECUTE LOGIN
                    </Button>
                  </>
                ) : (
                  <>
                    NEW INSTANCE?{" "}
                    <Button
                      variant="link"
                      onClick={() => {
                        setMode("register");
                        setError(null);
                      }}
                      className="text-aergus-primary"
                    >
                      REGISTER NODE
                    </Button>
                  </>
                )}
              </p>
            }
          >
            <Button variant="github" onClick={handleGoogleAuth}>
              Google Identity Auth
            </Button>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-10">
              <div className="w-full h-px bg-aergus-border" />
              <span className="absolute bg-aergus-card px-4 font-mono text-[10px] text-aergus-text-dim uppercase tracking-[0.2em]">
                MANUAL INPUT REQUIRED
              </span>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {mode === "register" && (
                <Field
                  label="NAME"
                  placeholder="ID_ENTITY"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              )}

              <Field
                label="EMAIL"
                type="email"
                placeholder="EMAIL_ADDR"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Field
                label="PASSWORD"
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                helperText="MIN. ENTROPY: 128-BIT REQUIRED"
                required
              />

              {/* Primary CTA */}
              <Button type="submit" disabled={submitting} className="mt-6">
                {submitting
                  ? "PROCESSING..."
                  : mode === "register"
                    ? "CONFIRM REGISTRATION"
                    : "EXECUTE LOGIN"}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
