"use client";

import { useState, useCallback } from "react";
import { AppSidebar, MobileSidebar } from "@/components/app-sidebar";
import { MainNav } from "@/components/main-nav";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapsed = useCallback(() => setIsCollapsed((prev) => !prev), []);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950">
      {/* Desktop Sidebar - fixed position, no layout impact */}
      <div className="hidden md:block">
        <AppSidebar
          className="fixed top-0 left-0 h-full z-30"
          isCollapsed={isCollapsed}
          toggleCollapsed={toggleCollapsed}
        />
      </div>

      {/* Main content - uses margin to offset for sidebar */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-[margin] duration-200 ease-out",
          isCollapsed ? "md:ml-[80px]" : "md:ml-64"
        )}
      >
        <header className="flex h-12 items-center border-b px-4 lg:px-6 bg-background py-7">
          <MobileSidebar />
          <div className="ml-auto w-full flex items-center justify-end">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 p-4 space-y-4">{children}</main>
      </div>
    </div>
  );
}
