// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pharmacy Express ",
  description: "Pharmacy landing site",
  icons: {
  icon: "/icon.png",
}
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} min-h-screen bg-white flex flex-col`}
      >
        <AuthProvider>
          <Navbar />
          {/* 👇 main grows to fill the screen */}
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
