import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { AppProvider } from "@/components/app-provider";
import { ClientBody } from "./ClientBody";
import { DarkModeProvider } from "@/components/dark-mode-provider";
import { LoadingScreen } from '@/components/LoadingScreen';

export const metadata: Metadata = {
  title: "Gifts Catalog",
  description: "A catalog for Telegram NFT gifts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" defer />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 font-sans text-sm">
        <LoadingScreen>
          <AppProvider>
            <DarkModeProvider>
              <ClientBody>{children}</ClientBody>
              <Toaster position="top-right" />
            </DarkModeProvider>
          </AppProvider>
        </LoadingScreen>
      </body>
    </html>
  );
}
