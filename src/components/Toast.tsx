"use client";

import React, { useEffect, useState, useCallback, createContext, useContext } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

interface ToastMessage {
  id: number;
  text: string;
  type: "success" | "error";
}

interface ToastContextType {
  showToast: (text: string, type?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

let toastIdCounter = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: "success" | "error" = "success") => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev.filter((t) => t.id !== id), { id, text, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-semibold text-white shadow-xl backdrop-blur-xl animate-toast-in whitespace-nowrap ${
              toast.type === "error"
                ? "bg-red-500/90 shadow-red-500/20"
                : "bg-emerald-500/90 shadow-emerald-500/20"
            }`}
          >
            {toast.type === "error" ? (
              <XCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            )}
            {toast.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
