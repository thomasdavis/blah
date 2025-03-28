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
      {/* Custom cursor overlay */}
      <div ref={cursorRef} className="custom-cursor" />
      
      <main 
        className={`min-h-screen flex flex-col ${contentVisible ? 'content-visible' : ''} ${isDarkMode ? 'dark-theme' : 'light-theme'}`} 
        onClick={handleInteraction}
      >
        {/* Dark mode toggle */}
        <button 
          className="dark-mode-toggle" 
          onClick={(e) => {
            e.stopPropagation();
            toggleDarkMode();
          }}
          aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
        
        {/* Navbar with enhanced fade-in and parallax effect */}
        <div 
          className={`navbar-container transition-all duration-700 ease-out transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'}`}
        >
          <Navbar />
        </div>
        
        <div className="w-full flex-grow relative">
          {/* Background gradient effect */}
          <div className="background-gradient"></div>
          
          {/* 3D layered effect for depth */}
          <div className="layer-effect"></div>
          
          {/* SpotlightHero with enhanced spotlight effect */}
          <div className="spotlight-container">
            <SpotlightHero onResultClick={handleSearchResultClick} />
          </div>
          
          {/* Content below SpotlightHero with staggered animation */}
          <div className={`content-container transition-all duration-800 ease-out ${contentVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 h-0 overflow-hidden'}`}>
            {/* Show Terms of Service with card morphism effect */}
            {showTerms && !termsAccepted && (
              <div className="terms-container morphism-card">
                <TermsOfService onAccept={handleTermsAccept} />
              </div>
            )}
            
            {/* Show Features with bento grid layout */}
            {showFeatures && (
              <div className="features-section">
                <div className="bento-grid">
                  <FeatureCards />
                </div>
                <div className="community-section">
                  <CommunityInfo />
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with enhanced fade-in and parallax effect */}
        <div 
          className={`footer-container transition-all duration-700 ease-out transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <Footer />
        </div>
      </main>
      
      {/* BLAH Alert - modernized with morphism effect */}
      {showBlahAlert && (
        <div className="blah-alert morphism-card">
          <div className="alert-content">
            <span className="alert-icon">✨</span>
            <span className="alert-text">BLAH</span>
          </div>
        </div>
      )}
    </>
  );
}
