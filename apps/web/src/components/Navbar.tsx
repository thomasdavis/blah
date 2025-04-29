export function Navbar(): React.ReactElement {
  return (
    <nav className="bg-white border-b border-gray-200 mb-12 sticky top-0 z-50 py-2">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <span className="font-heading text-4xl font-bold text-black">BLAH</span>
          </div>
          
          <div className="hidden sm:block">
            <span className="font-heading text-lg font-medium text-gray-700">
              Barely Logical Agent Host
            </span>
          </div>
        </div>
        
        <div className="flex gap-4">
          <a 
            href="https://deepwiki.com/thomasdavis/blah/1-overview" 
            className="clean-btn hover-underline"
          >
            Docs
          </a>
          
          <a 
            href="https://github.com/thomasdavis/blah" 
            target="_blank" 
            rel="noopener noreferrer"
            className="clean-btn hover-underline"
          >
            GitHub
          </a>
          
          <a 
            href="https://www.npmjs.com/package/@blahai/cli" 
            target="_blank" 
            rel="noopener noreferrer"
            className="clean-btn hover-underline"
          >
            npm
          </a>
        </div>
      </div>
    </nav>
  );
}