"use client";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          &copy; {new Date().getFullYear()} BLAH - <span className="highlighted">BARELY LOGICAL AGENT HOST</span>
        </div>
        <div className="footer-links">
          <a href="/terms" className="footer-link">TERMS</a>
          <a href="/privacy" className="footer-link">PRIVACY</a>
          <a href="/contact" className="footer-link">CONTACT</a>
        </div>
      </div>
    </footer>
  );
}
