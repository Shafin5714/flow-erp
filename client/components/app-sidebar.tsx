"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Package,
  Settings,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    title: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
  toggleCollapsed?: () => void;
}

export function AppSidebar({ className, isCollapsed, toggleCollapsed }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "relative pb-12 h-screen border-r bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 will-change-[width] transition-[width] duration-200 ease-out",
        isCollapsed ? "w-[80px]" : "w-64",
        className
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div
            className={cn(
              "flex items-center px-4 mb-8",
              isCollapsed ? "justify-center px-0" : "gap-2"
            )}
          >
            <div className="flex items-center justify-center h-8 w-8 text-primary shrink-0">
              <svg
                className="w-full h-full"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            {!isCollapsed && (
              <h2 className="text-xl font-bold tracking-tight text-primary whitespace-nowrap overflow-hidden">
                Flow-ERP
              </h2>
            )}
          </div>
          <div className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full group relative",
                  isCollapsed
                    ? "h-10 w-10 p-0 mx-auto mb-2 flex items-center justify-center"
                    : "justify-start px-4",
                  pathname === item.href
                    ? "bg-white dark:bg-zinc-800 shadow-sm font-semibold text-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                )}
                asChild
              >
                <Link
                  href={item.href}
                  className={cn(isCollapsed ? "flex justify-center items-center" : "")}
                >
                  <item.icon
                    className={cn(
                      "shrink-0",
                      isCollapsed ? "h-5 w-5 mr-0" : "h-4 w-4 mr-3",
                      pathname === item.href && !isCollapsed
                        ? "text-primary bg-primary/10 rounded-sm p-0.5 w-6 h-6 mr-3"
                        : ""
                    )}
                  />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Collapse Toggle */}
      {toggleCollapsed && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-11 h-6 w-6 rounded-full border bg-background shadow-md hidden md:flex"
          onClick={toggleCollapsed}
        >
          {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      )}
    </div>
  );
}

export function MobileSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <div className="px-3 py-2">
          <div className="flex items-center gap-2 px-4 mb-6">
            <div className="flex items-center justify-center h-8 w-8 text-primary">
              <svg
                className="w-full h-full"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-primary">Flow-ERP</h2>
          </div>
          <div className="space-y-1">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link href={item.href}>
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
