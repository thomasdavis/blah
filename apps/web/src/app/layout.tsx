import './globals.css';
import type { Metadata } from 'next';
import { Manrope, Spectral } from 'next/font/google';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const spectral = Spectral({
  subsets: ['latin'],
  display: 'swap',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  variable: '--font-spectral',
});

export const metadata: Metadata = {
  title: 'BLAH - Barely Logical Agent Host',
  description: 'The protocol-agnostic infrastructure layer for AI tool interoperability',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en" className={`${manrope.variable} ${spectral.variable}`}>
      <body className="bg-white min-h-screen relative overflow-x-hidden">
        {/* Simple dot grid background pattern */}
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBoLTYweiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0iI2YwZjBmMCIgLz48Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iMS41IiBmaWxsPSIjZjBmMGYwIiAvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjEuNSIgZmlsbD0iI2YwZjBmMCIgLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjAiIHI9IjEuNSIgZmlsbD0iI2YwZjBmMCIgLz48Y2lyY2xlIGN4PSIwIiBjeT0iNjAiIHI9IjEuNSIgZmlsbD0iI2YwZjBmMCIgLz48L2c+PC9zdmc+')]} opacity-10 z-0"></div>
        
        {/* Clean, minimal container for content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </body>
    </html>
  );
}