"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/authStore";
import { useToastStore } from "../../store/toastStore";
import { useWorkspaceStore } from "../../store/workspaceStore";
import AergusLoader from "../../components/Loaing";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

// Image URL constant - easily update or swap image URL later
const ILLUSTRATION_SRC = "/login_illustration.png";

export default function LoginPage() {
  const router = useRouter();
  const { login, register, googleLogin, checkSession, isLoggedIn } =
    useAuthStore();
  const addToast = useToastStore((state) => state.addToast);
  const fetchWorkspaces = useWorkspaceStore((state) => state.fetchWorkspaces);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleModeSwitch = (newMode: "login" | "register") => {
    if (newMode === mode) return;
    setError(null);
    setMode(newMode);
  };

  const handleGoogleAuth = () => {
    googleLogin();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match.");
      addToast("Passwords do not match.", "error");
      return;
    }

    setSubmitting(true);

    try {
      if (mode === "register") {
        await register(fullName, email, password);
        addToast("Registration confirmed. Redirecting...", "success");
      } else {
        await login(email, password);
        addToast("Credentials accepted. Enabling access...", "success");
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
    <div className="font-mono text-aergus-text min-h-screen flex items-center justify-center bg-aergus-bg p-4 md:p-8 overflow-hidden select-none">
      {/* Boxy Split Card Container with Sharp Borders (Rig.ai Style) */}
      <div className="w-full max-w-5xl bg-aergus-card border border-aergus-border rounded-none shadow-2xl relative">
        <div className="flex flex-col lg:flex-row w-full min-h-[540px]">
          {/* Panel 1: Hero Banner / Illustration */}
          <div
            className={`w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between tech-hatch-bg transition-transform duration-500 ease-in-out transform ${
              mode === "register"
                ? "lg:translate-x-full border-t lg:border-t-0 lg:border-l border-aergus-border"
                : "border-b lg:border-b-0 lg:border-r border-aergus-border"
            }`}
          >
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-aergus-text tracking-tight mb-3 font-sans">
                {mode === "login" ? (
                  <>
                    Welcome <span className="text-aergus-primary">Back</span>
                  </>
                ) : (
                  <>
                    Create your{" "}
                    <span className="text-aergus-primary">Account</span>
                  </>
                )}
              </h1>
              <p
                className={`text-xs mb-8 ${mode === "login" ? "md:mb-8" : ""} lg:text-sm text-aergus-text-dim leading-relaxed font-mono max-w-sm`}
              >
                {mode === "login"
                  ? "Sign in to keep tracking rankings and fixing issues across your sites."
                  : "Start auditing, tracking, and fixing issues — free to get started."}
              </p>
            </div>

            {/* Central Boxy Graphic Frame (Hidden on mobile) */}
            <div className="hidden md:flex border border-aergus-border bg-aergus-bg/90 rounded-none p-6 flex-col items-center justify-center relative overflow-hidden shadow-inner group my-auto min-h-[220px]">
              <Image
                src={ILLUSTRATION_SRC}
                alt="Aergus Security & Auth"
                width={340}
                height={340}
                className="w-full max-w-[240px] lg:max-w-[270px] h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
          </div>

          {/* Panel 2: Form Controls */}
          <div
            className={`w-full lg:w-1/2 p-8 lg:p-12 flex flex-col justify-between bg-aergus-card transition-transform duration-500 ease-in-out transform ${
              mode === "register" ? "lg:-translate-x-full" : ""
            }`}
          >
            <div>
              {error && (
                <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400">
                  <span className="font-bold uppercase">[AUTH_ERROR]:</span>{" "}
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "register" && (
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-aergus-text flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-aergus-primary"></span>{" "}
                      Name
                    </label>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full bg-aergus-bg border border-aergus-border focus:border-aergus-primary rounded-none py-2.5 px-4 font-mono text-sm text-aergus-text placeholder:text-aergus-text-dim/40 focus:outline-none focus:ring-1 focus:ring-aergus-primary/20 transition-all"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="font-mono text-xs font-bold uppercase tracking-wider text-aergus-text flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-aergus-primary"></span>{" "}
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-aergus-bg border border-aergus-border focus:border-aergus-primary rounded-none py-2.5 px-4 font-mono text-sm text-aergus-text placeholder:text-aergus-text-dim/40 focus:outline-none focus:ring-1 focus:ring-aergus-primary/20 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-aergus-text flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-aergus-primary"></span>{" "}
                      Password
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() =>
                          addToast("Reset link dispatched to email", "info")
                        }
                        className="text-[11px] font-mono text-aergus-text-dim hover:text-aergus-primary transition-colors cursor-pointer"
                      >
                        Forgot Password
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full bg-aergus-bg border border-aergus-border focus:border-aergus-primary rounded-none py-2.5 px-4 pr-11 font-mono text-sm text-aergus-text placeholder:text-aergus-text-dim/40 focus:outline-none focus:ring-1 focus:ring-aergus-primary/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aergus-text-dim hover:text-aergus-text transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {mode === "register" && (
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs font-bold uppercase tracking-wider text-aergus-text flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-aergus-primary"></span>{" "}
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full bg-aergus-bg border border-aergus-border focus:border-aergus-primary rounded-none py-2.5 px-4 pr-11 font-mono text-sm text-aergus-text placeholder:text-aergus-text-dim/40 focus:outline-none focus:ring-1 focus:ring-aergus-primary/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-aergus-text-dim hover:text-aergus-text transition-colors cursor-pointer"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Rhombus Chamfered Action Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 btn-chamfer bg-aergus-primary hover:bg-aergus-primary-hover text-white font-bold text-sm transition-all shadow-lg active:scale-[0.99] cursor-pointer disabled:opacity-50 mt-3 font-mono uppercase tracking-wider"
                >
                  {submitting
                    ? "PROCESSING..."
                    : mode === "register"
                      ? "Create Account"
                      : "Sign In"}
                </button>
              </form>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-5">
                <div className="w-full h-px bg-aergus-border" />
                <span className="absolute bg-aergus-card px-3 font-mono text-[10px] text-aergus-text-dim uppercase tracking-widest">
                  OR
                </span>
              </div>

              {/* Google Identity Auth with Chamfer Cut */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full h-11 btn-chamfer bg-aergus-bg border border-aergus-border hover:border-aergus-text/40 text-aergus-text font-bold text-xs font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                {mode === "login"
                  ? "Sign in with Google"
                  : "Sign up with Google"}
              </button>
            </div>

            {/* Bottom Link Toggle */}
            <div className="mt-6 text-center text-xs font-mono text-aergus-text-dim">
              {mode === "login" ? (
                <>
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("register")}
                    className="text-aergus-primary font-bold hover:underline cursor-pointer ml-1"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch("login")}
                    className="text-aergus-primary font-bold hover:underline cursor-pointer ml-1"
                  >
                    Sign in
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
