"use client";

import ErrorMessage from "@/components/ui/ErrorMessage";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorMessage
      title="Application error"
      message={error.message || "An unexpected error occurred."}
      onRetry={reset}
    />
  );
}
