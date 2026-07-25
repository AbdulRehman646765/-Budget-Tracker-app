"use client";

import React, { useCallback, createContext, useContext, useState } from "react";

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

const toastContainerStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "90px",
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  alignItems: "center",
  pointerEvents: "none",
};

const toastBaseStyle: React.CSSProperties = {
  pointerEvents: "auto",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 22px",
  borderRadius: "14px",
  fontSize: "14px",
  fontWeight: 600,
  color: "#fff",
  whiteSpace: "nowrap",
  backdropFilter: "blur(16px)",
  animation: "fadeSlideUp 0.4s ease-out both",
  fontFamily: "inherit",
};

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
      <div style={toastContainerStyle}>
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              ...toastBaseStyle,
              background: toast.type === "error"
                ? "rgba(239, 68, 68, 0.92)"
                : "rgba(34, 197, 94, 0.92)",
              boxShadow: toast.type === "error"
                ? "0 8px 24px rgba(239, 68, 68, 0.3)"
                : "0 8px 24px rgba(34, 197, 94, 0.3)",
            }}
          >
            <i className={toast.type === "error" ? "fa-solid fa-circle-xmark" : "fa-solid fa-circle-check"}></i>
            {toast.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
