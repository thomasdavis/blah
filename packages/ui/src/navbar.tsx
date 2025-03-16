"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "../lib/utils";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  isExternal?: boolean;
}

const NavLink = React.forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, children, className, isExternal = false, ...props }, ref) => {
    if (isExternal) {
      return (
        <a
          ref={ref}
          href={href}
          className={cn(
            "hover:text-blue-400 transition-colors duration-200",
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
    
    return (
      <Link
        href={href}
        className={cn(
          "hover:text-blue-400 transition-colors duration-200",
          className
        )}
        {...props}
      >
        {children}
      </Link>
    );
  }
);
NavLink.displayName = "NavLink";

interface NavbarProps {
  className?: string;
  logo?: React.ReactNode;
  children?: React.ReactNode;
}

const Navbar = React.forwardRef<HTMLElement, NavbarProps>(
  ({ className, logo, children, ...props }, ref) => {
    return (
      <header
        ref={ref}
        className={cn(
          "bg-slate-900 text-white py-4 w-full",
          className
        )}
        {...props}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">
              {logo || "BLAH"}
            </div>
            <nav>
              {children}
            </nav>
          </div>
        </div>
      </header>
    );
  }
);
Navbar.displayName = "Navbar";

interface NavMenuProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
}

const NavMenu = React.forwardRef<HTMLUListElement, NavMenuProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn("flex space-x-6", className)}
        {...props}
      >
        {children}
      </ul>
    );
  }
);
NavMenu.displayName = "NavMenu";

interface NavItemProps extends React.HTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
}

const NavItem = React.forwardRef<HTMLLIElement, NavItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <li
        ref={ref}
        className={cn("", className)}
        {...props}
      >
        {children}
      </li>
    );
  }
);
NavItem.displayName = "NavItem";

export { Navbar, NavMenu, NavItem, NavLink };