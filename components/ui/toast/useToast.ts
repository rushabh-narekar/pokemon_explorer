"use client";

import { useContext } from "react";
import { ToastContext } from "./ToastProvider";
import type { ToastInput, ToastVariant } from "./types";

function buildToast(variant: ToastVariant, title: string, message?: string): ToastInput {
  return { variant, title, message };
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return {
    show: context.show,
    dismiss: context.dismiss,
    success: (title: string, message?: string) =>
      context.show(buildToast("success", title, message)),
    error: (title: string, message?: string) =>
      context.show(buildToast("error", title, message)),
    info: (title: string, message?: string) =>
      context.show(buildToast("info", title, message)),
    warning: (title: string, message?: string) =>
      context.show(buildToast("warning", title, message)),
  };
}
