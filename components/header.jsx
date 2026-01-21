"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { LayoutDashboard, Receipt, Wallet, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transaction/create", icon: Receipt },
  { name: "Accounts", href: "/account", icon: Wallet },
  { name: "Split Expense", href: "/split", icon: Users },
];

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full bg-white z-50 border-b border-gray-200">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-gray-100">
            <Logo className="w-6 h-6 text-black" />
          </div>
          <span className="hidden md:block text-xl font-bold text-gray-900">
            CashTrackr
          </span>
        </Link>

        {/* Navigation Pills - Only show when signed in */}
        <SignedIn>
          <div className="hidden md:flex items-center gap-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2",
                    isActive
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  <Icon size={16} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </SignedIn>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          <SignedIn>
            {/* Profile */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>

          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <button className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition-colors">
                Login
              </button>
            </SignInButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  );
};

export default Header;
