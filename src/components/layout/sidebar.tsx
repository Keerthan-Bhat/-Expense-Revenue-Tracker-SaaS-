"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  LayoutDashboard,
  ArrowLeftRight,
  FolderOpen,
  Wallet,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: ArrowLeftRight },
  { name: "Categories", href: "/categories", icon: FolderOpen },
  { name: "Accounts", href: "/accounts", icon: Wallet },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-900 dark:text-white">FinanceTrack</h1>
          <p className="text-[10px] text-gray-500 dark:text-gray-400">Expense & Revenue</p>
        </div>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              )}
            >
              <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600 dark:text-blue-400" : "")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <Separator />

      {/* Bottom section */}
      <div className="p-4 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-gray-600 dark:text-gray-400"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </Button>
        {user && (
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-800">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="truncate text-xs font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={signOut}>
              <LogOut className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform dark:border-gray-800 dark:bg-gray-950 lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <NavContent />
      </aside>
    </>
  );
}
