"use client";

import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGeneration } from "@/lib/context/GenerationContext";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

const Navbar = () => {
  const { activeGenerations } = useGeneration();
  const activeCount = activeGenerations.size;
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold text-primary font-sans">
          PRDGen
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors font-sans">
            Dashboard
          </Link>
          <div className="relative">
            <Link href="/projects" className="text-sm font-medium hover:text-primary transition-colors font-sans">
              Projects
            </Link>
            {activeCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-yellow-500 text-white"
              >
                <Loader2 className="w-3 h-3 animate-spin" />
              </Badge>
            )}
          </div>
          <Link href="/templates" className="text-sm font-medium hover:text-primary transition-colors font-sans">
            Templates
          </Link>
          <SignedOut>
            <SignInButton>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
