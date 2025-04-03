import './globals.css';
import type { Metadata } from 'next';

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
    <html lang="en">
      <body className="bg-white min-h-screen relative overflow-x-hidden">
        {/* Background pattern - subtle grid with dots */}
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBoLTYweiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0iI2Y1ZjVmNSIgLz48Y2lyY2xlIGN4PSIwIiBjeT0iMCIgcj0iMS41IiBmaWxsPSIjZjVmNWY1IiAvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjEuNSIgZmlsbD0iI2Y1ZjVmNSIgLz48Y2lyY2xlIGN4PSI2MCIgY3k9IjAiIHI9IjEuNSIgZmlsbD0iI2Y1ZjVmNSIgLz48Y2lyY2xlIGN4PSIwIiBjeT0iNjAiIHI9IjEuNSIgZmlsbD0iI2Y1ZjVmNSIgLz48L2c+PC9zdmc+')] opacity-20 z-0"></div>
        
        {/* Animated decorative elements */}
        <div className="fixed top-40 left-10 w-20 h-20 bg-brand-100 border-4 border-black rotate-12 z-0 hidden lg:block animate-pulse"></div>
        <div className="fixed bottom-60 right-10 w-24 h-24 bg-secondary-100 border-4 border-black -rotate-12 z-0 hidden lg:block animate-pulse"></div>
        <div className="fixed top-1/3 right-20 w-16 h-16 bg-success-100 border-4 border-black rotate-45 z-0 hidden lg:block animate-pulse"></div>
        
        {/* Additional floating elements */}
        <div className="fixed top-1/4 left-1/4 w-12 h-12 bg-danger-100 border-3 border-black rotate-6 z-0 hidden lg:block animate-bounce"></div>
        <div className="fixed bottom-1/4 right-1/4 w-10 h-10 bg-brand-200 border-3 border-black -rotate-6 z-0 hidden lg:block animate-bounce"></div>
        
        {/* Gradient orbs */}
        <div className="fixed top-1/2 left-10 w-40 h-40 rounded-full bg-gradient-to-br from-brand-100/30 to-secondary-100/10 blur-xl z-0 animate-pulse"></div>
        <div className="fixed bottom-1/3 right-20 w-32 h-32 rounded-full bg-gradient-to-tr from-success-100/20 to-danger-100/10 blur-xl z-0 animate-pulse"></div>
        
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}