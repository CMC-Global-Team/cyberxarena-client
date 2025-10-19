"use client"

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type NoticeType = "success" | "info" | "warning" | "error";

export interface NoticeItem {
  id: string;
  type: NoticeType;
  message: string;
}

interface NoticeContextValue {
  notify: (notice: Omit<NoticeItem, "id">) => void;
}

const NoticeContext = createContext<NoticeContextValue | undefined>(undefined);

export function useNotice(): NoticeContextValue {
  const ctx = useContext(NoticeContext);
  if (!ctx) throw new Error("useNotice must be used within NoticeProvider");
  return ctx;
}

export const NoticeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [notices, setNotices] = useState<NoticeItem[]>([]);

  const remove = useCallback((id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const notify = useCallback((notice: Omit<NoticeItem, "id">) => {
    const id = Math.random().toString(36).slice(2);
    const item: NoticeItem = { id, ...notice };
    setNotices((prev) => [...prev, item]);
    // auto dismiss after 3s
    setTimeout(() => remove(id), 3000);
  }, [remove]);

  const value = useMemo(() => ({ notify }), [notify]);

  return (
    <NoticeContext.Provider value={value}>
      {children}
      {/* Notice container */}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {notices.map((n) => (
          <div
            key={n.id}
            className={
              "min-w-[240px] rounded-md border px-3 py-2 shadow-sm text-sm " +
              (n.type === "success"
                ? "bg-green-50 text-green-700 border-green-200"
                : n.type === "error"
                ? "bg-red-50 text-red-700 border-red-200"
                : n.type === "warning"
                ? "bg-yellow-50 text-yellow-800 border-yellow-200"
                : "bg-blue-50 text-blue-700 border-blue-200")
            }
            role="status"
            aria-live="polite"
          >
            {n.message}
          </div>
        ))}
      </div>
    </NoticeContext.Provider>
  );
};


