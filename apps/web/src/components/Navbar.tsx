export function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary-600">BLAH</span>
          <span className="text-gray-500 hidden sm:inline">Barely Logical Agent Host</span>
        </div>
        <div className="flex space-x-4">
          <a 
            href="https://github.com/thomasdavis/blah" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary-600 transition-colors"
          >
            GitHub
          </a>
          <a 
            href="https://www.npmjs.com/package/@blahai/cli" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-primary-600 transition-colors"
          >
            npm
          </a>
        </div>
      </div>
    </nav>
  );
}
