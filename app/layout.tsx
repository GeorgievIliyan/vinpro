import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Vinpro",
  description: "check car vin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full antialiased">
        <body
          className={`${inter.variable} font-sans min-h-full flex flex-col`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}