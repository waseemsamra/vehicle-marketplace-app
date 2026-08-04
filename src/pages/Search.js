import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { vehicleApi } from '../services/vehicleApi';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [favorited, setFavorited] = useState({});

  const [allVehicles, setAllVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);

  const [keyword, setKeyword] = useState('');
  const [makeSel, setMakeSel] = useState('');
  const [modelSel, setModelSel] = useState('');
  const [bodySel, setBodySel] = useState('');
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(300000);
  const [yearSel, setYearSel] = useState('');
  const [mileageSel, setMileageSel] = useState('');

  const [moreOpen, setMoreOpen] = useState(false);
  const [fuel, setFuel] = useState({});
  const [transmission, setTransmission] = useState({});
  const [engine, setEngine] = useState({});
  const [features, setFeatures] = useState({});

  const barRef = useRef(null);
  const [barOffset, setBarOffset] = useState(96);
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const update = () => setBarOffset(96 + el.offsetHeight);
    update();
  }, [moreOpen]);

  useEffect(() => {
    document.title = 'Carssourcing | Premium Vehicle Inventory';
  }, []);

  useEffect(() => {
    const make = searchParams.get('make') || '';
    const model = searchParams.get('model') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    if (make) setMakeSel(make);
    if (model) setModelSel(model);
    if (maxPrice) setPriceMax(Number(maxPrice));
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
    let make = '';
    let model = '';
    let cleaned = lower;

    const priceMatch = lower.match(/(?:under|below|less\s+than|upto|up\s+to|max|maximum)\s+\$?([\d,]+)/i);
    if (priceMatch) {
      maxPrice = Number(priceMatch[1].replace(/,/g, ''));
      cleaned = cleaned.replace(priceMatch[0], '');
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

    const noiseWords = new Set(['enquire', 'search', 'find', 'show', 'me', 'cars', 'car', 'usd', 'dollars', 'dollar', 'for', 'sale', 'in', 'at', 'the', 'a', 'an', 'under', 'below', 'less', 'than', 'upto', 'up', 'to', 'max', 'maximum']);
    const keyword = cleaned.split(/\s+/).filter(w => w && !noiseWords.has(w)).join(' ');
    return { keyword, make, model, maxPrice };
  };

  const parsedRef = React.useRef({ keyword: '', make: '', model: '', maxPrice: 300000, dirty: false });

  useEffect(() => {
    const keyword = searchParams.get('keyword') || '';
    if (!keyword) return;

    const parsed = parseSearchQuery(keyword, makes, models);
    if (parsed.keyword !== parsedRef.current.keyword || parsed.make !== parsedRef.current.make || 
        parsed.model !== parsedRef.current.model || parsed.maxPrice !== parsedRef.current.maxPrice) {
      parsedRef.current = parsed;
      parsedRef.current.dirty = true;
      if (parsed.keyword) setKeyword(parsed.keyword);
      if (parsed.make) setMakeSel(parsed.make);
      if (parsed.model) setModelSel(parsed.model);
      if (parsed.maxPrice < 300000) setPriceMax(parsed.maxPrice);
    }
  }, [searchParams, makes, models]);

  const toggleFav = (id) => setFavorited((f) => ({ ...f, [id]: !f[id] }));
  const toggleMulti = (setter) => (key) => setter((x) => ({ ...x, [key]: !x[key] }));
  const toggleFuel = toggleMulti(setFuel);
  const toggleTransmission = toggleMulti(setTransmission);
  const toggleEngine = toggleMulti(setEngine);
  const toggleFeature = toggleMulti(setFeatures);

  const makeOptions = makes.map((m) => ({ value: m.makeName, label: m.makeName }));

  const modelOptions = useMemo(() => {
    const makeName = makeSel;
    const vehicleModels = new Set(allVehicles.map((v) => v.model).filter(Boolean));
    return models
      .filter((m) => !makeName || m.brandName === makeName)
      .filter((m) => vehicleModels.has(m.modelName))
      .map((m) => ({ value: m.modelName, label: m.modelName }));
  }, [models, makeSel, allVehicles]);

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

  const advancedCount =
    Object.keys(fuel).filter((k) => fuel[k]).length +
    Object.keys(transmission).filter((k) => transmission[k]).length +
    Object.keys(engine).filter((k) => engine[k]).length +
    Object.keys(features).filter((k) => features[k]).length +
    Object.keys(modelSel).filter((k) => modelSel[k]).length;

  const filtered = useMemo(() => {
    return allVehicles.filter((v) => {
      if (keyword) {
        const words = keyword.toLowerCase().split(/\s+/).filter(Boolean);
        const haystack = `${v.make} ${v.model} ${v.title}`.toLowerCase();
        if (!words.some(word => haystack.includes(word))) return false;
      }
      if (makeSel && v.make !== makeSel) return false;
      if (modelSel && v.model !== modelSel) return false;
      if (bodySel && v.body !== bodySel) return false;
      if (v.priceNum > priceMax) return false;
      if (priceMin && v.priceNum < priceMin) return false;
      if (yearSel && String(v.year) !== yearSel) return false;
      if (mileageSel && v.mileage > Number(mileageSel)) return false;

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
    priceMin,
    priceMax,
    yearSel,
    mileageSel,
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
    setPriceMin(0);
    setPriceMax(300000);
    setYearSel('');
    setMileageSel('');
    setFuel({});
    setTransmission({});
    setEngine({});
    setFeatures({});
  };

  return (
    <div className="bg-background text-on-background min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-md shadow-sm h-20 flex items-center">
        <div className="flex justify-between items-center w-full max-w-max-width mx-auto px-margin-desktop">
          <div className="flex items-center gap-xl">
            <span className="font-headline-md text-headline-md font-bold text-primary text-3xl">Carssourcing</span>
            <div className="hidden md:flex gap-lg">
              <a className="font-label-md text-label-md text-on-tertiary-container border-b-2 border-on-tertiary-container cursor-pointer" href="/">Inventory</a>
              <a className="font-label-md text-label-md text-secondary hover:text-primary transition-colors cursor-pointer" href="/search">Sell</a>
              <a className="font-label-md text-label-md text-secondary hover:text-primary transition-colors cursor-pointer" href="#finance">Finance</a>
              <a className="font-label-md text-label-md text-secondary hover:text-primary transition-colors cursor-pointer" href="#reviews">Research</a>
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

      {/* Page Layout: results + grid (filter bar is fixed above) */}
      <div className="px-margin-desktop mb-xl">
        {/* Spacer clears the fixed header + fixed filter bar so content isn't hidden */}
        <div className="h-24" style={{ height: `${barOffset}px` }} aria-hidden="true" />

        {/* Top toolbar: filter bar + drawer (fixed below header; mirrors Home's fixed header) */}
        <div ref={barRef} className="fixed top-20 left-0 right-0 z-40 bg-surface-container-lowest border-b border-outline-variant/20">
          <div className="px-margin-desktop space-y-md">
            <div className="flex flex-wrap items-end gap-md bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/20 shadow-ambient">
              <div className="flex flex-col gap-xs min-w-[220px] flex-1">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Search</label>
                <input
                  className="w-full rounded-lg border-outline-variant bg-surface-container text-body-md px-md py-sm focus:ring-on-tertiary-container focus:border-on-tertiary-container"
                  placeholder="Make, model, keyword..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-xs min-w-[150px]">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Make</label>
                <select
                  className="w-full rounded-lg border-outline-variant bg-surface-container text-body-md px-md py-sm focus:ring-on-tertiary-container"
                  value={makeSel}
                  onChange={(e) => { setMakeSel(e.target.value); setModelSel(''); setBodySel(''); }}
                >
                  <option value="">Any Make</option>
                  {makeOptions.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-xs min-w-[150px]">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Model</label>
                <select
                  className="w-full rounded-lg border-outline-variant bg-surface-container text-body-md px-md py-sm focus:ring-on-tertiary-container"
                  value={modelSel}
                  onChange={(e) => { setModelSel(e.target.value); setBodySel(''); }}
                >
                  <option value="">Any Model</option>
                  {modelOptions.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-xs min-w-[140px]">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Body Type</label>
                <select
                  className="w-full rounded-lg border-outline-variant bg-surface-container text-body-md px-md py-sm focus:ring-on-tertiary-container"
                  value={bodySel}
                  onChange={(e) => setBodySel(e.target.value)}
                >
                  <option value="">Any Body</option>
                  {bodyOptions.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-xs min-w-[180px]">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Price Max</label>
                <input
                  className="w-full h-1 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                  type="range"
                  min="0"
                  max="300000"
                  step="5000"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                />
                <span className="text-right text-label-sm text-on-surface-variant">${priceMax.toLocaleString()}</span>
              </div>

              <div className="flex flex-col gap-xs min-w-[130px]">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Year</label>
                <select
                  className="w-full rounded-lg border-outline-variant bg-surface-container text-body-md px-md py-sm focus:ring-on-tertiary-container"
                  value={yearSel}
                  onChange={(e) => setYearSel({ [e.target.value]: e.target.value ? true : false })}
                >
                  <option value="">Any Year</option>
                  {yearOptions.map((y) => <option key={y.value} value={y.value}>{y.label}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-xs min-w-[160px]">
                <label className="font-label-sm text-label-sm text-on-surface-variant">Mileage</label>
                <select
                  className="w-full rounded-lg border-outline-variant bg-surface-container text-body-md px-md py-sm focus:ring-on-tertiary-container"
                  value={mileageSel}
                  onChange={(e) => setMileageSel({ [e.target.value]: e.target.value ? true : false })}
                >
                  <option value="">Any Mileage</option>
                  <option value="10000">&lt; 10,000 mi</option>
                  <option value="30000">&lt; 30,000 mi</option>
                  <option value="50000">&lt; 50,000 mi</option>
                  <option value="100000">&lt; 100,000 mi</option>
                </select>
              </div>

              <div className="flex items-end gap-md">
                <button
                  type="button"
                  onClick={() => setMoreOpen((o) => !o)}
                  className="flex items-center gap-xs px-md py-2 rounded-lg border border-outline-variant bg-surface-container hover:bg-outline-variant text-label-md text-label-md cursor-pointer transition-colors"
                >
                  <span>More Filters</span>
                  <span className="material-symbols-outlined">{moreOpen ? 'expand_less' : 'expand_more'}</span>
                  {advancedCount > 0 && (
                    <span className="w-5 h-5 flex items-center justify-center text-xs bg-primary text-on-primary rounded-full">{advancedCount}</span>
                  )}
                </button>
                <button onClick={resetAll} className="font-label-sm text-label-sm text-on-tertiary-container hover:underline cursor-pointer">
                  Reset
                </button>
              </div>
            </div>

            {/* More Filters drawer */}
            {moreOpen && (
              <div className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant/20 shadow-ambient">
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
                </div>
                <div className="mt-md">
                  <button
                    onClick={() => {
                      setFuel({});
                      setTransmission({});
                      setEngine({});
                      setFeatures({});
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
                  {filtered.length === 0 ? 'No vehicles' : filtered.length} vehicle{filtered.length === 1 ? '' : 's'} found
                </p>
              </div>
              <div className="flex items-center gap-md">
                <span className="font-label-md text-label-md text-on-surface-variant">Sort By:</span>
                <select className="rounded-lg border-outline-variant bg-surface-container text-body-md focus:ring-on-tertiary-container min-w-[180px]">
                  <option>Relevance</option>
                  <option>Newest Arrivals</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Mileage: Low to High</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-lg">
          {loading ? (
            <div className="lg:col-span-4 text-center py-xl text-on-surface-variant">Loading vehicles...</div>
          ) : filtered.length === 0 ? (
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
                      setPriceMin(0);
                      setPriceMax(300000);
                      setYearSel('');
                      setMileageSel('');
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
                      setPriceMin(0);
                      setPriceMax(300000);
                      setYearSel('');
                      setMileageSel('');
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
            filtered.map((v) => {
              const vehicleId = v.vehicleId || v.id || v.VehicleID;
              const imgSrc = v.images?.[0] || v.img || v.imageUrl || '/image/hero.jpg';
              const title = v.title || `${v.year || ''} ${v.make || ''} ${v.model || ''}`.trim() || 'Vehicle';
              const price = v.price || (v.priceNum ? `$${v.priceNum.toLocaleString()}` : '');
              const sub = v.sub || '';
              return (
                <div
                  key={vehicleId || title}
                  onClick={() => navigate(`/vehicle/${vehicleId}`)}
                  className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-ambient border border-outline-variant/20 hover:shadow-lg transition-all duration-300 cursor-zoom-in"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={title} src={imgSrc} />
                    <div className="absolute top-md left-md flex gap-xs">
                      {(v.badges || []).map((b) => (
                        <span key={b.text || b} className={`text-label-sm px-md py-1 rounded-full font-bold ${typeof b === 'string' ? 'bg-surface-container text-on-surface' : b.cls || ''}`}>{typeof b === 'string' ? b : b.text}</span>
                      ))}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFav(vehicleId);
                      }}
                      className="absolute top-md right-md w-10 h-10 bg-white/20 glass-effect rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary transition-all"
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: favorited[vehicleId] ? "'FILL' 1" : "'FILL' 0", color: favorited[vehicleId] ? '#ef4444' : 'inherit' }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>
                  <div className="p-md space-y-md">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-headline-sm text-headline-sm text-primary">{title}</h3>
                        <span className="font-headline-sm text-headline-sm text-on-tertiary-container">{price}</span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant">{sub}</p>
                    </div>
                    <div className="flex gap-sm border-y border-outline-variant/30 py-md">
                      {(v.specs || []).map(([icon, label], idx) => (
                        <div key={idx} className="flex items-center gap-xs text-on-surface-variant text-label-md">
                          <span className="material-symbols-outlined">{icon}</span>
                          {label}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-md">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/vehicle/${vehicleId}`);
                        }}
                        className="flex-1 bg-primary text-on-primary font-label-md text-label-md py-3 rounded-lg hover:opacity-90 transition-all"
                      >
                        View Details
                      </button>
                      <button className="px-md border border-outline-variant rounded-lg hover:border-primary hover:text-primary transition-all">
                        <span className="material-symbols-outlined">chat</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
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
