import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const vehicles = [
  { name: '2023 Tesla Model 3', sub: 'Long Range AWD', miles: '12k miles', price: '$42,500', status: 'Available', statusClass: 'bg-green-500', img: '/image/tesla-model-3.jpg' },
  { name: '2022 BMW X5', sub: 'sDrive40i', miles: '24k miles', price: '$58,900', status: 'Available', statusClass: 'bg-green-500', img: '/image/bmw-x5.jpg' },
  { name: '2024 Ford F-150', sub: 'Lariat Edition', miles: '1.2k miles', price: '$67,200', status: 'Reserved', statusClass: 'bg-yellow-500', img: '/image/ford-f150.jpg' },
  { name: '2021 Porsche 911', sub: 'Carrera S', miles: '8k miles', price: '$112,000', status: 'Available', statusClass: 'bg-green-500', img: '/image/porsche-911.jpg' },
];

const Home = () => {
  const navigate = useNavigate();
  const headerRef = useRef(null);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const onScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('py-2');
        header.classList.remove('py-4');
      } else {
        header.classList.add('py-4');
        header.classList.remove('py-2');
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="bg-background text-on-surface min-h-screen">
      {/* TopNavBar */}
      <header ref={headerRef} className="sticky top-0 z-50 flex justify-between items-center px-margin-desktop w-full max-w-max-width mx-auto bg-surface/80 backdrop-blur-md shadow-sm transition-all duration-200">
        <div className="flex items-center gap-xl py-4">
          <span className="font-display-lg text-display-lg font-black text-primary">AutoMarket</span>
          <nav className="hidden md:flex items-center gap-lg">
            <a className="font-body-md text-body-md text-primary border-b-2 border-primary pb-1 font-bold hover:text-primary transition-colors" href="#">Buy</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Sell</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Finance</a>
            <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Reviews</a>
          </nav>
        </div>
        <div className="flex items-center gap-lg py-4">
          <div className="relative group hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input className="pl-10 pr-4 py-2 rounded-full bg-surface-container border-none focus:ring-2 focus:ring-primary/20 text-body-md w-64 transition-all" placeholder="Search inventory..." type="text" />
          </div>
          <div className="flex items-center gap-md">
            <button className="p-2 rounded-full hover:bg-surface-container transition-colors active:opacity-80">
              <span className="material-symbols-outlined" data-icon="person">person</span>
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2 bg-primary text-on-primary rounded-full font-label-md text-label-md hover:bg-primary/90 transition-all active:scale-95"
            >
              Login
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img alt="Luxury SUV Hero" className="w-full h-full object-cover" src="/image/hero.jpg" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container/40 to-transparent"></div>
          </div>
          <div className="relative z-10 w-full max-w-max-width px-margin-desktop flex flex-col lg:flex-row items-center justify-between gap-xl">
            <div className="max-w-2xl text-on-primary">
              <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-4 text-white drop-shadow-lg">Find Your Next Drive</h1>
              <p className="font-body-lg text-body-lg text-white/90 mb-8 max-w-lg drop-shadow-md">Browse thousands of certified pre-owned and new vehicles from trusted dealers across the nation.</p>
            </div>
            {/* Advanced Search Card */}
            <div className="glass-panel-light w-full max-w-md p-lg rounded-xl shadow-2xl border border-white/20">
              <h2 className="font-headline-sm text-headline-sm mb-6 text-primary">Advanced Search</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-md">
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Make</label>
                    <select className="w-full bg-surface-container-low border-outline-variant rounded-lg p-3 text-body-md focus:ring-secondary focus:border-secondary">
                      <option>Any Make</option>
                      <option>Tesla</option>
                      <option>BMW</option>
                      <option>Mercedes-Benz</option>
                      <option>Audi</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Model</label>
                    <select className="w-full bg-surface-container-low border-outline-variant rounded-lg p-3 text-body-md focus:ring-secondary focus:border-secondary">
                      <option>Any Model</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-md">
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Max Price</label>
                    <select className="w-full bg-surface-container-low border-outline-variant rounded-lg p-3 text-body-md focus:ring-secondary focus:border-secondary">
                      <option>No Max</option>
                      <option>$30,000</option>
                      <option>$50,000</option>
                      <option>$75,000</option>
                      <option>$100,000+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Zip Code</label>
                    <input className="w-full bg-surface-container-low border-outline-variant rounded-lg p-3 text-body-md focus:ring-secondary focus:border-secondary" placeholder="e.g. 90210" type="text" />
                  </div>
                </div>
                <button className="w-full py-4 bg-primary text-on-primary rounded-lg font-bold text-body-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2 mt-2" type="submit">
                  <span className="material-symbols-outlined">search</span>
                  Show Vehicles
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Browse by Body Type */}
        <section className="py-xl max-w-max-width mx-auto px-margin-desktop">
          <div className="flex items-end justify-between mb-lg">
            <div>
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2 block">Categories</span>
              <h2 className="font-headline-md text-headline-md text-primary">Browse by Body Type</h2>
            </div>
            <a className="text-primary font-label-md text-label-md hover:underline hidden sm:block" href="#">View All Types</a>
          </div>
          <div className="flex gap-gutter overflow-x-auto pb-4 hide-scrollbar">
            <button className="flex-shrink-0 group flex flex-col items-center gap-md p-lg rounded-xl bg-surface-container-low hover:bg-surface transition-all hover:-translate-y-1 w-32 md:w-40 border border-transparent hover:border-outline-variant">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-4xl text-secondary" data-icon="airport_shuttle">airport_shuttle</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface">SUVs</span>
            </button>
            <button className="flex-shrink-0 group flex flex-col items-center gap-md p-lg rounded-xl bg-surface-container-low hover:bg-surface transition-all hover:-translate-y-1 w-32 md:w-40 border border-transparent hover:border-outline-variant">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-4xl text-secondary" data-icon="directions_car">directions_car</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface">Sedans</span>
            </button>
            <button className="flex-shrink-0 group flex flex-col items-center gap-md p-lg rounded-xl bg-surface-container-low hover:bg-surface transition-all hover:-translate-y-1 w-32 md:w-40 border border-transparent hover:border-outline-variant">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-4xl text-secondary" data-icon="local_shipping">local_shipping</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface">Trucks</span>
            </button>
            <button className="flex-shrink-0 group flex flex-col items-center gap-md p-lg rounded-xl bg-surface-container-low hover:bg-surface transition-all hover:-translate-y-1 w-32 md:w-40 border border-transparent hover:border-outline-variant">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-4xl text-secondary" data-icon="sports_motorsports">sports_motorsports</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface">Coupes</span>
            </button>
            <button className="flex-shrink-0 group flex flex-col items-center gap-md p-lg rounded-xl bg-surface-container-low hover:bg-surface transition-all hover:-translate-y-1 w-32 md:w-40 border border-transparent hover:border-outline-variant">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                <span className="material-symbols-outlined text-4xl text-secondary" data-icon="electric_car">electric_car</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface">EVs</span>
            </button>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-xl bg-surface">
          <div className="max-w-max-width mx-auto px-margin-desktop">
            <div className="text-center max-w-3xl mx-auto mb-xl">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2 block">Process</span>
              <h2 className="font-headline-md text-headline-md md:text-display-lg text-primary mb-4">How it Works</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">We've streamlined the luxury automotive journey to be as premium as the vehicles we sell.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-xl relative">
              <div className="relative flex flex-col items-center text-center p-md group">
                <div className="w-20 h-20 rounded-2xl bg-primary-fixed-dim flex items-center justify-center mb-lg shadow-sm group-hover:bg-primary-container group-hover:text-on-primary-fixed transition-all duration-300">
                  <span className="material-symbols-outlined text-4xl">search_check</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-sm">Search &amp; Selection</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Browse our premium inventory with detailed vehicle history reports.</p>
                <div className="hidden md:block absolute top-10 -right-1/4 w-1/2 h-[2px] bg-outline-variant/30"></div>
              </div>
              <div className="relative flex flex-col items-center text-center p-md group">
                <div className="w-20 h-20 rounded-2xl bg-primary-fixed-dim flex items-center justify-center mb-lg shadow-sm group-hover:bg-primary-container group-hover:text-on-primary-fixed transition-all duration-300">
                  <span className="material-symbols-outlined text-4xl">account_balance_wallet</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-sm">Personalized Finance</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Get instant financing offers tailored to your budget and credit profile.</p>
                <div className="hidden md:block absolute top-10 -right-1/4 w-1/2 h-[2px] bg-outline-variant/30"></div>
              </div>
              <div className="relative flex flex-col items-center text-center p-md group">
                <div className="w-20 h-20 rounded-2xl bg-primary-fixed-dim flex items-center justify-center mb-lg shadow-sm group-hover:bg-primary-container group-hover:text-on-primary-fixed transition-all duration-300">
                  <span className="material-symbols-outlined text-4xl">distance</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-primary mb-sm">Delivery to Your Door</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Schedule a convenient delivery time and we'll bring your new ride right to you.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sell Your Car Section */}
        <section className="py-xl bg-surface-container-low">
          <div className="max-w-max-width mx-auto px-margin-desktop">
            <div className="text-center max-w-2xl mx-auto mb-xl">
              <h2 className="font-display-lg text-headline-md md:text-display-lg text-primary mb-4">Sell Your Car in Minutes</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">Get an instant offer and reach thousands of buyers across the country.</p>
              <button className="px-10 py-4 bg-primary text-on-primary rounded-full font-bold text-body-md hover:bg-primary/90 transition-all active:scale-95 shadow-lg">Get My Offer</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mt-12">
              <div className="flex flex-col items-center text-center p-md">
                <span className="material-symbols-outlined text-4xl text-secondary mb-3" data-icon="request_quote">request_quote</span>
                <h4 className="font-headline-sm text-label-md font-bold text-primary mb-2 uppercase tracking-wide">Instant Valuation</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">Real offers based on live market data.</p>
              </div>
              <div className="flex flex-col items-center text-center p-md">
                <span className="material-symbols-outlined text-4xl text-secondary mb-3" data-icon="admin_panel_settings">admin_panel_settings</span>
                <h4 className="font-headline-sm text-label-md font-bold text-primary mb-2 uppercase tracking-wide">Fast &amp; Secure</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">We handle the paperwork and ensure secure payment.</p>
              </div>
              <div className="flex flex-col items-center text-center p-md">
                <span className="material-symbols-outlined text-4xl text-secondary mb-3" data-icon="groups">groups</span>
                <h4 className="font-headline-sm text-label-md font-bold text-primary mb-2 uppercase tracking-wide">Maximum Exposure</h4>
                <p className="font-body-md text-body-md text-on-surface-variant">List your vehicle to our massive network of verified buyers.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-xl bg-surface-container-lowest">
          <div className="max-w-max-width mx-auto px-margin-desktop">
            <div className="flex items-center justify-between mb-lg">
              <h2 className="font-headline-md text-headline-md text-primary">Featured Listings</h2>
              <div className="flex gap-sm">
                <button className="p-2 rounded-full border border-outline-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="p-2 rounded-full border border-outline-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
              {vehicles.map((v) => (
                <div key={v.name} className="group bg-white rounded-xl overflow-hidden vehicle-card-shadow border border-surface-container hover:border-primary-fixed-dim transition-all group-hover:translate-y-[-4px] group-hover:shadow-xl">
                  <div className="relative h-48 overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={`${v.name} front 3/4 view`} src={v.img} />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.status === 'Reserved' ? '#f59e0b' : '#22c55e' }}></span>
                      <span className="font-label-md text-label-md text-on-surface">{v.status}</span>
                    </div>
                    <button className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors">
                      <span className="material-symbols-outlined text-sm">favorite</span>
                    </button>
                  </div>
                  <div className="p-md">
                    <h3 className="font-headline-sm text-headline-sm text-primary mb-1">{v.name}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-label-md text-label-md text-secondary">{v.miles}</span>
                      <span className="text-outline-variant text-xs">•</span>
                      <span className="font-label-md text-label-md text-secondary">{v.sub}</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-headline-sm text-headline-sm text-on-tertiary-container">{v.price}</span>
                      <button className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Customer Testimonials Section */}
        <section className="py-xl bg-surface-container">
          <div className="max-w-max-width mx-auto px-margin-desktop">
            <div className="text-center max-w-3xl mx-auto mb-xl">
              <span className="font-label-md text-label-md text-secondary uppercase tracking-widest mb-2 block">Testimonials</span>
              <h2 className="font-headline-md text-headline-md md:text-display-lg text-primary mb-4">What Our Clients Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
              <div className="bg-surface-container-lowest p-lg rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="flex gap-xs mb-md">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="font-body-md text-body-md italic text-on-surface mb-lg">"The level of professionalism and the quality of the inventory is unmatched. I found my dream Porsche and the delivery was seamless."</p>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary">JD</div>
                  <div>
                    <p className="font-label-md text-label-md font-bold text-primary">Julian D'Amico</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Verified Buyer</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="flex gap-xs mb-md">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="font-body-md text-body-md italic text-on-surface mb-lg">"Selling my vehicle through AutoMarket was remarkably efficient. They handled every detail from valuation to the final paperwork."</p>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary">SR</div>
                  <div>
                    <p className="font-label-md text-label-md font-bold text-primary">Sarah Richardson</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Luxury Fleet Manager</p>
                  </div>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-lg rounded-2xl shadow-sm border border-outline-variant/20 flex flex-col justify-between">
                <div>
                  <div className="flex gap-xs mb-md">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-tertiary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="font-body-md text-body-md italic text-on-surface mb-lg">"The financing options provided were competitive and tailored to my needs. A truly bespoke experience from start to finish."</p>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary">MK</div>
                  <div>
                    <p className="font-label-md text-label-md font-bold text-primary">Marcus Koenig</p>
                    <p className="font-label-sm text-label-sm text-on-surface-variant">Entrepreneur</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="py-xl max-w-max-width mx-auto px-margin-desktop">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            <div className="flex flex-col items-center text-center p-lg rounded-2xl bg-surface-container-low border border-outline-variant/30">
              <div className="w-16 h-16 rounded-full bg-primary-fixed-dim flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-primary text-3xl" data-icon="verified">verified</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-sm">Verified Inspection</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Every vehicle undergoes a rigorous 150-point inspection by certified technicians.</p>
            </div>
            <div className="flex flex-col items-center text-center p-lg rounded-2xl bg-surface-container-low border border-outline-variant/30">
              <div className="w-16 h-16 rounded-full bg-primary-fixed-dim flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-primary text-3xl" data-icon="history">history</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-sm">7-Day Money Back</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">Not in love? Return it within 7 days for a full refund, no questions asked.</p>
            </div>
            <div className="flex flex-col items-center text-center p-lg rounded-2xl bg-surface-container-low border border-outline-variant/30">
              <div className="w-16 h-16 rounded-full bg-primary-fixed-dim flex items-center justify-center mb-md">
                <span className="material-symbols-outlined text-primary text-3xl" data-icon="local_shipping">local_shipping</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-primary mb-sm">Home Delivery</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">We'll bring your new ride directly to your doorstep, anywhere in the country.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-xl px-margin-desktop grid grid-cols-1 md:grid-cols-4 gap-gutter bg-inverse-surface text-inverse-on-surface">
        <div className="flex flex-col gap-md">
          <span className="font-display-lg text-display-lg font-bold text-inverse-on-surface">AutoMarket</span>
          <p className="font-body-md text-body-md text-surface-variant opacity-80">The nation's most trusted professional vehicle marketplace for premium and certified pre-owned vehicles.</p>
          <div className="flex gap-md mt-base">
            <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all" href="#"><span className="material-symbols-outlined">qr_code_2</span></a>
            <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all" href="#"><span className="material-symbols-outlined">photo_camera</span></a>
            <a className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
          </div>
        </div>
        <div className="flex flex-col gap-md">
          <h4 className="font-label-md text-label-md text-primary-fixed-dim font-bold uppercase tracking-widest">Company</h4>
          <nav className="flex flex-col gap-sm">
            <a className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors" href="#">About Us</a>
            <a className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors" href="#">Careers</a>
            <a className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors" href="#">Press</a>
            <a className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors" href="#">Contact</a>
          </nav>
        </div>
        <div className="flex flex-col gap-md">
          <h4 className="font-label-md text-label-md text-primary-fixed-dim font-bold uppercase tracking-widest">Legal</h4>
          <nav className="flex flex-col gap-sm">
            <a className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors" href="#">Privacy Policy</a>
            <a className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors" href="#">Terms of Service</a>
            <a className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors" href="#">Cookie Policy</a>
            <a className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors" href="#">Security</a>
          </nav>
        </div>
        <div className="flex flex-col gap-md">
          <h4 className="font-label-md text-label-md text-primary-fixed-dim font-bold uppercase tracking-widest">Subscribe</h4>
          <p className="font-body-md text-body-md text-surface-variant opacity-80">Get the latest inventory updates and automotive news delivered weekly.</p>
          <form className="flex flex-col gap-sm" onSubmit={(e) => e.preventDefault()}>
            <input className="bg-white/10 border-none rounded-lg p-3 text-white placeholder:text-white/40 focus:ring-2 focus:ring-primary-fixed-dim" placeholder="Email address" type="email" />
            <button className="bg-primary-fixed-dim text-primary-container py-3 rounded-lg font-bold hover:opacity-90 transition-opacity" type="submit">Join Waitlist</button>
          </form>
        </div>
        <div className="md:col-span-4 pt-lg border-t border-white/10 mt-lg flex flex-col md:flex-row justify-between items-center gap-md">
          <span className="font-body-md text-body-md text-surface-variant opacity-60">© 2024 AutoMarket Professional. All rights reserved.</span>
          <div className="flex gap-lg">
            <span className="font-label-sm text-label-sm text-surface-variant opacity-60">HQ: Los Angeles, CA</span>
            <span className="font-label-sm text-label-sm text-surface-variant opacity-60">Support: 1-800-AUTO-MKT</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
