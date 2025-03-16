import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "BLAH - Barely Logical Agent Host",
  description: "Open-source ecosystem for managing, distributing, and executing AI agent tools using MCP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen flex flex-col`}>
        <header className="bg-slate-900 text-white py-4 w-full">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">BLAH</h1>
              <nav>
                <ul className="flex space-x-6">
                  <li><a href="/" className="hover:text-blue-400 transition-colors duration-200">Home</a></li>
                  <li><a href="/schema" className="hover:text-blue-400 transition-colors duration-200">Schema</a></li>
                  <li><a href="/examples" className="hover:text-blue-400 transition-colors duration-200">Examples</a></li>
                  <li><a href="https://github.com/thomasdavis/blah" className="hover:text-blue-400 transition-colors duration-200" target="_blank" rel="noopener noreferrer">GitHub</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-slate-900 text-white py-6 w-full">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p>© {new Date().getFullYear()} BLAH Project. MIT License.</p>
              </div>
              <div className="flex space-x-4">
                <a href="https://github.com/thomasdavis/blah" className="text-slate-400 hover:text-white transition-colors duration-200" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://anthropic.com/" className="text-slate-400 hover:text-white transition-colors duration-200" target="_blank" rel="noopener noreferrer">Anthropic</a>
                <a href="https://val.town/" className="text-slate-400 hover:text-white transition-colors duration-200" target="_blank" rel="noopener noreferrer">ValTown</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}