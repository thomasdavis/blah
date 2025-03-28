"use client";

import { useState, useEffect } from 'react';

interface TermsOfServiceProps {
  onAccept: () => void;
}

export function TermsOfService({ onAccept }: TermsOfServiceProps) {
  const handleAccept = () => {
    localStorage.setItem('termsAccepted', 'true');
    onAccept();
  };

  return (
    <div className="terms-of-service-container">
      <div className="terms-of-service-window">
        <div className="terms-of-service-title">
          Terms of Service
        </div>
        <div className="terms-of-service-content">
          <h2>BLAH Project Terms and Conditions</h2>
          
          <div className="terms-of-service-text">
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
          </div>
        </div>
        <div className="terms-of-service-buttons">
          <button onClick={handleAccept} className="btn btn-primary">Accept</button>
        </div>
      </div>
    </div>
  );
}