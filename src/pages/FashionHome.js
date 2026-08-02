import React from 'react'

const FashionHome = () => {
  return (
    <div className="bg-white">
      {/* Top Bar */}
      <div className="bg-gray-100 text-xs py-2 text-center text-gray-600">
        Free Shipping on Orders Over PKR 5,000 | Cash on Delivery Available
      </div>

      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800">
        <div className="absolute inset-0 flex">
          <div className="w-1/2 flex items-center justify-center p-12">
            <div className="text-white text-center">
              <p className="text-sm tracking-[0.3em] uppercase mb-4 text-gray-300">Collection By</p>
              <h2 className="font-serif text-5xl italic mb-2">SANA SAFINAZ</h2>
              <button className="mt-8 px-8 py-3 border border-white text-white text-sm tracking-widest uppercase hover:bg-white hover:text-gray-900 transition-all">
                View More
              </button>
            </div>
          </div>
          <div className="w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1583391733955-5520bfa790e9?w=800&auto=format&fit=crop&q=80" 
              alt="Sana Safinaz Collection" 
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      </section>

      {/* Top Designer Collections */}
      <section className="bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-white text-center text-sm tracking-[0.2em] uppercase mb-6">Top Designer Collections</h3>
          <div className="grid grid-cols-4 gap-4">
            {['ASIM JOFA', 'SANA SAFINAZ', 'GUL AHMED', 'MARIA B'].map((designer, idx) => (
              <div key={idx} className="relative group cursor-pointer">
                <img 
                  src={`https://images.unsplash.com/photo-${['1595777457583-95e059d581b8', '1610030469983-98e360c1c7b2', '1594633313593-bab3825d0caf', '1595777457583-95e059d581b8'][idx]}?w=300&auto=format&fit=crop&q=80`}
                  alt={designer}
                  className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-center py-2 text-xs">
                  {designer}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-pink-700 font-serif text-2xl italic">Special Offers</h3>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-pink-700">Clothing</a>
            <span>|</span>
            <a href="#" className="hover:text-pink-700">Shoes</a>
            <span>|</span>
            <a href="#" className="hover:text-pink-700">Accessories</a>
            <span>|</span>
            <a href="#" className="hover:text-pink-700">On Sale</a>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          <div className="relative group">
            <div className="relative overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&auto=format&fit=crop&q=80"
                alt="Product"
                className="w-full h-80 object-cover"
              />
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 text-center">
                <p className="text-xs">CASUAL STYLE</p>
                <p className="text-2xl font-bold">50% OFF</p>
              </div>
            </div>
            <div className="mt-3 text-center">
              <h4 className="text-sm font-semibold text-gray-800">Embroidered Kurti</h4>
              <p className="text-xs text-gray-500 line-through">PKR 4,500</p>
              <p className="text-sm font-bold text-pink-700">PKR 2,250</p>
            </div>
          </div>

          {['Nishat Orange', 'Nishat Blue', 'Nishat Yellow'].map((name, idx) => (
            <div key={idx} className="group">
              <div className="overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-${['1610030469983-98e360c1c7b2', '1583391733955-5520bfa790e9', '1594633313593-bab3825d0caf'][idx]}?w=400&auto=format&fit=crop&q=80`}
                  alt={name}
                  className="w-full h-80 object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-sm font-semibold text-gray-800">{name}</h4>
                <p className="text-xs text-gray-500">PKR 3,200</p>
                <div className="flex justify-center gap-2 mt-2">
                  <button className="p-1 hover:text-pink-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                  <button className="p-1 hover:text-pink-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-pink-700 font-serif text-2xl italic">New Arrivals</h3>
          <div className="flex gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-pink-700">Clothing</a>
            <span>|</span>
            <a href="#" className="hover:text-pink-700">Shoes</a>
            <span>|</span>
            <a href="#" className="hover:text-pink-700">Accessories</a>
            <span>|</span>
            <a href="#" className="hover:text-pink-700">Beauty</a>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div className="relative group">
            <img 
              src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&auto=format&fit=crop&q=80"
              alt="New Arrival"
              className="w-full h-96 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-white text-sm">Party Suits</p>
              <p className="text-white text-xs">Starting from PKR 12,000</p>
            </div>
          </div>

          <div className="relative group">
            <img 
              src="https://images.unsplash.com/photo-1610030469983-98e360c1c7b2?w=500&auto=format&fit=crop&q=80"
              alt="New Arrival"
              className="w-full h-96 object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
              <p className="text-white text-sm">Summer Style</p>
              <p className="text-white text-xs">Starting from PKR 8,500</p>
            </div>
          </div>

          <div className="relative bg-gray-100 p-8 flex flex-col justify-center">
            <h4 className="font-serif text-2xl text-gray-800 mb-2">Luxury Pret</h4>
            <p className="text-sm text-gray-600 mb-2">Available on Exclusive Discounts</p>
            <p className="text-pink-700 font-bold mb-4">Starting from PKR 15,000</p>
            <img 
              src="https://images.unsplash.com/photo-1583391733955-5520bfa790e9?w=400&auto=format&fit=crop&q=80"
              alt="Luxury Pret"
              className="w-full h-64 object-cover mt-4"
            />
          </div>
        </div>
      </section>

      {/* Shop By Designer */}
      <section className="py-12 max-w-7xl mx-auto px-4">
        <h3 className="text-pink-700 font-serif text-2xl italic mb-8 text-center">Shop By Designer</h3>
        
        <div className="relative">
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center z-10 hover:bg-gray-50">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center z-10 hover:bg-gray-50">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="grid grid-cols-2 gap-8">
            {[
              { name: 'ASIM JOFA', desc: 'Premium embroidered collection featuring intricate designs and luxurious fabrics for the modern woman.', img: '1595777457583-95e059d581b8' },
              { name: 'SANA SAFINAZ', desc: 'Elegant and sophisticated designs that blend traditional craftsmanship with contemporary aesthetics.', img: '1610030469983-98e360c1c7b2' },
              { name: 'HSY', desc: 'Bold and dramatic creations that make a statement at any special occasion.', img: '1594633313593-bab3825d0caf' },
              { name: 'NOMI ANSARI', desc: 'Vibrant colors and innovative designs that celebrate Pakistani heritage.', img: '1583391733955-5520bfa790e9' }
            ].map((designer, idx) => (
              <div key={idx} className="flex gap-6 bg-gray-50 p-6">
                <img 
                  src={`https://images.unsplash.com/photo-${designer.img}?w=300&auto=format&fit=crop&q=80`}
                  alt={designer.name}
                  className="w-48 h-64 object-cover"
                />
                <div className="flex-1 py-4">
                  <h4 className="font-serif text-xl mb-1">{designer.name}</h4>
                  <p className="text-xs text-gray-500 mb-4">Luxury Pret</p>
                  <p className="text-xs text-gray-600 mb-4 line-clamp-3">{designer.desc}</p>
                  <button className="px-6 py-2 bg-gray-800 text-white text-xs uppercase tracking-wider hover:bg-gray-700 transition-colors">
                    Shop Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fashion Shows Banner */}
      <section className="relative h-80 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&auto=format&fit=crop&q=80"
          alt="Fashion Show"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-end pr-24">
          <div className="text-white text-right">
            <h3 className="font-serif text-3xl mb-2">Clothing from the top<br />FASHION SHOWS</h3>
            <p className="text-sm mb-4 text-gray-200">Available on Exclusive Discounts</p>
            <button className="px-8 py-3 border border-white text-white text-sm uppercase tracking-wider hover:bg-white hover:text-gray-900 transition-all">
              View More
            </button>
          </div>
        </div>
      </section>

      {/* Brand Logos */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-5 gap-8 items-center justify-items-center">
            {['ASIM JOFA', 'nomi ansari', 'HSY', 'JUNAID JAMSHED', 'HSY'].map((brand, idx) => (
              <div key={idx} className="text-center">
                {idx === 2 ? (
                  <div className="w-8 h-8 border-2 border-gray-800 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-xs font-bold">HSY</span>
                  </div>
                ) : (
                  <p className="font-serif text-sm font-bold text-gray-800">{brand}</p>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-8 items-center justify-items-center mt-6">
            {['GENERATION', 'THREADZ', 'MARIA.B', 'SANA SAFINAZ'].map((brand, idx) => (
              <div key={idx} className="text-center">
                <p className={`${idx === 0 ? 'text-xs tracking-widest' : 'font-serif text-sm'} font-bold text-gray-800`}>{brand}</p>
              </div>
            ))}
            <div className="text-center flex items-center gap-2">
              <p className="text-xs font-bold text-gray-800">ego</p>
              <p className="font-serif text-sm font-bold text-gray-800">BONANZA</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter & Social */}
      <section className="py-12 border-t">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-pink-700 font-semibold text-sm">STAY CONNECTED</span>
            <div className="flex gap-3">
              {['M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z',
                'M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z',
                'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
              ].map((path, idx) => (
                <a key={idx} href="#" className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-pink-700 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-pink-700 font-semibold text-sm">GET THE LATEST NEWS!</p>
            </div>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="border border-gray-300 px-4 py-2 text-sm w-48 focus:outline-none focus:border-pink-700"
              />
              <button className="bg-gray-400 text-white px-4 py-2 text-sm hover:bg-gray-500 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default FashionHome
