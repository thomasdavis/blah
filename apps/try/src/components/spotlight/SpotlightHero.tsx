"use client";
import { Spotlight } from './Spotlight';
import type { ReactElement } from 'react';

interface SpotlightHeroProps {
  onResultClick?: () => void;
}

export function SpotlightHero({ onResultClick }: SpotlightHeroProps): ReactElement {
  return (
    <div className="spotlight-hero">
      <div className="spotlight-hero-content">
        <div className="spotlight-hero-window-body">
          <h1 className="spotlight-hero-title">TRY</h1>
          <p className="spotlight-hero-subtitle">Try something new</p>
          <Spotlight onResultClick={onResultClick} />
        </div>
      </div>
    </div>
  );
}