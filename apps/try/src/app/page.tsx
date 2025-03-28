"use client";

import { useState, useEffect } from 'react';
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
  
  // Check if terms have been accepted on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accepted = localStorage.getItem('termsAccepted') === 'true';
      setTermsAccepted(accepted);
    }
  }, []);

  const handleTermsAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    setTermsAccepted(true);
    setShowFeatures(true);
    setShowTerms(false);
  };

  const handleInteraction = () => {
    if (!showBlahAlert) {
      setShowBlahAlert(true);
      
      // Hide alert after 3 seconds
      setTimeout(() => {
        setShowBlahAlert(false);
      }, 3000);
    }
  };

  const handleSearchResultClick = () => {
    // First make content visible with fade effect
    setContentVisible(true);
    
    // Only show terms if they haven't been accepted yet
    if (!termsAccepted) {
      setShowTerms(true);
    } else {
      setShowFeatures(true);
    }
  };

  return (
    <>
      <main className={`min-h-screen flex flex-col ${contentVisible ? 'content-visible' : ''}`} onClick={handleInteraction}>
        {/* Navbar with fade-in effect when content becomes visible */}
        <div className={`transition-opacity duration-500 ease-in-out ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Navbar />
        </div>
        
        <div className="w-full flex-grow">
          {/* SpotlightHero is always visible */}
          <SpotlightHero onResultClick={handleSearchResultClick} />
          
          {/* Content below SpotlightHero fades in only after interaction */}
          <div className={`transition-opacity duration-500 ease-in-out ${contentVisible ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
            {/* Show Terms of Service only after search result interaction and if not yet accepted */}
            {showTerms && !termsAccepted && (
              <TermsOfService onAccept={handleTermsAccept} />
            )}
            
            {/* Show Features only after terms are accepted */}
            {showFeatures && (
              <>
                <FeatureCards />
                <CommunityInfo />
              </>
            )}
          </div>
        </div>
        
        {/* Footer with fade-in effect when content becomes visible */}
        <div className={`transition-opacity duration-500 ease-in-out ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Footer />
        </div>
      </main>
      
      {/* BLAH Alert - moved outside main content flow */}
      {showBlahAlert && (
        <div className="blah-alert">
          BLAH
        </div>
      )}
    </>
  );
}
