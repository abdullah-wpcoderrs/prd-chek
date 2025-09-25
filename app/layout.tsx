import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

import Navbar from "@/components/Navbar";
import { GenerationProvider } from "@/lib/context/GenerationContext";
import { AuthProvider } from "@/lib/context/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "PRD-CHEK - AI Documentation Generator for Technical Product Managers",
  description: "Generate comprehensive PRDs, technical specifications, and strategic documentation instantly with AI-powered tools designed for technical product managers and context engineers",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
      {
        url: '/logo.png',
        type: 'image/png',
        sizes: '32x32',
      },
    ],
    apple: [
      {
        url: '/logo.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',
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
            <Toaster />
          </GenerationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
