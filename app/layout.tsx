import type React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import Navigation from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blog & Novel - Trang cá nhân",
  description: "Blog cá nhân và tiểu thuyết online",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navigation />
            <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
              {children}
            </main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
