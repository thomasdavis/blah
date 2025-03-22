import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BLAH - Barely Logical Agent Host',
  description: 'Documentation for the BLAH CLI tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
