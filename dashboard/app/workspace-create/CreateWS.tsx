"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "../(auth)/authComponent/Card";
import { Field } from "../(auth)/authComponent/Field";
import { Button } from "../(auth)/authComponent/Button";
import { useWorkspaceStore } from "../store/workspaceStore";
import { useToastStore } from "../store/toastStore";

const CreateWS: React.FC = () => {
  const router = useRouter();
  const createWorkspace = useWorkspaceStore((state) => state.createWorkspace);
  const addToast = useToastStore((state) => state.addToast);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const newWS = await createWorkspace(name, description);
      addToast("WORKSPACE INSTANCE ACTIVATED", "success");
      router.push(`/w/${newWS.slug}`);
    } catch (err: any) {
      console.error(err);
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "Failed to create workspace.";
      setError(errMsg);
      addToast(errMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="font-mono text-aergus-text min-h-screen flex flex-col items-center justify-center relative bg-aergus-bg selection:bg-aergus-primary selection:text-white">
      <main className="flex items-center justify-center w-full px-4 md:px-16 z-10 py-12">
        <div className="w-full max-w-[480px]">
          <Card
            title="Create Workspace"
            subtitle="Configure and spin up a new secure workspace instance"
            systemState={
              submitting ? "STATUS: PROVISIONING..." : "STATUS: READY"
            }
          >
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <Field
                label="WORKSPACE NAME"
                placeholder="ACME CORP"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Field
                label="DESCRIPTION"
                placeholder="Primary secure development node"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button type="submit" disabled={submitting} className="mt-6">
                {submitting
                  ? "PROVISIONING INSTANCE..."
                  : "INITIALIZE INSTANCE"}
              </Button>
            </form>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateWS;
