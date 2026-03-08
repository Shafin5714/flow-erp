import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ApolloProvider } from "@/lib/apollo-client";
import { AuthProvider } from "@/lib/auth-context";

import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flow-ERP | Mini ERP System",
  description:
    "A modern Mini ERP application for managing inventory, sales, purchases, and accounting",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ApolloProvider>
          <AuthProvider>{children}</AuthProvider>
        </ApolloProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
