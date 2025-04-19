import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientSidebar } from "./client-components";
import { SubAdminProvider } from "../context/sub-admin-context"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Master Admin Panel",
  description: "Admin dashboard for cab management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SubAdminProvider>
          <div className="flex min-h-screen">
            <ClientSidebar />
            <main className="flex-1 p-4">
              {children}
            </main>
          </div>
        </SubAdminProvider>
      </body>
    </html>
  );
}