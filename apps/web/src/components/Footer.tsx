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
        
       
      </div>
    </footer>
  );
}