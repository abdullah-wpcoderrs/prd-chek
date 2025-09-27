"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { User, LogOut, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const Navbar = () => {
  const { user, loading, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false); // Close mobile menu on sign out
    // The redirect will be handled by the auth state change listener in useAuth
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary font-sans">
          PRD-<span className="text-black">CHEK</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          {/* Show navigation links only for authenticated users */}
          {user && (
            <>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors font-sans">
                Dashboard
              </Link>
              <Link href="/projects" className="text-sm font-medium hover:text-primary transition-colors font-sans">
                Projects
              </Link>
              <Link href="/templates" className="text-sm font-medium hover:text-primary transition-colors font-sans">
                Templates
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors font-sans">
                How It Works
              </Link>
            </>
          )}

          {/* Show public links for unauthenticated users */}
          {!loading && !user && (
            <>
              <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors font-sans">
                Features
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium hover:text-primary transition-colors font-sans">
                How It Works
              </Link>
            </>
          )}

          {loading ? (
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user.email?.split('@')[0] || 'User'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/sign-in">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* User avatar for mobile (if authenticated) */}
          {!loading && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center" onClick={closeMobileMenu}>
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Hamburger Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          <div className="px-4 py-2 space-y-2">
            {/* Authenticated user links */}
            {user && (
              <>
                <Link
                  href="/dashboard"
                  className="block py-2 text-sm font-medium hover:text-primary transition-colors font-sans"
                  onClick={closeMobileMenu}
                >
                  Dashboard
                </Link>
                <Link
                  href="/projects"
                  className="block py-2 text-sm font-medium hover:text-primary transition-colors font-sans"
                  onClick={closeMobileMenu}
                >
                  Projects
                </Link>
                <Link
                  href="/templates"
                  className="block py-2 text-sm font-medium hover:text-primary transition-colors font-sans"
                  onClick={closeMobileMenu}
                >
                  Templates
                </Link>
                <Link
                  href="/how-it-works"
                  className="block py-2 text-sm font-medium hover:text-primary transition-colors font-sans"
                  onClick={closeMobileMenu}
                >
                  How It Works
                </Link>
              </>
            )}

            {/* Unauthenticated user links */}
            {!loading && !user && (
              <>
                <Link
                  href="/#features"
                  className="block py-2 text-sm font-medium hover:text-primary transition-colors font-sans"
                  onClick={closeMobileMenu}
                >
                  Features
                </Link>
                <Link
                  href="/how-it-works"
                  className="block py-2 text-sm font-medium hover:text-primary transition-colors font-sans"
                  onClick={closeMobileMenu}
                >
                  How It Works
                </Link>
                <div className="pt-2 pb-2">
                  <Link href="/sign-in" onClick={closeMobileMenu}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
