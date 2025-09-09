import { SignedOut, SignInButton, SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
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
          <Link href="/projects" className="text-sm font-medium hover:text-primary transition-colors font-sans">
            Projects
          </Link>
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
