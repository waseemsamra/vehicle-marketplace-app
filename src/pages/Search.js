import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const makes = ['All Makes', 'Land Rover', 'BMW', 'Mercedes-Benz', 'Porsche'];
const fuels = ['Gasoline', 'Electric', 'Hybrid', 'Diesel'];
const bodies = [
  { label: 'Sedan', icon: 'directions_car' },
  { label: 'SUV', icon: 'airport_shuttle' },
  { label: 'Coupe', icon: 'minor_crash' },
  { label: 'Truck', icon: 'mobile_code' },
];
const featureTags = ['Sunroof', 'AWD', 'Navigation', 'Leather', 'Adaptive Cruise'];

const listings = [
  {
    id: 1,
    img: '/image/range-rover.jpg',
    badges: [
      { text: 'Certified', cls: 'bg-primary text-on-primary' },
      { text: 'Price Drop', cls: 'bg-on-tertiary-container text-white' },
    ],
    title: '2024 Land Rover Range Rover',
    price: '$124,900',
    priceNum: 124900,
    sub: 'P400 SE · 1,200 miles',
    make: 'Land Rover',
    fuel: 'Hybrid',
    body: 'SUV',
    features: ['Sunroof', 'AWD', 'Navigation', 'Leather'],
    specs: [['ev_station', 'Hybrid'], ['settings_input_component', 'Automatic'], ['settings_suggest', 'AWD']],
  },
  {
    id: 2,
    img: '/image/porsche-cayenne.jpg',
    badges: [{ text: 'New Arrival', cls: 'bg-primary text-on-primary' }],
    title: '2024 Porsche Cayenne',
    price: '$98,500',
    priceNum: 98500,
    sub: 'Turbo GT · 850 miles',
    make: 'Porsche',
    fuel: 'Gasoline',
    body: 'SUV',
    features: ['Leather', 'AWD'],
    specs: [['local_gas_station', 'Gasoline'], ['settings_input_component', 'PDK'], ['settings_suggest', 'AWD']],
  },
  {
    id: 3,
    img: '/image/bmw-x7.jpg',
    badges: [{ text: 'Reserved', cls: 'bg-on-tertiary-container text-white' }],
    title: '2023 BMW X7 M60i',
    price: '$105,200',
    priceNum: 105200,
    sub: 'M Performance · 12,400 miles',
    make: 'BMW',
    fuel: 'Gasoline',
    body: 'SUV',
    features: ['Leather', 'Navigation'],
    specs: [['local_gas_station', 'Gasoline'], ['settings_input_component', 'Steptronic'], ['settings_suggest', 'xDrive']],
  },
  {
    id: 4,
    img: '/image/mercedes-eqs.jpg',
    badges: [{ text: 'Special Offer', cls: 'bg-primary text-on-primary' }],
    title: '2024 Mercedes EQS SUV',
    price: '$112,000',
    priceNum: 112000,
    sub: '580 4MATIC · 450 miles',
    make: 'Mercedes-Benz',
    fuel: 'Electric',
    body: 'SUV',
    features: ['Navigation', 'AWD', 'Adaptive Cruise'],
    specs: [['electric_car', 'Electric'], ['settings_input_component', 'Direct-Drive'], ['settings_suggest', '4MATIC']],
  },
];

const Search = () => {
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState({});
  const [make, setMake] = useState('All Makes');
  const [priceMax, setPriceMax] = useState(250000);
  const [fuel, setFuel] = useState({});
  const [body, setBody] = useState('');
  const [features, setFeatures] = useState({});

  useEffect(() => {
    document.title = 'AutoMarket | Premium Vehicle Inventory';
  }, []);

  const toggleFav = (id) => setFavorited((f) => ({ ...f, [id]: !f[id] }));
  const toggleFuel = (f) => setFuel((x) => ({ ...x, [f]: !x[f] }));
  const toggleFeature = (f) => setFeatures((x) => ({ ...x, [f]: !x[f] }));
  const toggleBody = (b) => setBody((prev) => (prev === b ? '' : b));

  const filtered = listings.filter((v) => {
    if (v.priceNum > priceMax) return false;
    if (make !== 'All Makes' && v.make !== make) return false;
    const fuelActive = Object.values(fuel).some(Boolean);
    if (fuelActive && !fuel[v.fuel]) return false;
    if (body && v.body !== body) return false;
    const featActive = Object.values(features).some(Boolean);
    if (featActive && !v.features.some((f) => features[f])) return false;
    return true;
  });

  const resetFilters = () => {
    setMake('All Makes');
    setPriceMax(250000);
    setFuel({});
    setBody('');
    setFeatures({});
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm h-20 flex items-center">
        <div className="flex justify-between items-center w-full max-w-max-width mx-auto px-margin-desktop">
          <div className="flex items-center gap-xl">
            <span className="font-headline-md text-headline-md font-bold text-primary">AutoMarket</span>
            <div className="hidden md:flex gap-lg">
              <a className="font-label-md text-label-md text-on-tertiary-container border-b-2 border-on-tertiary-container cursor-pointer" href="#">Inventory</a>
              <a className="font-label-md text-label-md text-secondary hover:text-primary transition-colors cursor-pointer" href="#">Sell</a>
              <a className="font-label-md text-label-md text-secondary hover:text-primary transition-colors cursor-pointer" href="#">Finance</a>
              <a className="font-label-md text-label-md text-secondary hover:text-primary transition-colors cursor-pointer" href="#">Research</a>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <div className="relative hidden lg:block">
              <input className="pl-10 pr-4 py-2 rounded-full border-outline-variant bg-surface-container-lowest focus:ring-on-tertiary-container focus:border-on-tertiary-container text-body-md" placeholder="Search models..." type="text" />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-secondary">search</span>
            </div>
            <button onClick={() => navigate('/login')} className="font-label-md text-label-md text-secondary px-md py-2 cursor-pointer">Login</button>
            <button className="bg-primary text-on-primary font-label-md text-label-md px-lg py-2 rounded-lg hover:opacity-90 transition-all cursor-pointer">List Car</button>
          </div>
        </div>
      </nav>

      {/* Page Layout Wrapper */}
      <div className="pt-20 px-margin-desktop flex gap-xl mb-xl">
        {/* Persistent Sidebar Filters */}
        <aside className="hidden md:block w-72 shrink-0 pt-xl">
          <div className="sticky top-24 space-y-xl h-[calc(100vh-140px)] overflow-y-auto pr-sm custom-scrollbar">
            <div className="flex items-center justify-between">
              <h2 className="font-headline-sm text-headline-sm text-primary">Filters</h2>
              <button onClick={resetFilters} className="text-on-tertiary-container font-label-sm text-label-sm hover:underline">Reset All</button>
            </div>
            {/* Price Range */}
            <section className="space-y-md">
              <h3 className="font-label-md text-label-md font-bold text-on-surface">Price Range</h3>
              <div className="space-y-sm">
                <input
                  className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                  max="250000"
                  min="0"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  type="range"
                />
                <div className="flex justify-between text-label-sm text-secondary">
                  <span>$0</span>
                  <span>${priceMax.toLocaleString()}+</span>
                </div>
              </div>
            </section>
            {/* Make/Model */}
            <section className="space-y-md">
              <h3 className="font-label-md text-label-md font-bold text-on-surface">Make &amp; Model</h3>
              <div className="space-y-sm">
                <select
                  className="w-full rounded-lg border-outline-variant text-body-md focus:ring-on-tertiary-container"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                >
                  {makes.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
                <select className="w-full rounded-lg border-outline-variant text-body-md focus:ring-on-tertiary-container" disabled>
                  <option>All Models</option>
                </select>
              </div>
            </section>
            {/* Fuel Type */}
            <section className="space-y-md">
              <h3 className="font-label-md text-label-md font-bold text-on-surface">Fuel Type</h3>
              <div className="space-y-sm">
                {fuels.map((f) => (
                  <label key={f} className="flex items-center gap-sm cursor-pointer group">
                    <input
                      className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5"
                      type="checkbox"
                      checked={!!fuel[f]}
                      onChange={(e) => toggleFuel(f)}
                    />
                    <span className="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">{f}</span>
                  </label>
                ))}
              </div>
            </section>
            {/* Body Type */}
            <section className="space-y-md">
              <h3 className="font-label-md text-label-md font-bold text-on-surface">Body Type</h3>
              <div className="grid grid-cols-2 gap-sm">
                {bodies.map((b) => {
                  const active = body === b.label;
                  return (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => toggleBody(b.label)}
                      className={`p-md border rounded-lg text-center transition-all ${
                        active
                          ? 'border-on-tertiary-container bg-on-tertiary-container text-white'
                          : 'border-outline-variant hover:border-primary hover:bg-surface-container-low'
                      }`}
                    >
                      <span className="material-symbols-outlined block mb-xs">{b.icon}</span>
                      <span className="text-label-sm">{b.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
            {/* Features Tags */}
            <section className="space-y-md pb-xl">
              <h3 className="font-label-md text-label-md font-bold text-on-surface">Features</h3>
              <div className="flex flex-wrap gap-xs">
                {featureTags.map((f) => {
                  const active = !!features[f];
                  return (
                    <span
                      key={f}
                      onClick={() => toggleFeature(f)}
                      className={`px-md py-sm rounded-full text-label-sm cursor-pointer transition-all ${
                        active ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-outline-variant'
                      }`}
                    >
                      {f}
                    </span>
                  );
                })}
              </div>
            </section>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 pt-xl">
          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-lg gap-md">
            <div>
              <h1 className="font-headline-sm text-headline-sm text-primary">Luxury SUVs</h1>
              <p className="font-body-md text-body-md text-secondary">{filtered.length === 0 ? 'No vehicles' : filtered.length} vehicle{filtered.length === 1 ? '' : 's'} found matching your criteria</p>
            </div>
            <div className="flex items-center gap-md">
              <span className="font-label-md text-label-md text-secondary">Sort By:</span>
              <select className="rounded-lg border-outline-variant text-body-md bg-surface-bright focus:ring-primary min-w-[160px]">
                <option>Relevance</option>
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Mileage: Low to High</option>
              </select>
            </div>
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            {filtered.length === 0 ? (
              <div className="lg:col-span-3 text-center py-xl text-on-surface-variant">
                <span className="material-symbols-outlined text-5xl mb-4">search_off</span>
                <p className="font-body-lg">No vehicles match your current filters. Reset to see all listings.</p>
              </div>
            ) : (
              filtered.map((v) => (
                <div key={v.id} className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0px_20px_40px_rgba(0,0,0,0.04)] hover:shadow-lg transition-all duration-300">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={v.title} src={v.img} />
                    <div className="absolute top-md left-md flex gap-xs">
                      {v.badges.map((b) => (
                        <span key={b.text} className={`text-label-sm px-md py-1 rounded-full font-bold ${b.cls}`}>{b.text}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => toggleFav(v.id)}
                      className="absolute top-md right-md w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: favorited[v.id] ? "'FILL' 1" : "'FILL' 0", color: favorited[v.id] ? '#ef4444' : 'inherit' }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>
                  <div className="p-md space-y-md">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline-sm text-headline-sm text-primary">{v.title}</h3>
                        <span className="font-headline-sm text-headline-sm text-on-tertiary-container">{v.price}</span>
                      </div>
                      <p className="font-body-md text-body-md text-secondary">{v.sub}</p>
                    </div>
                    <div className="flex gap-sm border-y border-outline-variant/30 py-md">
                      {v.specs.map(([icon, label]) => (
                        <div key={icon} className="flex items-center gap-xs text-secondary text-label-md">
                          <span className="material-symbols-outlined text-[20px]">{icon}</span>
                          {label}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-md">
                      <button className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg hover:opacity-90 transition-all">View Details</button>
                      <button className="px-md border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all">
                        <span className="material-symbols-outlined">chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/95 backdrop-blur-xl border-t border-outline-variant/30 px-margin-mobile py-sm flex justify-around items-center z-[100] shadow-lg">
        <button className="flex flex-col items-center gap-1 text-on-tertiary-container">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
          <span className="text-[10px] font-bold">Search</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-secondary">
          <span className="material-symbols-outlined">favorite</span>
          <span className="text-[10px]">Saved</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-secondary">
          <span className="material-symbols-outlined">sell</span>
          <span className="text-[10px]">Sell</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-secondary">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default Search;
