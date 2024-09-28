import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import React from 'react';
import RootProviders from '@/components/providers/RootProviders';
import { Toaster } from '@/components/ui/sonner';
import { dark, shadesOfPurple } from '@clerk/themes'


const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Agro Finanses',
  description: 'Agro Finanses is a platform for managing your finances.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{
      baseTheme: shadesOfPurple,
    }}>
      <html
        lang="en"
        className="dark"
        style={{
          colorScheme: 'dark',
        }}
      >
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Toaster richColors position='bottom-right'/>
          <RootProviders>
            {children}
          </RootProviders>
        </body>
      </html>
    </ClerkProvider>
  );
}
