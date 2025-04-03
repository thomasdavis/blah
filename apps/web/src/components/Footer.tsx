export function Footer(): React.ReactElement {
  return (
    <footer className="bg-white py-16 border-t-4 border-black mt-20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute left-10 top-0 w-20 h-20 bg-brand-100 border-3 border-black rotate-12 z-0 hidden md:block"></div>
      <div className="absolute right-10 bottom-0 w-16 h-16 bg-success-100 border-3 border-black -rotate-12 z-0 hidden md:block"></div>
      <div className="absolute left-1/4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-secondary-100 border-2 border-black rotate-45 z-0 hidden md:block"></div>
      <div className="absolute right-1/4 top-1/3 w-12 h-12 bg-danger-100 border-2 border-black -rotate-6 z-0 hidden md:block"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="mb-10 md:mb-0 rotate-[-1deg] transform transition-transform hover:rotate-0 hover:-translate-y-1">
            <div className="bg-brand-200 inline-block px-6 py-3 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] relative">
              <span className="absolute -top-3 -right-3 w-6 h-6 bg-brand-400 border-2 border-black rotate-12"></span>
              <h3 className="text-3xl font-black text-black">BLAH</h3>
              <p className="font-bold text-lg">Barely Logical Agent Host</p>
            </div>
          </div>
          
          <div className="text-center md:text-right rotate-[1deg] transform transition-transform hover:rotate-0 hover:-translate-y-1">
            <div className="bg-success-200 inline-block px-6 py-3 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] relative">
              <span className="absolute -top-3 -left-3 w-6 h-6 bg-success-400 border-2 border-black -rotate-12"></span>
              <p className="font-bold text-black text-lg">
                &copy; {new Date().getFullYear()} BLAH Contributors
              </p>
              <p className="font-bold text-black">
                Released under the MIT License
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 w-full max-w-4xl">
            <a href="https://github.com/thomasdavis/blah" className="group block p-4 border-3 border-black bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0)] transform transition-all hover:-translate-y-1 hover:shadow-[5px_8px_0px_0px_rgba(0,0,0)]">
              <p className="font-black text-lg group-hover:text-brand-600">GitHub</p>
            </a>
            <a href="https://www.npmjs.com/package/@blahai/cli" className="group block p-4 border-3 border-black bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0)] transform transition-all hover:-translate-y-1 hover:shadow-[5px_8px_0px_0px_rgba(0,0,0)]">
              <p className="font-black text-lg group-hover:text-brand-600">npm</p>
            </a>
            <a href="/docs" className="group block p-4 border-3 border-black bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0)] transform transition-all hover:-translate-y-1 hover:shadow-[5px_8px_0px_0px_rgba(0,0,0)]">
              <p className="font-black text-lg group-hover:text-brand-600">Documentation</p>
            </a>
            <a href="/playground" className="group block p-4 border-3 border-black bg-white shadow-[5px_5px_0px_0px_rgba(0,0,0)] transform transition-all hover:-translate-y-1 hover:shadow-[5px_8px_0px_0px_rgba(0,0,0)]">
              <p className="font-black text-lg group-hover:text-brand-600">Playground</p>
            </a>
          </div>
          
          <div className="bg-secondary-300 px-8 py-4 border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0)] rotate-[-0.5deg] transform transition-transform hover:rotate-0 hover:-translate-y-1 relative">
            <span className="absolute -top-3 -left-3 w-6 h-6 bg-secondary-400 border-2 border-black rotate-12"></span>
            <span className="absolute -bottom-3 -right-3 w-6 h-6 bg-secondary-400 border-2 border-black -rotate-12"></span>
            <p className="text-2xl font-black text-black">Join the cross-protocol revolution!</p>
          </div>
        </div>
      </div>
    </footer>
  );
}