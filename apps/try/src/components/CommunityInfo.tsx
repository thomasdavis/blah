"use client";
import { FC } from 'react';

export const CommunityInfo: FC = () => {
  return (
    <div className="community-info-container">
      <div className="community-info-window">
        <div className="community-info-title">
          Join the Community
        </div>
        <div className="community-info-content">
          <h2>Welcome to BLAH!</h2>
          
          <p>BLAH (Barely Logical Agent Host) is an open-source universal protocol adapter for AI agent tools.</p>
          
          <div className="community-links">
            <div className="community-link-item">
              <span className="emoji">💬</span>
              <div>
                <h3>Discord</h3>
                <p>Join our community Discord to chat with other developers</p>
                <a href="https://discord.gg/blah" target="_blank" rel="noopener noreferrer" className="btn">Join Discord</a>
              </div>
            </div>
            
            <div className="community-link-item">
              <span className="emoji">📝</span>
              <div>
                <h3>GitHub</h3>
                <p>Contribute to the project, report issues, or create pull requests</p>
                <a href="https://github.com/blahai/blah" target="_blank" rel="noopener noreferrer" className="btn">View on GitHub</a>
              </div>
            </div>
            
            <div className="community-link-item">
              <span className="emoji">📚</span>
              <div>
                <h3>Documentation</h3>
                <p>Read our comprehensive guides and API documentation</p>
                <a href="/docs" className="btn">Read the Docs</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}