import type { Metadata } from "next";
import localFont from "next/font/local";
import { Navbar, NavMenu, NavItem, NavLink } from "@repo/ui/navbar";
import { Footer, FooterLink, FooterLinks } from "@repo/ui/footer";
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
        <Navbar>
          <NavMenu>
            <NavItem>
              <NavLink href="/">Home</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/schema">Schema</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/examples">Examples</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="https://github.com/thomasdavis/blah" isExternal>GitHub</NavLink>
            </NavItem>
          </NavMenu>
        </Navbar>
        <main className="flex-grow">
          {children}
        </main>
        <Footer copyrightText={`© ${new Date().getFullYear()} BLAH Project. MIT License.`}>
          <FooterLinks>
            <FooterLink href="https://github.com/thomasdavis/blah">GitHub</FooterLink>
            <FooterLink href="https://anthropic.com/">Anthropic</FooterLink>
            <FooterLink href="https://val.town/">ValTown</FooterLink>
          </FooterLinks>
        </Footer>
      </body>
    </html>
  );
}