"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  copyrightText?: string;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, copyrightText, children, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn("bg-slate-900 text-white py-6 w-full", className)}
        {...props}
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {copyrightText && (
              <div className="mb-4 md:mb-0">
                <p>{copyrightText}</p>
              </div>
            )}
            {children}
          </div>
        </div>
      </footer>
    );
  }
);
Footer.displayName = "Footer";

interface FooterLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
}

const FooterLink = React.forwardRef<HTMLAnchorElement, FooterLinkProps>(
  ({ className, href, children, ...props }, ref) => {
    return (
      <a
        ref={ref}
        href={href}
        className={cn(
          "text-slate-400 hover:text-white transition-colors duration-200",
          className
        )}
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  }
);
FooterLink.displayName = "FooterLink";

interface FooterLinksProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const FooterLinks = React.forwardRef<HTMLDivElement, FooterLinksProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex space-x-4", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
FooterLinks.displayName = "FooterLinks";

export { Footer, FooterLink, FooterLinks };