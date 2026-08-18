export type ToastVariant = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
}

export interface ToastInput {
  title: string;
  message?: string;
  variant?: ToastVariant;
}
