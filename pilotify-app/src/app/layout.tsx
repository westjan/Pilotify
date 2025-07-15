
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "./providers";
import MainLayoutContent from "@/components/MainLayoutContent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pilotify",
  description: "B2B web app for managing pilots",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MainLayoutContent>{children}</MainLayoutContent>
        </AuthProvider>
      </body>
    </html>
  );
}
