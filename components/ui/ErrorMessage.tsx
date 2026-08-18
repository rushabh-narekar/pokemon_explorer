"use client";

import { HiExclamationTriangle } from "react-icons/hi2";

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-red-200 bg-red-50 px-5 py-5 text-red-900 sm:px-6"
    >
      <div className="flex items-start gap-3">
        <HiExclamationTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-2 text-sm leading-6">{message}</p>
          {onRetry ? (
            <button type="button" onClick={onRetry} className="btn-secondary mt-4">
              Try again
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
