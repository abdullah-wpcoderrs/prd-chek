"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGeneration } from "@/lib/context/GenerationContext";
import { useAuth } from "@/lib/hooks/useAuth";
import { Loader2, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { activeGenerations } = useGeneration();
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const activeCount = activeGenerations.size;
  
  const handleSignOut = async () => {
    await signOut();
    // The redirect will be handled by the auth state change listener in useAuth
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-primary font-sans">
          PRDGen
        </Link>
        <div className="flex gap-6 items-center">
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
            </>
          )}
          
          {/* Show public links for unauthenticated users */}
          {!loading && !user && (
            <>
              <Link href="/#features" className="text-sm font-medium hover:text-primary transition-colors font-sans">
                Features
              </Link>
              <Link href="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors font-sans">
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
      </div>
    </header>
  );
};

export default Navbar;
