import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import Navbar from "@/components/Navbar";
import { GenerationProvider } from "@/lib/context/GenerationContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRDGen - AI Documentation Generator for Vibe Coders",
  description: "Generate comprehensive PRDs, user stories, sitemaps, and technical documentation instantly with AI-powered tools designed for modern developers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased font-sans">
        <AuthProvider>
          <GenerationProvider>
            <Navbar />
            {children}
          </GenerationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
