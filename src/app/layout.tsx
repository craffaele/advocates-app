import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const lora = Lora({ subsets: ["latin"], weight: ["400","700"] });

export const metadata: Metadata = {
    title: "Solace Candidate Assignment",
    description: "Show us what you got",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className={lora.className}>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}
