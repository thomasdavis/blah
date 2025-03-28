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
  
  // Check if terms have been accepted on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accepted = localStorage.getItem('termsAccepted') === 'true';
      setTermsAccepted(accepted);
      
      // Only show features if terms have been accepted
      if (accepted) {
        setShowFeatures(true);
      }
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
    // Only show terms if they haven't been accepted yet
    if (!termsAccepted) {
      setShowTerms(true);
    }
  };

  return (
    <main className="min-h-screen flex flex-col" onClick={handleInteraction}>
      <Navbar />
      <div className="w-full flex-grow">
        <SpotlightHero onResultClick={handleSearchResultClick} />
        
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
        
        {/* BLAH Alert */}
        {showBlahAlert && (
          <div className="blah-alert">
            BLAH
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
