import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: {
    default: "Universal Auth — Production-Grade Authentication",
    template: "%s · Universal Auth",
  },
  description:
    "A complete, production-ready authentication backend with JWT, OAuth2, 2FA, RBAC, rate limiting, and email verification. Built with Spring Boot 3 & Next.js 16.",
  keywords: [
    "authentication",
    "JWT",
    "OAuth2",
    "2FA",
    "Spring Boot",
    "Next.js",
    "RBAC",
    "rate limiting",
    "email verification",
  ],
  authors: [{ name: "Shahrayar Sahito" }],
  creator: "Shahrayar Sahito",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Universal Auth — Production-Grade Authentication",
    description:
      "A complete, production-ready authentication backend with 41 REST APIs. JWT, OAuth2, 2FA, RBAC — all included.",
    siteName: "Universal Auth",
  },
  twitter: {
    card: "summary_large_image",
    title: "Universal Auth — Production-Grade Authentication",
    description:
      "A complete, production-ready authentication backend with 41 REST APIs.",
    creator: "@shahrayar",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}