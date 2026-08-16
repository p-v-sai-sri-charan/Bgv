"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DocumentType } from "@/generated/prisma/client";

export function UploadForm({
  caseId,
  type,
  requiresDocumentNumber,
}: {
  caseId: string;
  type: DocumentType;
  requiresDocumentNumber: boolean;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    formData.set("caseId", caseId);
    formData.set("type", type);

    try {
      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });
      const body = await response.json();
      if (!response.ok) {
        setError(body.error ?? "Upload failed");
        return;
      }
      event.currentTarget.reset();
      router.refresh();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex flex-wrap items-end gap-2">
      {requiresDocumentNumber && (
        <div className="w-40">
          <Input
            name="documentNumber"
            placeholder={type === "AADHAR" ? "Aadhar number" : "PAN number"}
            required
          />
        </div>
      )}
      <div className="w-56">
        <Input
          type="file"
          name="file"
          accept="application/pdf,image/jpeg,image/png"
          required
        />
      </div>
      <Button type="submit" variant="secondary" disabled={submitting}>
        {submitting ? "Uploading..." : "Upload"}
      </Button>
      {error && <p className="w-full text-sm text-red-600">{error}</p>}
    </form>
  );
}
