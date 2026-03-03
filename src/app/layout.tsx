import type { Metadata } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Wojtek Gorecki – Digitaler Zwilling',
  description:
    'Sprich mit dem digitalen Zwilling von Wojtek Gorecki – KI-gestützter Product Owner. Stelle Fragen zu KI, Produktentwicklung und Product Ownership.',
  openGraph: {
    title: 'Wojtek Gorecki – Digitaler Zwilling',
    description: 'KI-gestützter digitaler Zwilling von Wojtek Gorecki, Product Owner.',
    url: 'https://ai.wojtek-gorecki.de',
    siteName: 'Wojtek Gorecki AI',
    locale: 'de_DE',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${spaceMono.variable} antialiased`}
        style={{ fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
