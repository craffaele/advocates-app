import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import "./globals.css";

export const metadata: Metadata = {
  title: 'Solace Candidate Assignment',
  description: 'Show us what you got',
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode }>) {
  return (
      <html lang="en">
      <body className="font-serif">
      <Providers>{children}</Providers>
      </body>
      </html>
  );
}
