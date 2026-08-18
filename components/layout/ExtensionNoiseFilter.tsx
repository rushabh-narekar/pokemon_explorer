"use client";

import { useEffect } from "react";

function isExtensionNoise(reason: unknown): boolean {
  const message = reason instanceof Error ? reason.message : String(reason ?? "");
  const stack = reason instanceof Error ? reason.stack ?? "" : "";

  return (
    message.includes("chrome-extension://") ||
    stack.includes("chrome-extension://") ||
    stack.includes("eppiocemhmnlbhjplcgkofciiegomcon")
  );
}

export default function ExtensionNoiseFilter() {
  useEffect(() => {
    function onUnhandledRejection(event: PromiseRejectionEvent) {
      if (isExtensionNoise(event.reason)) {
        event.preventDefault();
      }
    }

    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => window.removeEventListener("unhandledrejection", onUnhandledRejection);
  }, []);

  return null;
}
