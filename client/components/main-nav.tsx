"use client";

import { Search, Bell, Settings, Store } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  toggleSidebar?: () => void;
}

export function MainNav({ className, toggleSidebar, ...props }: MainNavProps) {
  const { user, logout } = useAuth();
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Get user initials for avatar fallback
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className={cn("flex items-center justify-between w-full space-x-4", className)} {...props}>
      <div className="flex items-center gap-2 md:gap-4 flex-1">
        {toggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-10 w-10 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="14" y1="12" y2="12" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        )}
        <div className="w-full flex-1 md:w-auto md:flex-none flex items-center">
          <div
            className={cn(
              "relative flex items-center transition-all duration-300 ease-in-out bg-[#f8f9fa] dark:bg-zinc-800/50 rounded-full border border-transparent",
              isSearchFocused
                ? "shadow-[0_0_0_2px_rgba(59,130,246,0.3)] border-blue-200 dark:border-blue-900 w-full md:w-[320px] lg:w-[400px]"
                : "w-full md:w-[240px] lg:w-[320px] hover:bg-zinc-100 dark:hover:bg-zinc-800"
            )}
          >
            <Search
              className={cn(
                "absolute left-3 h-[18px] w-[18px] transition-colors duration-200",
                isSearchFocused ? "text-primary" : "text-zinc-400"
              )}
            />
            <Input
              type="search"
              placeholder="Search typing..."
              className="h-10 w-full rounded-full pl-10 pr-4 text-sm bg-transparent border-none focus-visible:ring-0 shadow-none placeholder:text-zinc-400"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 md:gap-3">
        {/* POS Button */}
        <Link href="/pos" passHref legacyBehavior>
          <Button
            variant="default"
            size="sm"
            className="hidden md:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm rounded-lg font-medium transition-all shadow-primary/20 hover:shadow-primary/40 leading-none h-10 px-4"
          >
            <Store className="h-4 w-4" />
            <span>POS System</span>
          </Button>
        </Link>
        <Link href="/pos" passHref legacyBehavior>
          <Button
            variant="default"
            size="icon"
            className="flex md:hidden bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm rounded-full h-10 w-10"
          >
            <Store className="h-4 w-4" />
            <span className="sr-only">POS System</span>
          </Button>
        </Link>

        {/* Settings Icon - Desktop only */}
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:flex rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-10 w-10 transition-colors"
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>

        {/* Notification Bell */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-800 h-10 w-10 transition-colors group"
        >
          <Bell className="h-5 w-5 group-hover:animate-in group-hover:slide-in-from-bottom-2 group-hover:duration-300" />
          {/* Notification Indicator Dot */}
          <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-zinc-950" />
          <span className="sr-only">Notifications</span>
        </Button>

        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden md:block"></div>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="group rounded-full h-10 w-10 ml-1 ring-offset-background hover:bg-transparent focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
            >
              <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-zinc-200 dark:group-hover:border-zinc-700 transition-colors duration-200 shadow-sm">
                <AvatarImage
                  src="/avatars/01.png"
                  alt={user?.name ?? "User"}
                  className="object-cover"
                />
                <AvatarFallback className="text-xs bg-primary/10 text-primary font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 mt-2 rounded-xl shadow-lg border-zinc-200/60 dark:border-zinc-800/60"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1 p-1">
                <p className="text-sm font-semibold leading-none text-zinc-900 dark:text-zinc-100">
                  {user?.name ?? "User"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email ?? "user@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
            <DropdownMenuItem className="rounded-lg cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-800 mt-1">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-800">
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg cursor-pointer focus:bg-zinc-100 dark:focus:bg-zinc-800 mb-1">
              Support
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800" />
            <DropdownMenuItem
              onClick={logout}
              className="rounded-lg cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 dark:text-red-400 dark:focus:bg-red-950/50 m-1 font-medium"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
