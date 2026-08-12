import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import {
  makes,
  CATEGORIES,
  CITIES,
  MODELS,
  BUDGETS,
  BODY_TYPES,
} from '../data/vehicles';
import { vehicleApi } from '../services/vehicleApi';
import Navbar from '../components/Navbar';

const TAB_OPTIONS = {
  Category: { cols: 6, options: CATEGORIES },
  City: { cols: 6, options: CITIES },
  Make: { cols: 6, options: [] },
  Model: { cols: 6, options: MODELS.slice(0, 30) },
  Budget: { cols: 4, options: BUDGETS },
  'Body Type': { cols: 6, options: BODY_TYPES },
};
const TABS = Object.keys(TAB_OPTIONS);
const CATEGORY_ICONS = {
  'Sports cars': <path fill="currentColor" d="M12 8.5H7L4 11H3c-1.11 0-2 .89-2 2v3h2.17c.43 1.2 1.56 2 2.83 2s2.4-.8 2.82-2h6.35c.43 1.2 1.56 2 2.83 2s2.4-.8 2.82-2H23v-1c0-1.11-1.03-1.47-2-2zM5.25 12l2.25-2h4l4 2zM6 13.5A1.5 1.5 0 0 1 7.5 15A1.5 1.5 0 0 1 6 16.5A1.5 1.5 0 0 1 4.5 15A1.5 1.5 0 0 1 6 13.5m12 0a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5" />,
  'Electric cars': <path fill="currentColor" d="M18.92 2c-.2-.58-.76-1-1.42-1h-11c-.66 0-1.21.42-1.42 1L3 8v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1V8zM6.5 12c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9S8 9.67 8 10.5S7.33 12 6.5 12m11 0c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5M5 7l1.5-4.5h11L19 7zm2 13h4v-2l6 3h-4v2z" />,
  'Luxury Car': <path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2L9.19 8.62L2 9.24l5.45 4.73L5.82 21z" />,
  'Japanese cars': <path fill="currentColor" d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" />,
  'Automatic cars': <path fill="currentColor" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49 1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64z" />,
  'Old Cars': <path fill="currentColor" d="m5 11l1.5-4.5h11L19 11m-1.5 5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m-11 0A1.5 1.5 0 0 1 5 14.5A1.5 1.5 0 0 1 6.5 13A1.5 1.5 0 0 1 8 14.5A1.5 1.5 0 0 1 6.5 16M18.92 6c-.2-.58-.76-1-1.42-1h-11c-.66 0-1.22.42-1.42 1L3 12v8a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1h12v1a1 1 0 0 0 1 1h1c.55 0 1-.45 1-1v-8z" />,
  'Hybrid cars': <path fill="currentColor" d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8" />,
  'Carry Daba': <path fill="currentColor" d="M18 18.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9A1.5 1.5 0 0 1 4.5 17A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 17A1.5 1.5 0 0 1 6 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-5z" />,
  '7 Seater': <path fill="currentColor" d="M12 5.5A3.5 3.5 0 0 1 15.5 9a3.5 3.5 0 0 1-3.5 3.5A3.5 3.5 0 0 1 8.5 9A3.5 3.5 0 0 1 12 5.5M5 8c.56 0 1.08.15 1.53.42c-.15 1.43.27 2.85 1.13 3.96C7.16 13.34 6.16 14 5 14a3 3 0 0 1-3-3a3 3 0 0 1 3-3m14 0a3 3 0 0 1 3 3a3 3 0 0 1-3 3c-1.16 0-2.16-.66-2.66-1.62a5.54 5.54 0 0 0 1.13-3.96c.45-.27.97-.42 1.53-.42M5.5 18.25c0-2.07 2.91-3.75 6.5-3.75s6.5 1.68 6.5 3.75V20h-13zM0 20v-1.5c0-1.39 1.89-2.56 4.45-2.9c-.59.68-.95 1.62-.95 2.65V20z" />,
  'Accidental': <path fill="currentColor" d="M13 13h-2V7h2m-2 8h2v2h-2m4.73-14H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27z" />,
  'Modified Cars': <path fill="currentColor" d="M7 7l8-8 2 2-8 8-1-1v1h-2V9l1-1zm9 5l2 2" />,
  'Small cars': <path fill="currentColor" d="M18 10a1 1 0 0 1-1-1a1 1 0 0 1 1-1a1 1 0 0 1 1 1a1 1 0 0 1-1 1m-6 0H6V5h6m7.77 2.23l.01-.01l-3.72-3.72L15 4.56l2.11 2.11C16.17 7 15.5 7.93 15.5 9a2.5 2.5 0 0 0 2.5 2.5c.36 0 .69-.08 1-.21v7.21a1 1 0 0 1-1 1a1 1 0 0 1-1-1V14a2 2 0 0 0-2-2h-1V5a2 2 0 0 0-2-2H6c-1.11 0-2 .89-2 2v16h10v-7.5h1.5v5A2.5 2.5 0 0 0 18 21a2.5 2.5 0 0 0 2.5-2.5V9c0-.69-.28-1.32-.73-1.77z" />,
  'Cheap cars': <path fill="currentColor" d="M4 18v3h3v-3h10v3h3v-6H4zm15-8h3v3h-3zM2 10h3v3H2zm15 3h-7V5h6a2 2 0 0 1 2 2z" />,
  '8 Seater': <path fill="currentColor" d="M17 8c-.56 0-1.08.15-1.53.42c-.15 1.43-.27 2.85-.27 4.13c0 2.42.6 4.6 1.72 6.27c.06-.13.11-.26.11-.4V13c-.93-.68-1.6-1.73-1.6-2.9c0-1.22.5-2.33 1.3-3.17c.9-.9 2.03-1.5 3.28-1.5c1.25 0 2.38.56 3.18 1.41l2.5-2.5c-.59-3.93-3.66-6.41-7.5-6.41c-3.21 0-5.93 1.92-7.15 4.67A7.5 7.5 0 0 0 12 10v2c-3.31.54-5.5 3.48-5.5 6.93c0 .54.06 1.07.16 1.6A1.5 1.5 0 0 1 5.5 18c.05 0 .1-.02.15-.05C7.5 16.5 9 14.75 9 12.82c0-2.47-.95-4.72-2.5-6.42C4.95 7.3 4 9.03 4 11c0 3.31 2.69 6 6 6v2a8 8 0 0 1-2.64-12.64" />,
  '660cc cars': <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 2a8 8 0 0 1 8 8c0 2.4-1 4.5-2.7 6c-1.4-1.3-3.3-2-5.3-2s-3.8.7-5.3 2C5 16.5 4 14.4 4 12a8 8 0 0 1 8-8m2 1.89c-.38.01-.74.26-.9.65l-1.29 3.23l-.1.23c-.71.13-1.3.6-1.57 1.26c-.41 1.03.09 2.19 1.12 2.6s2.19-.09 2.6-1.12c.26-.66.14-1.42-.29-1.98l.1-.26l1.29-3.21l.01-.03c.2-.51-.05-1.09-.56-1.3c-.13-.05-.26-.07-.41-.07M10 6a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m-3 3a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1m10 0a1 1 0 0 0-1 1a1 1 0 0 0 1 1a1 1 0 0 0 1-1a1 1 0 0 0-1-1" />,
  '1300cc cars': <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 2a8 8 0 0 1 8 8c0 2.4-1 4.5-2.7 6c-1.4-1.3-3.3-2-5.3-2s-3.8.7-5.3 2C5 16.5 4 14.4 4 12a8 8 0 0 1 8-8z" />,
  '1000cc cars': <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 2a8 8 0 0 1 8 8c0 2.4-1 4.5-2.7 6c-1.4-1.3-3.3-2-5.3-2s-3.8.7-5.3 2C5 16.5 4 14.4 4 12a8 8 0 0 1 8-8z" />,
  'Petrol Cars': <path fill="currentColor" d="M18 18.5a1.5 1.5 0 0 1-1.5-1.5a1.5 1.5 0 0 1 1.5-1.5a1.5 1.5 0 0 1 1.5 1.5a1.5 1.5 0 0 1-1.5 1.5m1.5-9l1.96 2.5H17V9.5m-11 9A1.5 1.5 0 0 1 4.5 17A1.5 1.5 0 0 1 6 15.5A1.5 1.5 0 0 1 7.5 17A1.5 1.5 0 0 1 6 18.5M20 8h-3V4H3c-1.11 0-2 .89-2 2v11h2a3 3 0 0 0 3 3a3 3 0 0 0 3-3h6a3 3 0 0 0 3 3a3 3 0 0 0 3-3h2v-5z" />,
};

const makeInitial = (name) => (name || '?').charAt(0).toUpperCase();

const generateMakeLogo = (name) => {
  const initial = makeInitial(name);
  const colors = ['#1a237e', '#b71c1c', '#1b5e20', '#e65100', '#4a148c', '#006064', '#f57f17', '#880e4f', '#33691e', '#3e2723', '#0d47a1', '#d32f2f'];
  const idx = (name || '').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const bg = colors[idx % colors.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" rx="8" fill="${bg}"/><text x="20" y="26" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="#ffffff" text-anchor="middle">${initial}</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Category');
  const [selected, setSelected] = useState({});
  const [categoryPage, setCategoryPage] = useState(0);
  const [featuredVehicles] = useState([]);
  const [featuredLoading] = useState(true);
  const [heroMake, setHeroMake] = useState('');
  const [heroModel, setHeroModel] = useState('');
  const [heroMaxPrice, setHeroMaxPrice] = useState('');
  const [aiQuery, setAiQuery] = useState('');
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [dbMakes, setDbMakes] = useState([]);
  const [, setMakesLoading] = useState(true);
  const featuredScrollRef = useRef(null);

  const scrollFeatured = (direction) => {
    const el = featuredScrollRef.current;
    if (!el) return;
    const scrollAmount = 304;
    el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  useEffect(() => {
    const loadMakes = async () => {
      try {
        const data = await vehicleApi.getMakes();
        const items = Array.isArray(data) ? data : [];
        setDbMakes(items);
        const visibleMakes = items.filter((m) => m.showOnHomePage);
        const makeNames = visibleMakes.map((m) => m.makeName).filter(Boolean);
        if (makeNames.length) {
          const originalMakes = makes.filter((m) => m !== 'All Makes');
          const prioritized = originalMakes
            .filter((m) => makeNames.includes(m))
            .concat(makeNames.filter((m) => !originalMakes.includes(m)));
          TAB_OPTIONS.Make.options = prioritized.slice(0, 12);
        } else {
          TAB_OPTIONS.Make.options = [];
        }
      } catch (e) {
        console.error('Failed to load makes', e);
        TAB_OPTIONS.Make.options = makes.filter((m) => m !== 'All Makes').slice(0, 12);
      } finally {
        setMakesLoading(false);
      }
    };
    loadMakes();
  }, []);
  const toggleOption = (tab, value) =>
    setSelected((s) => ({ ...s, [tab]: s[tab] === value ? undefined : value }));
  const PAGE_SIZE = 12;
  const catOptions = TAB_OPTIONS.Category.options;
  const totalPages = Math.max(1, Math.ceil(catOptions.length / PAGE_SIZE));
  const pageOptions = catOptions.slice(categoryPage * PAGE_SIZE, categoryPage * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img alt="Luxury SUV Hero" className="w-full h-full object-cover" src="/image/hero.jpg" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-container/40 to-transparent"></div>
          </div>
           <div className="relative z-10 w-full mx-auto px-margin-desktop flex flex-col items-center gap-xl" style={{ maxWidth: '1536px' }}>
            <div className="max-w-3xl text-center">
               <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-5xl md:text-7xl font-extrabold mb-4 text-white drop-shadow-lg">Find Your Next Drive</h1>
               <p className="font-body-lg text-body-lg text-white/90 mb-6 max-w-2xl mx-auto drop-shadow-md">Browse thousands of certified pre-owned and new vehicles from trusted dealers across the nation.</p>
                <div className="w-full max-w-2xl mx-auto">
                  <div className="flex gap-2">
                     <div className="relative flex-1">
                       <input
                         value={aiQuery}
                         onChange={(e) => setAiQuery(e.target.value)}
                         onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); navigate(`/search?keyword=${encodeURIComponent(aiQuery)}`); } }}
                         className="w-full bg-white/90 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg pl-4 pr-20 py-3 focus:outline-none focus:ring-2 focus:ring-white/60"
                         placeholder='Ask AI: "Tesla Model 3 under $50,000"'
                         type="text"
                       />
                       <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full bg-gray-900 text-white text-xs font-bold px-2 py-1">
                         <span className="material-symbols-outlined text-sm">auto_awesome</span>
                         AI
                       </span>
                     </div>
                    <button onClick={() => navigate(`/search?keyword=${encodeURIComponent(aiQuery)}`)} className="bg-white text-primary font-bold px-6 py-3 rounded-lg hover:bg-white/90 transition-all flex items-center gap-2">
                      <span className="material-symbols-outlined">search</span>
                      Search
                    </button>
                  </div>
                </div>
            </div>
            <button onClick={() => setAdvancedOpen((p) => !p)} className="text-sm text-gray-900 hover:text-black underline underline-offset-4 transition-colors">
              {advancedOpen ? 'Hide Advanced Search' : 'Advanced Search'}
            </button>
             {/* Advanced Search Card */}
             {advancedOpen && (
               <div className="glass-panel-light w-full max-w-4xl p-lg rounded-xl shadow-2xl border border-white/20">
                 <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); const q = aiQuery || ''; const params = new URLSearchParams({ keyword: q }); if (heroMake) params.set('make', heroMake); if (heroModel) params.set('model', heroModel); if (heroMaxPrice) params.set('maxPrice', heroMaxPrice); navigate(`/search?${params.toString()}`); }}>
                   <div className="grid grid-cols-2 gap-md">
                     <div>
                       <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Make</label>
                       <select value={heroMake} onChange={(e) => setHeroMake(e.target.value)} className="w-full bg-surface-container-low border-outline-variant rounded-lg p-3 text-body-md focus:ring-secondary focus:border-secondary">
                         <option value="">Any Make</option>
                         <option value="Tesla">Tesla</option>
                         <option value="BMW">BMW</option>
                         <option value="Mercedes-Benz">Mercedes-Benz</option>
                         <option value="Audi">Audi</option>
                       </select>
                     </div>
                     <div>
                       <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Model</label>
                       <input value={heroModel} onChange={(e) => setHeroModel(e.target.value)} className="w-full bg-surface-container-low border-outline-variant rounded-lg p-3 text-body-md focus:ring-secondary focus:border-secondary" placeholder="Any Model" type="text" />
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-md">
                     <div>
                       <label className="block font-label-sm text-label-sm text-on-surface-variant mb-2">Max Price</label>
                       <select value={heroMaxPrice} onChange={(e) => setHeroMaxPrice(e.target.value)} className="w-full bg-surface-container-low border-outline-variant rounded-lg p-3 text-body-md focus:ring-secondary focus:border-secondary">
                         <option value="">No Max</option>
                         <option value="30000">$30,000</option>
                         <option value="50000">$50,000</option>
                         <option value="75000">$75,000</option>
                         <option value="100000">$100,000+</option>
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
             )}
          </div>
        </section>

        {/* Category Tabs */}
        <section className="pt-xl pb-md">
           <div className="mx-auto px-margin-desktop" style={{ maxWidth: '1536px' }}>
            <h2 className="font-display-lg text-[32px] font-bold leading-tight text-primary mb-lg text-left">Browse Used Cars</h2>
            <div className="flex gap-gutter overflow-x-auto hide-scrollbar">
              {TABS.map((tab) => {
                const selectedCount = selected[tab] !== undefined ? 1 : 0;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={
                      activeTab === tab
                        ? 'flex-shrink-0 flex items-center gap-xs px-lg pb-px border-b-2 border-primary font-label-md text-label-md text-primary whitespace-nowrap'
                        : 'flex-shrink-0 flex items-center gap-xs px-lg pb-px border-b-2 border-transparent font-label-md text-label-md text-on-surface-variant hover:text-primary whitespace-nowrap'
                    }
                  >
                    {tab}
                    {selectedCount > 0 && (
                      <span className="w-5 h-5 flex items-center justify-center text-xs bg-on-tertiary-container text-on-primary rounded-full">{selectedCount}</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="border-b border-outline-variant/20 mb-md"></div>
            <div className="mt-md">
              {activeTab === 'Category' ? (
                <div className="relative">
                   <div className="grid grid-cols-6 gap-xs">
                    {pageOptions.map((opt) => {
                      const isActive = selected[activeTab] === opt;
                      return (
                        <button
                          key={String(opt)}
                          onClick={() => { toggleOption(activeTab, opt); navigate('/search?category=' + opt.toLowerCase().replace(/\s+/g, '-')); }}
                          className={
                            isActive
                              ? 'flex flex-col items-center justify-center gap-xs w-full px-md py-lg rounded-xl border-2 border-primary bg-surface text-center focus:outline-none'
                              : 'flex flex-col items-center justify-center gap-xs w-full px-md py-lg rounded-xl border border-outline-variant bg-surface-container hover:border-outline-variant hover:bg-surface focus:outline-none text-center'
                          }
                        >
                          <span className="flex items-center justify-center w-12 h-12 text-primary">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">{CATEGORY_ICONS[opt]}</svg>
                          </span>
                          <span className="font-label-sm text-label-sm text-on-surface break-words">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {totalPages > 1 && (
                    <>
                      {categoryPage > 0 && (
                        <button
                          onClick={() => setCategoryPage((p) => Math.max(0, p - 1))}
                          className="absolute left-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-surface-container transition-colors"
                          aria-label="Previous page"
                        >
                          <span className="material-symbols-outlined text-2xl font-bold">chevron_left</span>
                        </button>
                      )}
                      <button
                        onClick={() => setCategoryPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={categoryPage === totalPages - 1}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-surface-container disabled:opacity-40 transition-colors"
                        aria-label="Next page"
                      >
                        <span className="material-symbols-outlined text-2xl font-bold">chevron_right</span>
                      </button>
                    </>
                  )}
                </div>
              ) : activeTab === 'Make' ? (
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${TAB_OPTIONS[activeTab].cols} gap-xs`}>
                  {(TAB_OPTIONS[activeTab].options || []).map((opt) => {
                    const isActive = selected[activeTab] === opt;
                    const found = dbMakes.find((m) => (m.makeName || '').toLowerCase() === (opt || '').toLowerCase());
                    const logoSrc = found?.logo || generateMakeLogo(opt);
                    return (
                      <button
                        key={String(opt)}
                        onClick={() => toggleOption(activeTab, opt)}
                        className={
                          isActive
                            ? 'flex flex-col items-center justify-center gap-xs w-full px-md py-lg rounded-xl border-2 border-primary bg-surface text-center focus:outline-none'
                            : 'flex flex-col items-center justify-center gap-xs w-full px-md py-lg rounded-xl border border-outline-variant bg-surface-container hover:border-outline-variant hover:bg-surface focus:outline-none text-center'
                        }
                      >
                        <span className="flex items-center justify-center w-12 h-12 text-primary">
                          <img src={logoSrc} alt={opt} className="w-10 h-10 object-contain rounded" />
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface break-words">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-${TAB_OPTIONS[activeTab].cols} gap-xs`}>
                  {(TAB_OPTIONS[activeTab].options || []).map((opt) => {
                    const isActive = selected[activeTab] === opt;
                    return (
                      <button
                        key={String(opt)}
                        onClick={() => toggleOption(activeTab, opt)}
                        className={
                          isActive
                            ? 'px-md py-sm font-label-md text-label-md text-primary font-bold text-left focus:outline-none'
                            : 'px-md py-sm font-label-md text-label-md text-on-surface-variant hover:text-primary text-left focus:outline-none'
                        }
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-xl bg-surface">
           <div className="mx-auto px-margin-desktop" style={{ maxWidth: '1536px' }}>
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
           <div className="mx-auto px-margin-desktop" style={{ maxWidth: '1536px' }}>
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
           <div className="mx-auto px-margin-desktop" style={{ maxWidth: '1536px' }}>
            <div className="flex items-center justify-between mb-lg">
              <h2 className="font-headline-md text-headline-md md:text-2xl font-bold text-primary">Featured Listings</h2>
              <div className="flex gap-sm">
                <button onClick={() => scrollFeatured('left')} className="p-2 rounded-full border border-outline-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button onClick={() => scrollFeatured('right')} className="p-2 rounded-full border border-outline-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
            {featuredLoading ? (
              <div className="text-center py-12 text-on-surface-variant">Loading featured vehicles...</div>
            ) : (
               <div ref={featuredScrollRef} className="flex gap-gutter overflow-x-auto hide-scrollbar pb-4">
                 {featuredVehicles.map((v) => {
                   const vehicleId = v.vehicleId || v.id || v.VehicleID;
                   return (
                     <VehicleCard
                       key={vehicleId}
                       vehicle={v}
                       onClick={(id) => navigate(`/vehicle/${id}`)}
                       className="flex-shrink-0 w-[280px]"
                     />
                   );
                 })}
               </div>
            )}
          </div>
        </section>

        {/* Customer Testimonials Section */}
        <section className="py-xl bg-surface-container">
           <div className="mx-auto px-margin-desktop" style={{ maxWidth: '1536px' }}>
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
         <section className="py-xl mx-auto px-margin-desktop" style={{ maxWidth: '1536px' }}>
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
                        <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"><span className="material-symbols-outlined">qr_code_2</span></button>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"><span className="material-symbols-outlined">photo_camera</span></button>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"><span className="material-symbols-outlined">alternate_email</span></button>
          </div>
        </div>
        <div className="flex flex-col gap-md">
          <h4 className="font-label-md text-label-md text-primary-fixed-dim font-bold uppercase tracking-widest">Company</h4>
          <nav className="flex flex-col gap-sm">
            <button className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors text-left">About Us</button>
            <button className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors text-left">Careers</button>
            <button className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors text-left">Press</button>
            <button className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors text-left">Contact</button>
          </nav>
        </div>
        <div className="flex flex-col gap-md">
          <h4 className="font-label-md text-label-md text-primary-fixed-dim font-bold uppercase tracking-widest">Legal</h4>
          <nav className="flex flex-col gap-sm">
            <button className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors text-left">Privacy Policy</button>
            <button className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors text-left">Terms of Service</button>
            <button className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors text-left">Cookie Policy</button>
            <button className="font-body-md text-body-md text-surface-variant opacity-80 hover:text-primary-fixed-dim transition-colors text-left">Security</button>
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
