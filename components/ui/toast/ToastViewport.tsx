"use client";

import {
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
  HiXMark,
} from "react-icons/hi2";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import type { ToastItem, ToastVariant } from "./types";

interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const variantStyles: Record<
  ToastVariant,
  { container: string; icon: string; Icon: IconType }
> = {
  success: {
    container: "border-[#78C850] bg-[#f0fff0] text-[var(--pokemon-navy)]",
    icon: "text-[#4a9c2d]",
    Icon: HiCheckCircle,
  },
  error: {
    container: "border-[var(--pokemon-red)] bg-[#fff0f0] text-[var(--pokemon-navy)]",
    icon: "text-[var(--pokemon-red)]",
    Icon: HiExclamationCircle,
  },
  info: {
    container: "border-[var(--pokemon-blue)] bg-[#eef6ff] text-[var(--pokemon-navy)]",
    icon: "text-[var(--pokemon-blue)]",
    Icon: HiInformationCircle,
  },
  warning: {
    container: "border-[var(--pokemon-yellow-dark)] bg-[#fffbe6] text-[var(--pokemon-navy)]",
    icon: "text-[var(--pokemon-yellow-dark)]",
    Icon: HiExclamationCircle,
  },
};

export default function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div aria-live="polite" aria-relevant="additions" className="toast-viewport">
      {toasts.map((toast) => {
        const styles = variantStyles[toast.variant];
        const Icon = styles.Icon;

        return (
          <div
            key={toast.id}
            role="status"
            className={cn(
              "toast-item pointer-events-auto flex w-full items-start gap-3 rounded-2xl border-2 p-4 shadow-lg",
              styles.container,
            )}
          >
            <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", styles.icon)} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold">{toast.title}</p>
              {toast.message ? (
                <p className="mt-1 text-sm leading-6 opacity-90">{toast.message}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="focus-pokemon inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full opacity-70 transition-opacity hover:opacity-100"
              aria-label="Dismiss notification"
            >
              <HiXMark className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
