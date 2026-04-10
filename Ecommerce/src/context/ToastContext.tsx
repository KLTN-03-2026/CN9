import React, { createContext, useState } from "react";
import { createPortal } from "react-dom";
import Toast from "../components/common/Toast";
import { StatusMessageType } from "../types/StatusType";

export interface ToastItem {
  id: string;
  message: string;
  type: StatusMessageType;
}

type ToastContextType = {
  showToast: (message: string, type: StatusMessageType) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string, type: StatusMessageType) => {
    const id = crypto.randomUUID();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 1500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {createPortal(
        <div
          className="fixed top-4 right-4 space-y-3"
          style={{ zIndex: 999999 }}
        >
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              type={toast.type}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
};
