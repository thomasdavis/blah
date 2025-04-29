import React from 'react';

export function DocContent(): React.ReactElement {
  return (
    <div>
      <p>
        BLAH (Barely Logical Agent Host) is a protocol-agnostic infrastructure layer that enables interoperability between AI tools using different communication protocols. It provides a unified system for defining, managing, and executing tools, allowing developers to write a tool once and use it anywhere through protocol bridging, standardized configuration, and visual workflow composition.
      </p>
      <div className="flex justify-center mt-6">
        <a 
          href="https://deepwiki.com/thomasdavis/blah/1-overview" 
          className="clean-btn hover-underline"
        >
          Read The Docs
        </a>
      </div>
    </div>
  );
}