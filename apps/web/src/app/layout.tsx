import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import '@medisync/ui/styles.css';
import { AppProvider } from "@/shared/providers/app-provider";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MediSync',
  description: 'Gestão Médica Inteligente',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AppProvider>
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
