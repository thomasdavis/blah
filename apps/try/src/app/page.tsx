"use client";

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SpotlightHero } from '@/components/spotlight/SpotlightHero';
import { FeatureCards } from '@/components/FeatureCards';
import { TermsOfService } from '@/components/TermsOfService';
import { CommunityInfo } from '@/components/CommunityInfo';

export default function Home() {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showBlahAlert, setShowBlahAlert] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  // Check if terms have been accepted on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const accepted = localStorage.getItem('termsAccepted') === 'true';
      setTermsAccepted(accepted);
      setShowFeatures(accepted);
    }
  }, []);

  const handleTermsAccept = () => {
    setTermsAccepted(true);
    setShowFeatures(true);
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

  return (
    <main className="min-h-screen flex flex-col" onClick={handleInteraction}>
      <Navbar />
      <div className="w-full flex-grow">
        <SpotlightHero />
        
        {/* Show Terms of Service if not accepted */}
        {!termsAccepted && (
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
