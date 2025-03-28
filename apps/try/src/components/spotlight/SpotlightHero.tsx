import { Spotlight } from './Spotlight';

export function SpotlightHero() {
  return (
    <div className="spotlight-hero">
      <div className="spotlight-hero-content">
        <h1 className="spotlight-hero-title">BLAH</h1>
        <p className="spotlight-hero-subtitle">Barely Logical Agent Host</p>
        <p className="spotlight-hero-description">
          The universal protocol adapter for AI agent tools
        </p>
        <Spotlight />
      </div>
    </div>
  );
}