"use client";

import { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SpotlightHero } from '@/components/spotlight/SpotlightHero';
import { FeatureCards } from '@/components/FeatureCards';
import { TermsOfService } from '@/components/TermsOfService';
import { CommunityInfo } from '@/components/CommunityInfo';
import type { ReactElement } from 'react';

export default function Home(): ReactElement {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showBlahAlert, setShowBlahAlert] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  
  // Check if terms have been accepted and dark mode preference on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accepted = localStorage.getItem('termsAccepted') === 'true';
      setTermsAccepted(accepted);
      
      // Check for dark mode preference
      const darkModePreference = localStorage.getItem('darkMode') === 'true';
      setIsDarkMode(darkModePreference);
      if (darkModePreference) {
        document.documentElement.classList.add('dark-mode');
      }
    }
  }, []);

  // Custom cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Add a slight delay for a smoother effect
        setTimeout(() => {
          if (cursorRef.current) {
            cursorRef.current.style.left = `${e.clientX}px`;
            cursorRef.current.style.top = `${e.clientY}px`;
          }
        }, 50);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleTermsAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    setTermsAccepted(true);
    setShowFeatures(true);
    setShowTerms(false);
    
    // Add a subtle animation when terms are accepted
    document.documentElement.classList.add('terms-accepted-animation');
    setTimeout(() => {
      document.documentElement.classList.remove('terms-accepted-animation');
    }, 1000);
  };

  const handleInteraction = () => {
    if (!showBlahAlert) {
      setShowBlahAlert(true);
      
      // Hide alert after 3 seconds with a more elegant fade out
      setTimeout(() => {
        setShowBlahAlert(false);
      }, 3000);
    }
  };

  const handleSearchResultClick = () => {
    // First make content visible with enhanced fade effect
    setContentVisible(true);
    
    // Only show terms if they haven't been accepted yet
    if (!termsAccepted) {
      setShowTerms(true);
    } else {
      setShowFeatures(true);
    }
  };
  
  const toggleDarkMode = () => {
    const newDarkModeState = !isDarkMode;
    setIsDarkMode(newDarkModeState);
    localStorage.setItem('darkMode', newDarkModeState.toString());
    
    if (newDarkModeState) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
  };

  return (
    <>
      <main className={`retro-app ${isDarkMode ? 'dark-mode' : ''}`} onClick={handleInteraction}>
        {/* Dark mode toggle */}
        <button 
          className="retro-dark-mode-toggle" 
          onClick={(e) => {
            e.stopPropagation();
            toggleDarkMode();
          }}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        
        {/* Navbar with retro styling */}
        <div className={`retro-navbar ${contentVisible ? 'visible' : 'hidden'}`}>
          <Navbar />
        </div>
        
        <div className="retro-main-content">
          {/* SpotlightHero with retro computing theme */}
          <SpotlightHero onResultClick={handleSearchResultClick} />
          
          {/* Content below SpotlightHero */}
          <div className={`retro-content ${contentVisible ? 'visible' : 'hidden'}`}>
            {/* Show Terms of Service */}
            {showTerms && !termsAccepted && (
              <div className="retro-window terms-window">
                <div className="retro-window-title">Terms of Service</div>
                <div className="retro-window-content">
                  <TermsOfService onAccept={handleTermsAccept} />
                </div>
              </div>
            )}
            
            {/* Show Features */}
            {showFeatures && (
              <div className="retro-features">
                <div className="retro-window features-window">
                  <div className="retro-window-title">Features</div>
                  <div className="retro-window-content">
                    <FeatureCards />
                  </div>
                </div>
                
                <div className="retro-window community-window">
                  <div className="retro-window-title">Community</div>
                  <div className="retro-window-content">
                    <CommunityInfo />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with retro styling */}
        <div className={`retro-footer ${contentVisible ? 'visible' : 'hidden'}`}>
          <Footer />
        </div>
      </main>
      
      {/* BLAH Alert - retro styled */}
      {showBlahAlert && (
        <div className="retro-alert">
          <div className="retro-alert-content">
            <span className="retro-alert-icon">!</span>
            <span className="retro-alert-text">BLAH</span>
          </div>
        </div>
      )}
    </>
  );
}
