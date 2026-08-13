import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { vehicleApi } from '../services/vehicleApi';
import Navbar from '../components/Navbar';
import VehicleCard from '../components/VehicleCard';
import { normalizeMake } from '../data/vehicles';

const API_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5001/api');

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [allVehicles, setAllVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

  const [keyword, setKeyword] = useState('');
  const [makeSel, setMakeSel] = useState('');
  const [modelSel, setModelSel] = useState('');
  const [bodySel, setBodySel] = useState('');
  const [yearSel, setYearSel] = useState('');
  const [mileageSel, setMileageSel] = useState('');
  const [priceMax, setPriceMax] = useState(300000);
  const [minPrice, setMinPrice] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(30);

  const [fuel, setFuel] = useState({});
  const [transmission, setTransmission] = useState({});
  const [engine, setEngine] = useState({});
  const [features, setFeatures] = useState({});
  const [sortBy, setSortBy] = useState('relevance');

  const barRef = useRef(null);
  const [barOffset, setBarOffset] = useState(96);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const update = () => setBarOffset(96 + el.offsetHeight);
    update();
  }, []);

  useEffect(() => {
    document.title = 'Carssourcing | Premium Vehicle Inventory';
  }, []);

  useEffect(() => {
    const make = searchParams.get('make') || '';
    const model = searchParams.get('model') || '';
    if (make) setMakeSel(make);
    if (model) setModelSel(model);
  }, [searchParams]);

  useEffect(() => {
    const load = async () => {
      try {
        const [vehiclesData, makesRes, modelsRes] = await Promise.all([
          vehicleApi.getAll(null, 200),
          fetch(`${API_URL}/makes`).then(r => r.ok ? r.json() : []),
          fetch(`${API_URL}/models`).then(r => r.ok ? r.json() : []),
        ]);
        const items = vehiclesData?.items || vehiclesData || [];
        setAllVehicles(items);
        setMakes(makesRes);
        setModels(modelsRes);
      } catch (e) {
        console.error('Failed to load data', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const parseSearchQuery = (query, makes, models) => {
    if (!query) return { keyword: '', make: '', model: '', maxPrice: 300000 };

    const lower = query.toLowerCase();
    let maxPrice = 300000;
    let minPrice = 0;
    let make = '';
    let model = '';
    let cleaned = lower;

    const maxPriceMatch = lower.match(/(?:under|below|less\s+than|upto|up\s+to|max|maximum)\s+\$?([\d,]+)/i);
    if (maxPriceMatch) {
      maxPrice = Number(maxPriceMatch[1].replace(/,/g, ''));
      cleaned = cleaned.replace(maxPriceMatch[0], '');
    }

    const minPriceMatch = lower.match(/(?:above|over|more\s+than|greater\s+than)\s+\$?([\d,]+)/i);
    if (minPriceMatch) {
      minPrice = Number(minPriceMatch[1].replace(/,/g, ''));
      cleaned = cleaned.replace(minPriceMatch[0], '');
    }

    const makeNames = makes.map(m => m.makeName?.toLowerCase()).filter(Boolean);
    for (const makeName of makeNames) {
      if (cleaned.includes(makeName)) {
        make = makes.find(m => m.makeName?.toLowerCase() === makeName)?.makeName || '';
        cleaned = cleaned.replace(makeName, '');
        break;
      }
    }

    const modelNames = models.map(m => m.modelName?.toLowerCase()).filter(Boolean);
    for (const modelName of modelNames) {
      if (cleaned.includes(modelName)) {
        model = models.find(m => m.modelName?.toLowerCase() === modelName)?.modelName || '';
        cleaned = cleaned.replace(modelName, '');
        break;
      }
    }

    const noiseWords = new Set(['enquire', 'search', 'find', 'show', 'me', 'cars', 'car', 'usd', 'dollars', 'dollar', 'for', 'sale', 'in', 'at', 'the', 'a', 'an', 'under', 'below', 'less', 'than', 'upto', 'up', 'to', 'max', 'maximum', 'above', 'over', 'more', 'greater']);
    const keyword = cleaned.split(/\s+/).filter(w => w && !noiseWords.has(w)).join(' ');
    return { keyword, make, model, maxPrice, minPrice };
  };

  const parsedRef = React.useRef({ keyword: '', make: '', model: '', maxPrice: 300000, minPrice: 0, dirty: false });

  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    if (!keyword) return;

    const parsed = parseSearchQuery(keyword, makes, models);
    if (parsed.keyword !== parsedRef.current.keyword || parsed.make !== parsedRef.current.make || 
        parsed.model !== parsedRef.current.model || parsed.maxPrice !== parsedRef.current.maxPrice || parsed.minPrice !== parsedRef.current.minPrice) {
      parsedRef.current = parsed;
      parsedRef.current.dirty = true;
      if (parsed.make) setMakeSel(parsed.make);
      if (parsed.model) setModelSel(parsed.model);
      if (parsed.maxPrice < 300000) setPriceMax(parsed.maxPrice);
      if (parsed.minPrice > 0) setMinPrice(parsed.minPrice);
    }
  }, [searchParams, makes, models]);

  const toggleMulti = (setter) => (key) => setter((x) => ({ ...x, [key]: !x[key] }));
  const toggleFuel = toggleMulti(setFuel);
  const toggleTransmission = toggleMulti(setTransmission);
  const toggleEngine = toggleMulti(setEngine);
  const toggleFeature = toggleMulti(setFeatures);

  const makeOptions = makes.map((m) => ({ value: m.makeName, label: m.makeName }));

  const modelOptions = useMemo(() => {
    const makeName = makeSel;
    return models
      .filter((m) => !makeName || normalizeMake(m.brandName) === normalizeMake(makeName))
      .map((m) => ({ value: m.modelName, label: m.modelName }));
  }, [models, makeSel]);

  const bodyOptions = useMemo(() => {
    const set = new Set();
    allVehicles.forEach((v) => {
      if (modelSel && v.model !== modelSel) return;
      if (makeSel && v.make !== makeSel) return;
      if (v.body) set.add(v.body);
    });
    return [...set].sort().map((b) => ({ value: b, label: b }));
  }, [allVehicles, modelSel, makeSel]);

  const years = useMemo(() => {
    const set = new Set(allVehicles.map((v) => v.year).filter(Number.isInteger));
    return [...set].sort((a, b) => b - a);
  }, [allVehicles]);
  const yearOptions = years.map((y) => ({ value: y, label: String(y) }));

  const fuels = useMemo(() => [...new Set(allVehicles.map((v) => v.fuel || v.fuelType).filter(Boolean))].sort(), [allVehicles]);
  const fuelOptions = fuels.map((f) => ({ value: f, label: f }));

  const transmissions = useMemo(() => [...new Set(allVehicles.map((v) => v.transmission).filter(Boolean))].sort(), [allVehicles]);
  const transmissionOptions = transmissions.map((t) => ({ value: t, label: t }));

  const engines = useMemo(() => [...new Set(allVehicles.map((v) => v.engine).filter(Boolean))].sort(), [allVehicles]);
  const engineOptions = engines.map((e) => ({ value: e, label: e }));

  const featureTags = useMemo(() => {
    const set = new Set();
    allVehicles.forEach((v) => {
      (v.features || []).forEach((f) => { if (f) set.add(f); });
    });
    return [...set].sort();
  }, [allVehicles]);
  const featureOptions = featureTags.map((f) => ({ value: f, label: f }));

  const filtered = useMemo(() => {
    const parsed = parseSearchQuery(keyword, makes, models);
    const effectiveMaxPrice = parsed.maxPrice < 300000 ? parsed.maxPrice : priceMax;
    const effectiveMinPrice = parsed.minPrice > 0 ? parsed.minPrice : minPrice;
    const searchKeyword = parsed.keyword;

    return allVehicles.filter((v) => {
      if (searchKeyword) {
        const words = searchKeyword.toLowerCase().split(/\s+/).filter(Boolean);
        const haystack = `${v.make} ${v.model} ${v.title}`.toLowerCase();
        if (!words.some(word => haystack.includes(word))) return false;
      }
      if (makeSel && normalizeMake(v.make) !== normalizeMake(makeSel)) return false;
      if (modelSel && v.model !== modelSel) return false;
      if (bodySel && v.body !== bodySel) return false;
      if (yearSel && String(v.year) !== yearSel) return false;
      if (mileageSel && v.mileage > Number(mileageSel)) return false;
      const price = Number(v.priceNum);
      if (!Number.isNaN(price)) {
        if (price > effectiveMaxPrice) return false;
        if (effectiveMinPrice && price < effectiveMinPrice) return false;
      }

      const any = (obj) => Object.values(obj).some(Boolean);
      if (any(fuel) && !fuel[v.fuel || v.fuelType]) return false;
      if (any(transmission) && !transmission[v.transmission]) return false;
      if (any(engine) && !engine[v.engine]) return false;
      if (any(features) && !(v.features || []).some((f) => features[f])) return false;
      return true;
    });
  }, [
    allVehicles,
    keyword,
    makeSel,
    modelSel,
    bodySel,
    yearSel,
    mileageSel,
    priceMax,
    minPrice,
    makes,
    models,
    fuel,
    transmission,
    engine,
    features,
  ]);

  const resetAll = () => {
    setKeyword('');
    setMakeSel('');
    setModelSel('');
    setBodySel('');
    setYearSel('');
    setMileageSel('');
    setPriceMax(300000);
    setMinPrice(0);
    setFuel({});
    setTransmission({});
    setEngine({});
    setFeatures({});
    setSortBy('relevance');
  };

  const sorted = useMemo(() => {
    const list = [...filtered];
    switch (sortBy) {
      case 'price-asc':
        return list.sort((a, b) => (Number(a.priceNum) || 0) - (Number(b.priceNum) || 0));
      case 'price-desc':
        return list.sort((a, b) => (Number(b.priceNum) || 0) - (Number(a.priceNum) || 0));
      case 'mileage-asc':
        return list.sort((a, b) => (Number(a.mileage) || 0) - (Number(b.mileage) || 0));
      case 'newest':
        return list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      default:
        return list;
    }
  }, [filtered, sortBy]);

  return (
    <div className="bg-background text-on-background min-h-screen">
      <Navbar />

      {/* Page Layout: results + grid (filter bar is fixed above) */}
      <div className="mx-auto px-margin-desktop mb-xl" style={{ maxWidth: '1536px' }}>
        {/* Spacer clears the fixed header + fixed filter bar so content isn't hidden */}
        <div className="h-24" style={{ height: `${barOffset}px` }} aria-hidden="true" />

        {/* Top toolbar: filter bar + drawer (fixed below header; mirrors Home's fixed header) */}
        <div ref={barRef} className="fixed top-20 left-0 right-0 z-40 bg-surface-container-lowest border-b border-outline-variant/20">
          <div className="mx-auto px-margin-desktop space-y-md" style={{ maxWidth: '1536px' }}>
            <div className="flex flex-wrap items-end gap-md bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/20 shadow-ambient">
              <div className="flex gap-2 flex-1 min-w-[300px]">
                <div className="relative flex-1">
                  <input
                    className="w-full bg-surface-container text-body-md px-md py-sm pr-16 rounded-lg border border-outline-variant focus:outline-none focus:ring-2 focus:ring-on-tertiary-container"
                    placeholder='Ask AI: "Tesla Model 3 under $50,000"'
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); /* filtering is reactive */ } }}
                    type="text"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-full bg-gray-900 text-white text-xs font-bold px-2 py-1">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    AI
                  </span>
                </div>
                <button onClick={() => {}} className="bg-surface-container text-primary font-bold px-4 py-2 rounded-lg border border-outline-variant hover:bg-outline-variant transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined">search</span>
                  Search
                </button>
              </div>

              <div className="flex items-end gap-md">
                <button
                  type="button"
                  onClick={() => setMoreOpen((o) => !o)}
                  className="flex items-center gap-xs px-md py-2 rounded-lg border border-outline-variant bg-surface-container hover:bg-outline-variant text-label-md cursor-pointer transition-colors"
                >
                  <span>More Filters</span>
                  <span className="material-symbols-outlined">{moreOpen ? 'expand_less' : 'expand_more'}</span>
                </button>
                <button onClick={resetAll} className="font-label-sm text-label-sm text-on-tertiary-container hover:underline cursor-pointer">
                  Reset
                </button>
              </div>
            </div>

            {moreOpen && (
            <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/20 shadow-ambient">
              <h3 className="font-label-md text-label-md font-bold text-on-surface mb-md">More Filters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
                  <div>
                    <h3 className="font-label-md text-label-md font-bold text-on-surface mb-md">Fuel Type</h3>
                    <div className="space-y-sm">
                      {fuelOptions.map((f) => {
                        const checked = !!fuel[f.value];
                        return (
                          <label key={f.value} className="flex items-center gap-sm cursor-pointer group">
                            <input
                              className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5"
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleFuel(f.value)}
                            />
                            <span className="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">{f.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md font-bold text-on-surface mb-md">Transmission</h3>
                    <div className="space-y-sm">
                      {transmissionOptions.map((t) => (
                        <label key={t.value} className="flex items-center gap-sm cursor-pointer group">
                          <input
                            className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5"
                            type="checkbox"
                            checked={!!transmission[t.value]}
                            onChange={() => toggleTransmission(t.value)}
                          />
                          <span className="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md font-bold text-on-surface mb-md">Engine</h3>
                    <div className="space-y-sm">
                      {engineOptions.map((en) => (
                        <label key={en.value} className="flex items-center gap-sm cursor-pointer group">
                          <input
                            className="rounded border-outline-variant text-primary focus:ring-primary h-5 w-5"
                            type="checkbox"
                            checked={!!engine[en.value]}
                            onChange={() => toggleEngine(en.value)}
                          />
                          <span className="text-body-md text-on-surface-variant group-hover:text-primary transition-colors">{en.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md font-bold text-on-surface mb-md">Features</h3>
                    <div className="flex flex-wrap gap-xs">
                      {featureOptions.map((f) => (
                        <span
                          key={f.value}
                          onClick={() => toggleFeature(f.value)}
                          className={`px-md py-sm rounded-full text-label-sm cursor-pointer transition-all ${
                            !!features[f.value] ? 'bg-primary text-on-primary' : 'bg-surface-container hover:bg-outline-variant'
                          }`}
                        >
                          {f.label}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md font-bold text-on-surface mb-md">Mileage</h3>
                    <select
                      className="w-full rounded-lg border-outline-variant bg-surface-container text-body-md px-md py-sm focus:ring-on-tertiary-container"
                      value={mileageSel}
                      onChange={(e) => setMileageSel(e.target.value)}
                    >
                      <option value="">Any Mileage</option>
                      <option value="10000">&lt; 10,000 mi</option>
                      <option value="30000">&lt; 30,000 mi</option>
                      <option value="50000">&lt; 50,000 mi</option>
                      <option value="100000">&lt; 100,000 mi</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md font-bold text-on-surface mb-md">Make</h3>
                    <select
                      className="w-full rounded-lg border-outline-variant bg-surface-container text-body-md px-md py-sm focus:ring-on-tertiary-container"
                      value={makeSel}
                      onChange={(e) => { setMakeSel(e.target.value); setModelSel(''); setBodySel(''); }}
                    >
                      <option value="">Any Make</option>
                      {makeOptions.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md font-bold text-on-surface mb-md">Model</h3>
                    <select
                      className="w-full rounded-lg border-outline-variant bg-surface-container text-body-md px-md py-sm focus:ring-on-tertiary-container"
                      value={modelSel}
                      onChange={(e) => { setModelSel(e.target.value); setBodySel(''); }}
                    >
                      <option value="">Any Model</option>
                      {modelOptions.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md font-bold text-on-surface mb-md">Body Type</h3>
                    <select
                      className="w-full rounded-lg border-outline-variant bg-surface-container text-body-md px-md py-sm focus:ring-on-tertiary-container"
                      value={bodySel}
                      onChange={(e) => setBodySel(e.target.value)}
                    >
                      <option value="">Any Body</option>
                      {bodyOptions.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md font-bold text-on-surface mb-md">Year</h3>
                    <select
                      className="w-full rounded-lg border-outline-variant bg-surface-container text-body-md px-md py-sm focus:ring-on-tertiary-container"
                      value={yearSel}
                      onChange={(e) => setYearSel(e.target.value)}
                    >
                      <option value="">Any Year</option>
                      {yearOptions.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="mt-md">
                    <button
                      onClick={() => {
                        setFuel({});
                        setTransmission({});
                        setEngine({});
                        setFeatures({});
                        setMileageSel('');
                        setMakeSel('');
                        setModelSel('');
                        setBodySel('');
                        setYearSel('');
                      }}
                      className="text-on-tertiary-container font-label-sm text-label-sm hover:underline cursor-pointer"
                    >
                      Reset advanced filters
                    </button>
                </div>
              </div>
              )}

            {/* Results Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
              <div>
                <h1 className="font-headline-sm text-headline-sm text-primary">Luxury Vehicles</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                  {sorted.length === 0 ? 'No vehicles' : sorted.length} vehicle{sorted.length === 1 ? '' : 's'} found
                </p>
              </div>
               <div className="flex items-center gap-md">
                 <span className="font-label-md text-label-md text-on-surface-variant">Sort By:</span>
                 <select
                   value={sortBy}
                   onChange={(e) => setSortBy(e.target.value)}
                   className="rounded-lg border-outline-variant bg-surface-container text-body-md focus:ring-on-tertiary-container min-w-[180px]"
                 >
                   <option value="relevance">Relevance</option>
                   <option value="newest">Newest Arrivals</option>
                   <option value="price-asc">Price: Low to High</option>
                   <option value="price-desc">Price: High to Low</option>
                   <option value="mileage-asc">Mileage: Low to High</option>
                 </select>
               </div>
            </div>
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-lg">
          {loading ? (
            <div className="lg:col-span-4 text-center py-xl text-on-surface-variant">Loading vehicles...</div>
          ) : sorted.length === 0 ? (
            <div className="lg:col-span-4 text-center py-xl">
              <span className="material-symbols-outlined text-5xl mb-4 text-on-surface-variant">search_off</span>
              {parsedRef.current.dirty ? (
                <>
                  <p className="font-body-lg text-on-surface mb-2">No vehicles found.</p>
                  <p className="font-body-md text-on-surface-variant mb-6">We don't have any cars matching that search in our inventory.</p>
                  <button 
                    onClick={() => {
                      setKeyword('');
                      setMakeSel('');
                      setModelSel('');
                      setBodySel('');
                      setYearSel('');
                      setMileageSel('');
                      setPriceMax(300000);
                      setMinPrice(0);
                      setFuel({});
                      setTransmission({});
                      setEngine({});
                      setFeatures({});
                    }}
                    className="px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-all"
                  >
                    Search again
                  </button>
                </>
              ) : (
                <>
                  <p className="font-body-lg text-on-surface mb-2">No vehicles match your current filters.</p>
                  <p className="font-body-md text-on-surface-variant mb-6">Try broadening your filters or search for something else.</p>
                  <button 
                    onClick={() => {
                      setKeyword('');
                      setMakeSel('');
                      setModelSel('');
                      setBodySel('');
                      setYearSel('');
                      setMileageSel('');
                      setPriceMax(300000);
                      setMinPrice(0);
                      setFuel({});
                      setTransmission({});
                      setEngine({});
                      setFeatures({});
                    }}
                    className="px-6 py-3 bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-all"
                  >
                    Reset filters
                  </button>
                </>
              )}
            </div>
          ) : (
            sorted.slice(0, visibleCount).map((v) => {
              const vehicleId = v.vehicleId || v.id || v.VehicleID;
              return (
                <VehicleCard
                  key={vehicleId}
                  vehicle={v}
                  onClick={(id) => navigate(`/vehicle/${id}`)}
                />
              );
            })
          )}
        </div>

        {sorted.length > visibleCount && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount((c) => c + Math.max(10, Math.ceil(sorted.length * 0.1)))}
              className="px-6 py-3 bg-surface-container border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-outline-variant transition-all"
            >
              Load More ({sorted.length - visibleCount} remaining)
            </button>
          </div>
        )}
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
