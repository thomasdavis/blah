"use client";

import React from 'react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}

export function FeatureCards() {
  return (
    <div className="feature-cards-section">
      <div className="container">
        <h2 className="feature-section-title">WHY USE BLAH?</h2>
        <div className="feature-cards-grid">
          <FeatureCard 
            icon="🔄"
            title="UNIVERSAL ADAPTER"
            description="Write tools once, use them across any agent framework. Supports MCP, SLOP, and more without refactoring your codebase."
          />
          <FeatureCard 
            icon="🌐"
            title="REMOTE SERVERS"
            description="Access AI tools and capabilities from any device through secure remote connections - no local setup required."
          />
          <FeatureCard 
            icon="🧩"
            title="COMPOSABLE FLOWS"
            description="Chain tools together into powerful workflows using a simple JSON manifest. Mix and match capabilities!"
          />
          <FeatureCard 
            icon="🛠️"
            title="DEVELOPER-FRIENDLY"
            description="Simple CLI commands to start servers, with full TypeScript support and hot-reload for rapid development."
          />
        </div>
      </div>
    </div>
  );
}
