import React, { createContext, useContext, useState, useEffect } from "react";
import { registerFallbackListener, checkBackendHealth } from "../lib/api";
import type { EngineMode } from "../lib/api";

export interface Toast {
  id: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
}

interface AppContextType {
  theme: "dark" | "light";
  toggleTheme: () => void;
  engine: EngineMode;
  setEngine: (mode: EngineMode) => void;
  backendOnline: boolean;
  toasts: Toast[];
  addToast: (message: string, type?: "info" | "success" | "warning" | "error") => void;
  removeToast: (id: string) => void;
  isTourOpen: boolean;
  openTour: () => void;
  closeTour: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state persisted in localStorage
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    const saved = localStorage.getItem("keyexchange_theme");
    return saved === "light" ? "light" : "dark";
  });

  // Engine mode state
  const [engine, setEngine] = useState<EngineMode>("api");
  const [backendOnline, setBackendOnline] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isTourOpen, setIsTourOpen] = useState<boolean>(false);

  const addToast = (message: string, type: "info" | "success" | "warning" | "error" = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Listen for automatic fallback from api client
  useEffect(() => {
    registerFallbackListener((msg) => {
      addToast(msg, "warning");
      setBackendOnline(false);
      setEngine("local");
    });
  }, []);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth().then((res) => {
      setBackendOnline(res.ok);
      if (!res.ok) {
        setEngine("local");
      }
    });
  }, []);

  // Sync theme to document element
  useEffect(() => {
    localStorage.setItem("keyexchange_theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const openTour = () => setIsTourOpen(true);
  const closeTour = () => setIsTourOpen(false);

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        engine,
        setEngine,
        backendOnline,
        toasts,
        addToast,
        removeToast,
        isTourOpen,
        openTour,
        closeTour,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
