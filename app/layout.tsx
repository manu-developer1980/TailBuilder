import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Generador Visual de Componentes React + Tailwind CSS",
  description:
    "Herramienta web para componer jerarquías visuales de elementos HTML/React, personalizar estilos Tailwind en tiempo real y exportar código limpio.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="h-full w-full overflow-hidden bg-slate-950 text-slate-100 flex flex-col">
        {children}
      </body>
    </html>
  );
}
