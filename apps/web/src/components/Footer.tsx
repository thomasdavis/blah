export function Footer(): React.ReactElement {
  return (
    <footer className="bg-white py-16 border-t border-gray-200 mt-20 relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="mb-10 md:mb-0">
            <div className="inline-block">
              <h3 className="font-heading text-3xl font-bold text-black">BLAH</h3>
              <p className="font-heading text-lg text-gray-700">Barely Logical Agent Host</p>
            </div>
          </div>
          
          <div className="text-center md:text-right">
            <div className="inline-block">
              <p className="text-lg text-gray-700">
                &copy; {new Date().getFullYear()} BLAH Contributors
              </p>
              <p className="text-gray-700">
                Released under the MIT License
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 w-full max-w-4xl">
            <a href="https://github.com/thomasdavis/blah" className="group block p-4 clean-border hover:bg-gray-50 transition-colors">
              <p className="font-heading font-bold text-lg hover-underline inline-block">GitHub</p>
            </a>
            <a href="https://www.npmjs.com/package/@blahai/cli" className="group block p-4 clean-border hover:bg-gray-50 transition-colors">
              <p className="font-heading font-bold text-lg hover-underline inline-block">npm</p>
            </a>
            <a href="/docs" className="group block p-4 clean-border hover:bg-gray-50 transition-colors">
              <p className="font-heading font-bold text-lg hover-underline inline-block">Documentation</p>
            </a>
            <a href="/playground" className="group block p-4 clean-border hover:bg-gray-50 transition-colors">
              <p className="font-heading font-bold text-lg hover-underline inline-block">Playground</p>
            </a>
          </div>
          
          <div className="border-t border-gray-200 pt-8 text-center">
            <p className="font-heading text-2xl font-bold text-black mb-2">Join the cross-protocol revolution!</p>
          </div>
        </div>
      </div>
    </footer>
  );
}