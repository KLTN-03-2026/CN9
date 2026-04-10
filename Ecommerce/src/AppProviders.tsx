import type { ReactNode } from "react";
import { ToastProvider } from "./context/ToastContext";

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return <ToastProvider>{children}</ToastProvider>;
};
