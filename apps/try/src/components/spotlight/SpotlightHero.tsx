"use client";

import { Spotlight } from './Spotlight';

export function SpotlightHero() {
  return (
    <div className="spotlight-hero">
      <div className="spotlight-hero-content">
        <h1 className="spotlight-hero-title">TRY</h1>
        <p className="spotlight-hero-subtitle">Try something new</p>
        <Spotlight />
      </div>
    </div>
  );
}