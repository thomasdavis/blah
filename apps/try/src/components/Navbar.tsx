"use client";

import Link from 'next/link';

export function Navbar() {
  return (
    <header className="navbar">
      <Link href="/" className="navbar-logo">
        TRY
      </Link>
      <nav className="navbar-nav">
        <Link href="/" className="nav-link active">
          🔍 Search
        </Link>
        <Link href="/docs" className="nav-link">
          📄 Docs
        </Link>
        <Link href="/about" className="nav-link">
          ℹ️ About
        </Link>
        <a 
          href="https://github.com/blahai/blah" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="nav-link"
        >
          📦 GitHub
        </a>
      </nav>
    </header>
  );
}
