import React from 'react'

const FashionFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-4 gap-8">
        {/* Logo Column */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-gray-800 font-serif text-lg font-bold">F</span>
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold">Fusion</h2>
              <p className="text-xs text-gray-400 -mt-1">Style</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Your premier destination for luxury Pakistani fashion. We bring you the finest collections from top designers.
          </p>
        </div>

        {/* About Us */}
        <div>
          <h4 className="font-semibold text-sm mb-4 text-pink-400">KNOW ABOUT US</h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* About */}
        <div>
          <h4 className="font-semibold text-sm mb-4 text-pink-400">ABOUT</h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li><a href="#" className="hover:text-white">The Brand</a></li>
            <li><a href="#" className="hover:text-white">Collections</a></li>
            <li><a href="#" className="hover:text-white">Lookbook</a></li>
            <li><a href="#" className="hover:text-white">Journal</a></li>
          </ul>
        </div>

        {/* Information */}
        <div>
          <h4 className="font-semibold text-sm mb-4 text-pink-400">INFORMATION</h4>
          <ul className="space-y-2 text-xs text-gray-300">
            <li><a href="#" className="hover:text-white">Shipping Info</a></li>
            <li><a href="#" className="hover:text-white">Returns</a></li>
            <li><a href="#" className="hover:text-white">Size Guide</a></li>
            <li><a href="#" className="hover:text-white">FAQ</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-8 pt-8 border-t border-gray-700 flex justify-between items-center text-xs text-gray-400">
        <p>&copy; 2024 Fusion Style. All Rights Reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white">Terms & Conditions</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
        </div>
      </div>
    </footer>
  )
}

export default FashionFooter
