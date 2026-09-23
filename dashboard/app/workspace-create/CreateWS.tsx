"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useWorkspaceStore } from "../store/workspaceStore";
import { useToastStore } from "../store/toastStore";
import { useQuotaStore } from "../store/quotaStore";
import { WorkspaceDetailsStep } from "./WorkspaceDetailsStep";
import {
  InviteDevelopersStep,
  InvitedDeveloper,
} from "./InviteDevelopersStep";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

const CreateWS: React.FC = () => {
  const router = useRouter();
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);
  const addToast = useToastStore((state) => state.addToast);
  const openQuotaModal = useQuotaStore((state) => state.openQuotaModal);

  // Step state (1 = Details, 2 = Invite Developers Wireframe)
  const [step, setStep] = useState<1 | 2>(1);
  const [direction, setDirection] = useState<number>(1);

  // Step 1: Workspace info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [nameStatus, setNameStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");
  const [checkingName, setCheckingName] = useState(false);

  // Step 2: Developer invite inputs
  const [developerEmail, setDeveloperEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<
    "ADMIN" | "MEMBER" | "VIEWER"
  >("MEMBER");
  const [isPaid, setIsPaid] = useState<boolean>(true);
  const [selectedTag, setSelectedTag] = useState<string>("Full-time");
  const [invitedDevelopers, setInvitedDevelopers] = useState<
    InvitedDeveloper[]
  >([]);

  const [submitting, setSubmitting] = useState(false);

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const handleNameChange = (val: string) => {
    setName(val);
    if (!val.trim()) {
      setNameStatus("idle");
      setCheckingName(false);
    } else {
      setNameStatus("checking");
      setCheckingName(true);
    }
    if (error) setError(null);
  };

  // Debounced check for workspace name & slug availability
  useEffect(() => {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/workspace/check-availability`,
          {
            params: { name: trimmed, slug },
          }
        );

        if (response.data && response.data.success) {
          if (response.data.available) {
            setNameStatus("available");
            setError(null);
          } else {
            setNameStatus("taken");
            setError(
              response.data.message || "Workspace name is already taken."
            );
          }
        }
      } catch (err: unknown) {
        console.error("Failed to check workspace availability:", err);
        setNameStatus("idle");
      } finally {
        setCheckingName(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [name, slug]);

  // Move from Step 1 to Step 2
  const handleProceedToStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Workspace name is required.");
      return;
    }

    if (nameStatus === "taken") {
      setError("Workspace name is already taken. Please choose another name.");
      return;
    }

    // Direct check before proceeding if not yet verified
    if (nameStatus !== "available") {
      setCheckingName(true);
      try {
        const response = await axios.get(
          `${API_BASE_URL}/workspace/check-availability`,
          {
            params: { name: trimmed, slug },
          }
        );

        if (response.data && response.data.success) {
          if (!response.data.available) {
            setNameStatus("taken");
            setError(
              response.data.message || "Workspace name is already taken."
            );
            return;
          }
          setNameStatus("available");
        }
      } catch (err: unknown) {
        console.error("Availability check failed:", err);
      } finally {
        setCheckingName(false);
      }
    }

    setError(null);
    setDirection(1);
    setStep(2);
  };

  // Back from Step 2 to Step 1
  const handleBackToStep1 = () => {
    setError(null);
    setDirection(-1);
    setStep(1);
  };

  // Final submit handler
  const handleFinalSubmit = async (options: { skipInvites: boolean }) => {
    if (!name.trim()) {
      setStep(1);
      setDirection(-1);
      setError("Workspace name is required.");
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      // 1. Create Workspace
      const newWS = await createWorkspace(name.trim(), description.trim());
      addToast("WORKSPACE INSTANCE ACTIVATED", "success");

      // 2. Dispatch invites if not skipped
      if (!options.skipInvites) {
        const finalInvites = [...invitedDevelopers];
        const trimmedCurrent = developerEmail.trim();
        if (
          trimmedCurrent &&
          !finalInvites.some(
            (d) => d.email.toLowerCase() === trimmedCurrent.toLowerCase()
          )
        ) {
          finalInvites.push({
            id: "temp",
            email: trimmedCurrent,
            role: selectedRole,
            isPaid,
            tag: selectedTag,
          });
        }

        if (finalInvites.length > 0) {
          let successCount = 0;
          let pendingCount = 0;

          for (const dev of finalInvites) {
            try {
              await axios.post(`${API_BASE_URL}/workspace/${newWS.id}/members`, {
                email: dev.email,
                role: dev.role,
              });
              successCount++;
            } catch (invErr: unknown) {
              console.warn(`Invite error for ${dev.email}:`, invErr);
              pendingCount++;
            }
          }

          if (successCount > 0) {
            addToast(
              `INVITATIONS DISPATCHED TO ${successCount} DEVELOPER(S)`,
              "success"
            );
          }
          if (pendingCount > 0 && successCount === 0) {
            addToast(
              "Workspace active. Invites logged for co-developers.",
              "info"
            );
          }
        }
      }

      // 3. Redirect to new workspace
      router.push(`/w/${newWS.slug}`);
    } catch (err: unknown) {
      console.error(err);
      const axiosErr = err as AxiosError<{ message?: string }>;
      const errMsg =
        axiosErr.response?.data?.message ||
        axiosErr.message ||
        "Failed to create workspace.";

      const is403 = axiosErr.response?.status === 403;
      const isTier =
        errMsg.includes("limit") ||
        errMsg.includes("upgrade") ||
        errMsg.includes("tier") ||
        errMsg.includes("Free tier");

      if (is403 || isTier) {
        // Trigger the reusable Quota Limit Exceeded modal
        openQuotaModal(errMsg);
        setError(errMsg);
      } else {
        setError(errMsg);
        addToast(errMsg, "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Animation variants for sliding left and revealing from right
  const slideVariants: Variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: "0%",
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 260, damping: 28 },
        opacity: { duration: 0.22 },
      },
    },
    exit: (dir: number) => ({
      x: dir > 0 ? "-100%" : "100%",
      opacity: 0,
      transition: {
        x: { type: "spring" as const, stiffness: 260, damping: 28 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-aergus-bg font-mono text-aergus-text selection:bg-aergus-primary selection:text-white relative">
      <AnimatePresence mode="wait" custom={direction}>
        {step === 1 ? (
          /* STEP 1: WORKSPACE DETAILS */
          <motion.div
            key="step-1"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full min-h-screen"
          >
            <WorkspaceDetailsStep
              name={name}
              setName={handleNameChange}
              description={description}
              setDescription={setDescription}
              slug={slug}
              error={error}
              setError={setError}
              nameStatus={nameStatus}
              checkingName={checkingName}
              onProceed={handleProceedToStep2}
            />
          </motion.div>
        ) : (
          /* STEP 2: WIREFRAME PAGE (LEFT DARK SQUARE, RIGHT INVITE DEVELOPERS) */
          <motion.div
            key="step-2"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full min-h-screen"
          >
            <InviteDevelopersStep
              name={name}
              slug={slug}
              description={description}
              developerEmail={developerEmail}
              setDeveloperEmail={setDeveloperEmail}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
              isPaid={isPaid}
              setIsPaid={setIsPaid}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              invitedDevelopers={invitedDevelopers}
              setInvitedDevelopers={setInvitedDevelopers}
              submitting={submitting}
              error={error}
              onBack={handleBackToStep1}
              onSubmit={handleFinalSubmit}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default CreateWS;
