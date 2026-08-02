import React, { useState } from 'react'

const FashionHeader = () => {
  const [cartCount] = useState(0)

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-serif text-lg">F</span>
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-gray-900">Fusion</h1>
            <p className="text-xs text-gray-500 -mt-1">Style</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-gray-700">
          <a href="#" className="hover:text-pink-700 transition-colors">Home</a>
          <a href="#" className="hover:text-pink-700 transition-colors">Latest Trends</a>
          <a href="#" className="hover:text-pink-700 transition-colors">Designers Collection</a>
          <a href="#" className="hover:text-pink-700 transition-colors">Women</a>
          <a href="#" className="hover:text-pink-700 transition-colors">Men</a>
          <a href="#" className="hover:text-pink-700 transition-colors">Special Offers</a>
        </nav>

        {/* Search & Icons */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..." 
              className="border rounded-full px-4 py-1.5 text-sm w-40 focus:outline-none focus:border-pink-700"
            />
            <svg className="w-4 h-4 absolute right-3 top-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="relative">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-700 text-white text-xs rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default FashionHeader
