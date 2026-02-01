"use client";

import { useState } from "react";
import { AppSidebar, MobileSidebar } from "@/components/app-sidebar";
import { MainNav } from "@/components/main-nav";
import { cn } from "@/lib/utils";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950">
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden md:block flex-shrink-0 transition-all duration-300",
          isCollapsed ? "w-[80px]" : "w-64"
        )}
      >
        <AppSidebar
          className="fixed h-full"
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      <div className="flex-1 flex flex-col transition-all duration-300">
        <header className="flex h-16 items-center border-b px-4 lg:px-6 bg-background">
          <MobileSidebar />
          <div className="ml-auto w-full flex items-center justify-end">
            <MainNav />
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6 space-y-4">{children}</main>
      </div>
    </div>
  );
}
