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
  title: 'Orbii',
  description:
    'A retro-inspired platformer game. Play on desktop or mobile, collect stars, avoid spikes, and reach the goal!',
  applicationName: 'Orbii',
  keywords: [
    'game',
    'platformer',
    'arcade',
    'casual',
    'retro',
    'bounce',
    'stars',
    'spikes',
    'mobile',
    'desktop',
    'web',
  ],
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
