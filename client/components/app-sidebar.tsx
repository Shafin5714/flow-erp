"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  FileText,
  Store,
  CreditCard,
  Settings,
  HelpCircle,
  Menu,
  ChevronDown,
  Moon,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

type SubItem = {
  title: string;
  href: string;
};

type NavItem = {
  title: string;
  href?: string;
  icon: LucideIcon;
  items?: SubItem[];
};

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    icon: Package,
    items: [
      { title: "All Products", href: "/products" },
      { title: "Add Product", href: "/products/new" },
      { title: "Categories", href: "/products/categories" },
    ],
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    items: [
      { title: "All Orders", href: "/orders" },
      { title: "Returns", href: "/orders/returns" },
      { title: "Order Tracking", href: "/orders/tracking" },
    ],
  },
  {
    title: "Sales",
    href: "/sales",
    icon: DollarSign,
  },
  {
    title: "Customers",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Reports",
    href: "/reports",
    icon: FileText,
  },
];

const settingsNavItems: NavItem[] = [
  {
    title: "Marketplace Sync",
    href: "/sync",
    icon: Store,
  },
  {
    title: "Payment Gateways",
    href: "/payments",
    icon: CreditCard,
  },
  {
    title: "Settings",
    icon: Settings,
    items: [
      { title: "General", href: "/settings" },
      { title: "Security", href: "/settings/security" },
    ],
  },
  {
    title: "Help Center",
    href: "/help",
    icon: HelpCircle,
  },
];

function NavMenu({
  items,
  title,
  isCollapsed,
}: {
  items: NavItem[];
  title: string;
  isCollapsed?: boolean;
}) {
  const pathname = usePathname();
  // Keep Orders expanded by default to match image
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Orders: true,
  });

  const toggleExpand = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="mb-6">
      {!isCollapsed && (
        <h3 className="px-5 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          {title}
        </h3>
      )}
      <div className="space-y-0.5">
        {items.map((item) => {
          const isActive = item.href ? pathname === item.href : false;
          const isExpanded = expanded[item.title];
          const hasItems = item.items && item.items.length > 0;

          return (
            <div key={item.title}>
              {hasItems ? (
                <button
                  onClick={() => toggleExpand(item.title)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                    isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "",
                    isActive
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50"
                  )}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={cn(
                        "shrink-0 h-[18px] w-[18px]",
                        isCollapsed
                          ? "mr-0"
                          : "mr-3 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                      )}
                    />
                    {!isCollapsed && <span>{item.title}</span>}
                  </div>
                  {!isCollapsed && hasItems && (
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-zinc-400 transition-transform duration-200",
                        isExpanded && "rotate-180"
                      )}
                    />
                  )}
                </button>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={cn(
                    "w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors group",
                    isCollapsed ? "justify-center px-0 h-10 w-10 mx-auto" : "",
                    isActive
                      ? "bg-zinc-100/80 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50 font-semibold"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-50"
                  )}
                >
                  <item.icon
                    className={cn(
                      "shrink-0 h-[18px] w-[18px]",
                      isCollapsed ? "mr-0" : "mr-3",
                      isActive
                        ? "text-zinc-900 dark:text-zinc-50"
                        : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                    )}
                  />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )}

              {!isCollapsed && hasItems && isExpanded && (
                <div className="mt-1 ml-6 pl-4 border-l border-zinc-200 dark:border-zinc-800 space-y-1 py-1">
                  {item.items?.map((subItem) => (
                    <Link
                      key={subItem.title}
                      href={subItem.href}
                      className={cn(
                        "block w-full text-[13px] py-1.5 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors",
                        pathname === subItem.href && "text-zinc-900 font-medium dark:text-zinc-50"
                      )}
                    >
                      {subItem.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  isCollapsed?: boolean;
  toggleCollapsed?: () => void;
}

export function AppSidebar({ className, isCollapsed }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <div
      className={cn(
        "relative h-screen border-r bg-[#f8f9fa] dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 will-change-[width] transition-[width] duration-200 ease-out flex flex-col z-20",
        isCollapsed ? "w-[80px]" : "w-64",
        className
      )}
    >
      <div className="flex-none h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6">
        <div className={cn("flex items-center w-full", isCollapsed ? "justify-center" : "gap-3")}>
          <div className="flex items-center justify-center h-8 w-8 text-primary shrink-0">
            <svg
              className="w-full h-full"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
            </svg>
          </div>
          {!isCollapsed && (
            <h2 className="text-xl font-bold tracking-tight text-primary whitespace-nowrap overflow-hidden">
              Flow-ERP
            </h2>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-6 space-y-2">
        <div className="px-3">
          <NavMenu items={mainNavItems} title="MAIN" isCollapsed={isCollapsed} />
          <NavMenu items={settingsNavItems} title="SETTINGS" isCollapsed={isCollapsed} />
        </div>
      </div>

      <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 mt-auto">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className={cn(
            "w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors rounded-lg",
            isCollapsed && "justify-center px-0"
          )}
        >
          <div className="flex items-center">
            <Moon className={cn("h-[18px] w-[18px]", isCollapsed ? "" : "mr-3")} />
            {!isCollapsed && <span>Dark Mode</span>}
          </div>
          {!isCollapsed && mounted && (
            <div
              className={cn(
                "w-8 h-4 rounded-full flex items-center transition-colors p-0.5 ease-in-out duration-200",
                theme === "dark" ? "bg-zinc-600" : "bg-zinc-200"
              )}
            >
              <div
                className={cn(
                  "w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200",
                  theme === "dark" ? "translate-x-4" : "translate-x-0"
                )}
              />
            </div>
          )}
        </button>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="p-0 w-72 bg-[#f8f9fa] dark:bg-zinc-950 border-r-zinc-200 dark:border-r-zinc-800 flex flex-col"
      >
        <div className="flex-none h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-6">
          <div className="flex items-center gap-3 w-full">
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
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <div className="px-3">
            <NavMenu items={mainNavItems} title="MAIN" />
            <NavMenu items={settingsNavItems} title="SETTINGS" />
          </div>
        </div>

        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 mt-auto">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors rounded-lg"
          >
            <div className="flex items-center">
              <Moon className="h-[18px] w-[18px] mr-3" />
              <span>Dark Mode</span>
            </div>
            {mounted && (
              <div
                className={cn(
                  "w-8 h-4 rounded-full flex items-center transition-colors p-0.5 ease-in-out duration-200",
                  theme === "dark" ? "bg-zinc-600" : "bg-zinc-200"
                )}
              >
                <div
                  className={cn(
                    "w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200",
                    theme === "dark" ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </div>
            )}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
