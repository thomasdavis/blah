import "./globals.css";
import { Inter } from "next/font/google";

// Import UI components individually 
import { Navbar } from "@repo/ui/navbar";
import { Footer } from "@repo/ui/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BLAH Registry",
  description: "A public registry for compute functions and tools",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar logo="BLAH Registry" />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
