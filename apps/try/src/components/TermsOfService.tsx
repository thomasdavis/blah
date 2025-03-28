"use client";
import { useState } from 'react';

interface TermsOfServiceProps {
  onAccept: () => void;
}

export function TermsOfService({ onAccept }: TermsOfServiceProps) {
  const handleAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    onAccept();
  };

  return (
    <div className="terms-container">
      <div className="window">
        <div className="title-bar">
          <span>BLAH - Terms of Service</span>
          <button className="close-btn" onClick={handleAccept}>✕</button>
        </div>
        <div className="window-body">
          <h2>BLAH Project Terms and Conditions</h2>
          
          <div className="terms-content">
            <p>Welcome to the TRY interface for BLAH (Barely Logical Agent Host). By using this software, you agree to the following terms:</p>
            
            <h3>1. Open Source License</h3>
            <p>This project is licensed under the MIT License. You are free to use, modify, and distribute this software in accordance with the terms of that license.</p>
            
            <h3>2. No Warranty</h3>
            <p>This software is provided "as-is" without any warranty of any kind, express or implied. The authors or copyright holders shall not be liable for any claims, damages, or other liability.</p>
            
            <h3>3. Privacy</h3>
            <p>We respect your privacy. Any data collection is limited to what is necessary for the function of the application and will be handled in accordance with our Privacy Policy.</p>
            
            <h3>4. Contribution</h3>
            <p>Contributions to the project are welcome. By contributing, you agree to license your contributions under the same license as the project.</p>
            
            <h3>5. Community Standards</h3>
            <p>When participating in the community, please be respectful of others and follow the project's code of conduct.</p>
            
            <h3>6. Decentralization</h3>
            <p>BLAH is committed to decentralization. No single entity controls the platform, and we encourage a distributed network of participants.</p>
          </div>
          <div className="terms-buttons">
            <button onClick={handleAccept} className="accept-btn">Accept</button>
          </div>
        </div>
      </div>
    </div>
  );
}