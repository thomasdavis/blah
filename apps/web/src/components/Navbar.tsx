export function Navbar(): React.ReactElement {
  return (
    <nav className="bg-white border-b-4 border-black mb-12 sticky top-0 z-50 py-2">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-300 to-secondary-300 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
            <span className="text-4xl font-black text-black p-2 rotate-[-1deg] inline-block transform group-hover:rotate-0 transition-transform relative">BLAH</span>
          </div>
          
          <div className="hidden sm:block rotate-1 hover:rotate-0 transition-transform">
            <span className="text-lg font-bold bg-brand-300 text-black px-3 py-1 border-3 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0)] inline-block transform transition-transform hover:-translate-y-1">
              Barely Logical Agent Host
            </span>
          </div>
        </div>
        
        <div className="flex gap-4">
          <a 
            href="/docs" 
            className="text-black font-bold bg-brand-200 px-4 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all hover:-translate-y-1 hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-0 bg-brand-100 transition-all duration-300 ease-out group-hover:w-full"></span>
            <span className="relative">Docs</span>
          </a>
          
          <a 
            href="https://github.com/thomasdavis/blah" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black font-bold bg-secondary-300 px-4 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all hover:-translate-y-1 hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-0 bg-secondary-200 transition-all duration-300 ease-out group-hover:w-full"></span>
            <span className="relative">GitHub</span>
          </a>
          
          <a 
            href="https://www.npmjs.com/package/@blahai/cli" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black font-bold bg-success-300 px-4 py-2 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition-all hover:-translate-y-1 hover:shadow-[4px_6px_0px_0px_rgba(0,0,0)] relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-0 bg-success-200 transition-all duration-300 ease-out group-hover:w-full"></span>
            <span className="relative">npm</span>
          </a>
        </div>
      </div>
    </nav>
  );
}