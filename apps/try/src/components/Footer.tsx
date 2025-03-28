"use client";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          &copy; {new Date().getFullYear()} TRY - <span className="highlighted">Experimental Interface</span>
        </div>
        <div className="footer-links">
          <a href="/terms" className="footer-link">📋 Terms</a>
          <a href="/privacy" className="footer-link">🔒 Privacy</a>
          <a href="/contact" className="footer-link">📧 Contact</a>
        </div>
      </div>
    </footer>
  );
}
