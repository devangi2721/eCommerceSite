"use client";
import Header from "@/components/Header";
import { Providers } from "@/components/Providers";
import TokenSyncProvider from "@/components/TokenSyncProvider";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  const shouldShowHeader = () => {
    if (pathname === "/login" || pathname === "/register") return false;
    if (pathname.includes("/admin")) {
      return false;
    }
    return true;
  };

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
            {shouldShowHeader() ? (
              <TokenSyncProvider>
                <Header />
                <div>{children}</div>
              </TokenSyncProvider>
            ) : (
                <div>{children}</div>
            )}
        </Providers>
      </body>
    </html>
  );
}
