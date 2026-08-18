"use client";

import ErrorMessage from "@/components/ui/ErrorMessage";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorMessage
      title="Application error"
      message="Something went wrong loading the page. Please try again."
      onRetry={reset}
    />
  );
}
