export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">BLAH</h3>
            <p className="text-gray-400">Barely Logical Agent Host</p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} BLAH Contributors
            </p>
            <p className="text-gray-400">
              Released under the MIT License
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
