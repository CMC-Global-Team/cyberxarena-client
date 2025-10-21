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
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/80 backdrop-blur-md">
          <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-6 text-foreground shadow-lg">
            <div className="relative">
              <Spinner className="size-8 text-primary" />
              <div className="absolute inset-0 animate-ping">
                <Spinner className="size-8 text-primary/20" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-medium">Đang xử lý...</p>
              <p className="text-sm text-muted-foreground">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        </div>
      )}
    </LoadingContext.Provider>
  );
};


