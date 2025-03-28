"use client";

import Link from 'next/link';

export function Navbar() {
  return (
    <header className="navbar">
      <Link href="/" className="navbar-logo">
        BLAH
      </Link>
      <nav className="navbar-nav">
        <Link href="/" className="nav-link active">
          SEARCH
        </Link>
        <Link href="/docs" className="nav-link">
          DOCS
        </Link>
        <Link href="/about" className="nav-link">
          ABOUT
        </Link>
        <a 
          href="https://github.com/blahai/blah" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="nav-link"
        >
          GITHUB
        </a>
      </nav>
    </header>
  );
}
