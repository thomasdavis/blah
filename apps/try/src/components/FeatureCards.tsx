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
        <h2 className="feature-section-title">Why use BLAH?</h2>
        <div className="feature-cards-grid">
          <FeatureCard 
            icon="🔄"
            title="Universal Protocol Adapter"
            description="Write tools once, use them across any agent framework. Supports MCP, SLOP, and more."
          />
          <FeatureCard 
            icon="🌐"
            title="Remote MCP Servers"
            description="Access AI tools and capabilities from any device through secure remote connections."
          />
          <FeatureCard 
            icon="🧩"
            title="Composable Workflows"
            description="Chain tools together into powerful workflows with a simple JSON manifest."
          />
          <FeatureCard 
            icon="🛠️"
            title="Developer-Friendly"
            description="Simple CLI commands to start servers, with support for TypeScript, JavaScript, and more."
          />
        </div>
      </div>
    </div>
  );
}