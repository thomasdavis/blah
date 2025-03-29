import './globals.css';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Try BLAH',
  description: 'Interactive playground for the BLAH CLI tool',
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
