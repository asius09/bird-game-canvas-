import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bird Game',
  description: 'A simple bird game built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full overscroll-none">
      <body
        className={`${geistSans.variable} ${geistMono.variable} h-full min-h-screen w-full min-w-screen touch-none overflow-hidden overscroll-none bg-[#0f2027] antialiased select-none`}
      >
        <div className="pointer-events-none fixed inset-0 -z-10 flex h-full w-full items-center justify-center select-none" />
        {children}
      </body>
    </html>
  );
}
