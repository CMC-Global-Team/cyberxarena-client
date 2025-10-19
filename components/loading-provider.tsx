"use client"

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface LoadingContextValue {
  show: () => void;
  hide: () => void;
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextValue | undefined>(undefined);

export function useLoading(): LoadingContextValue {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
}

export const LoadingProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [active, setActive] = useState(false);

  const show = useCallback(() => setActive(true), []);
  const hide = useCallback(() => setActive(false), []);

  const withLoading = useCallback(async <T,>(fn: () => Promise<T>): Promise<T> => {
    show();
    try {
      return await fn();
    } finally {
      hide();
    }
  }, [show, hide]);

  const value = useMemo(() => ({ show, hide, withLoading }), [show, hide, withLoading]);

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {active && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-md border bg-card px-4 py-2 text-foreground">
            <Spinner className="size-5" />
            <span>Đang tải...</span>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};


