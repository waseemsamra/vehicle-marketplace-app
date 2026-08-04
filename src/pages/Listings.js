import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://4peif882l0.execute-api.us-east-1.amazonaws.com/dev';

const Listings = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [metadata, setMetadata] = useState({ makes: [], models: {}, colors: [], transmissions: [], fuelTypes: [], bodyTypes: [] });
  const [filters, setFilters] = useState(() => ({
    make: searchParams.get('make') || '',
    model: searchParams.get('model') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    transmission: searchParams.get('transmission') || '',
    fuelType: searchParams.get('fuelType') || '',
    bodyType: searchParams.get('bodyType') || '',
    color: searchParams.get('color') || '',
    maxMileage: searchParams.get('maxMileage') || '',
    keyword: searchParams.get('keyword') || ''
  }));
  const [sortBy, setSortBy] = useState('newest');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const searchRef = useRef(null);

  const fetchMetadata = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/vehicles/metadata`);
      if (response.ok) {
        const data = await response.json();
        setMetadata(data);
      } else {
        const settingsRes = await fetch(`${API_URL}/settings`);
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setMetadata({
            makes: settings.makes || [],
            models: {},
            colors: settings.colors || [],
            transmissions: settings.transmissions || [],
            fuelTypes: settings.fuelTypes || [],
            bodyTypes: settings.bodyTypes || []
          });
        }
      }
    } catch (error) {
      console.error('Failed to load metadata:', error);
    }
  }, []);

  const fetchFilteredVehicles = useCallback(async (pageNum, reset) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: '80', offset: String((pageNum - 1) * 80) });
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const response = await fetch(`${API_URL}/vehicles?${params}`);
      if (response.ok) {
        const data = await response.json();
        const newVehicles = data.vehicles || data.items || data || [];
        setVehicles(reset ? newVehicles : newVehicles);
        setTotalCount(data.totalCount || data.count || newVehicles.length);
        setHasMore(data.hasMore || false);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMetadata();
    fetchFilteredVehicles(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newFilters = {
      make: searchParams.get('make') || '',
      model: searchParams.get('model') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      minYear: searchParams.get('minYear') || '',
      maxYear: searchParams.get('maxYear') || '',
      transmission: searchParams.get('transmission') || '',
      fuelType: searchParams.get('fuelType') || '',
      bodyType: searchParams.get('bodyType') || '',
      color: searchParams.get('color') || '',
      maxMileage: searchParams.get('maxMileage') || '',
      keyword: searchParams.get('keyword') || ''
    };
    setFilters(newFilters);
  }, [searchParams]);

  useEffect(() => {
    setVehicles([]);
    setTotalCount(0);
    setHasMore(true);
    fetchFilteredVehicles(1, true);
  }, [filters, fetchFilteredVehicles]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    if (key === 'make') newFilters.model = '';
    setFilters(newFilters);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchFilteredVehicles(newPage, true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextPage = () => {
    if (hasMore) {
      const newPage = page + 1;
      setPage(newPage);
      fetchFilteredVehicles(newPage, true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const totalPages = Math.max(1, Math.ceil((totalCount || vehicles.length) / 80));
  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, Math.min(page - 4, totalPages - 9));
    const end = Math.min(totalPages, start + 9);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const availableModels = filters.make && metadata.models[filters.make] ? metadata.models[filters.make] : [];

  const clearFilters = () => {
    setFilters({
      make: '', model: '', minPrice: '', maxPrice: '', minYear: '', maxYear: '',
      transmission: '', fuelType: '', bodyType: '', color: '', maxMileage: '', keyword: ''
    });
  };

  const activeFilterCount = Object.values(filters).filter(v => v).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (value) => {
    handleFilterChange('keyword', value);
    if (value.length >= 2) {
      const lowerValue = value.toLowerCase();
      const matchedMakes = metadata.makes.filter(m => m.toLowerCase().includes(lowerValue)).slice(0, 5);
      const matchedModels = Object.entries(metadata.models).flatMap(([make, models]) => 
        models.filter(model => model.toLowerCase().includes(lowerValue)).map(model => `${make} ${model}`)
      ).slice(0, 5);
      setSuggestions([...matchedMakes, ...matchedModels].slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    handleFilterChange('keyword', suggestion);
    setShowSuggestions(false);
  };

  const sortedVehicles = [...vehicles].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return (a.price || 0) - (b.price || 0);
      case 'price-high': return (b.price || 0) - (a.price || 0);
      case 'year-new': return (b.year || 0) - (a.year || 0);
      case 'year-old': return (a.year || 0) - (b.year || 0);
      case 'mileage-low': return (a.mileage || 0) - (b.mileage || 0);
      default: return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-2 md:px-4 py-4 md:py-8">
        <div className="flex gap-6">
          {/* Filter Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-white transform transition-transform duration-300 ${
            showFilters ? 'translate-x-0' : '-translate-x-full'
          } flex-shrink-0 overflow-y-auto shadow-2xl pt-20`}>
            {/* Overlay */}
            {showFilters && (
              <div
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-black/50 -z-10"
              ></div>
            )}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Filters</h2>
                <div className="flex items-center gap-2">
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="text-sm text-brand-500 hover:text-brand-600">
                      Clear All ({activeFilterCount})
                    </button>
                  )}
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                  <select value={filters.make} onChange={(e) => handleFilterChange('make', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent">
                    <option value="">All Makes</option>
                    {metadata.makes?.map((make, i) => <option key={i} value={make}>{make}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                  <select value={filters.model} onChange={(e) => handleFilterChange('model', e.target.value)} disabled={!filters.make} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed">
                    <option value="">All Models</option>
                    {availableModels.map((model, i) => <option key={i} value={model}>{model}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => handleFilterChange('minPrice', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm" />
                    <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => handleFilterChange('maxPrice', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" placeholder="Min" value={filters.minYear} onChange={(e) => handleFilterChange('minYear', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm" />
                    <input type="number" placeholder="Max" value={filters.maxYear} onChange={(e) => handleFilterChange('maxYear', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Body Type</label>
                  <select value={filters.bodyType} onChange={(e) => handleFilterChange('bodyType', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm">
                    <option value="">All Types</option>
                    {metadata.bodyTypes?.map((type, i) => <option key={i} value={type}>{type}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Transmission</label>
                  <select value={filters.transmission} onChange={(e) => handleFilterChange('transmission', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm">
                    <option value="">All</option>
                    {metadata.transmissions?.map((trans, i) => <option key={i} value={trans}>{trans}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Type</label>
                  <select value={filters.fuelType} onChange={(e) => handleFilterChange('fuelType', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm">
                    <option value="">All</option>
                    {metadata.fuelTypes?.map((fuel, i) => <option key={i} value={fuel}>{fuel}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                  <select value={filters.color} onChange={(e) => handleFilterChange('color', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm">
                    <option value="">All Colors</option>
                    {metadata.colors?.map((color, i) => <option key={i} value={color}>{color}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Mileage</label>
                  <input type="number" placeholder="e.g., 50000" value={filters.maxMileage} onChange={(e) => handleFilterChange('maxMileage', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm" />
                </div>

              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="mb-6 relative" ref={searchRef}>
              <input
                type="text"
                placeholder="Search by make, model, or keyword..."
                value={filters.keyword}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => filters.keyword.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                  {suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-900 border-b border-gray-100 last:border-b-0"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white border border-gray-300 text-gray-700 px-2 md:px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium flex items-center gap-1.5 hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </button>
              <h1 className="text-lg md:text-2xl font-bold text-gray-900">{totalCount || vehicles.length} Vehicles</h1>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-2 md:px-4 py-1.5 md:py-2 bg-white border border-gray-300 rounded-lg text-gray-900 shadow-sm text-xs md:text-base">
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="year-new">Year: Newest</option>
                <option value="year-old">Year: Oldest</option>
                <option value="mileage-low">Mileage: Lowest</option>
              </select>
            </div>
            {loading && vehicles.length === 0 ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden flex animate-pulse">
                    <div className="w-80 h-56 bg-gray-200 flex-shrink-0"></div>
                    <div className="flex-1 p-6">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="flex gap-4 mb-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedVehicles.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                <p className="text-gray-500">No vehicles found matching your filters</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedVehicles.map((vehicle) => (
                  <div key={vehicle.vehicleId || vehicle.id || vehicle._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 w-full">
                    <div className="flex gap-6">
                      {/* Image Section */}
                      <div className="relative w-80 h-56 flex-shrink-0">
                        <img 
                          src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80'} 
                          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                          className="w-full h-full object-cover rounded-xl"
                        />
                        
                        <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md uppercase">
                          {vehicle.condition || 'USED'}
                        </div>
                        
                        {vehicle.images?.length > 0 && (
                          <div className="absolute bottom-3 left-3 bg-black/60 text-white text-sm px-2.5 py-1.5 rounded-md flex items-center gap-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                              <circle cx="8.5" cy="8.5" r="1.5"></circle>
                              <polyline points="21 15 16 10 5 21"></polyline>
                            </svg>
                            <span>{vehicle.images.length}</span>
                          </div>
                        )}
                        
                        <button className="absolute top-3 right-3 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-md transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                        </button>
                      </div>

                      {/* Details Section */}
                      <div className="flex-1 py-1">
                        <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h2>
                        
                        <div className="flex items-center gap-4 mb-3">
                          <span className="text-blue-600 text-xl font-semibold">
                            {vehicle.price ? `$${vehicle.price.toLocaleString()}` : 'Call for price'}
                          </span>
                          {vehicle.dealType && (
                            <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-sm font-medium">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                              </svg>
                              {vehicle.dealType}
                            </div>
                          )}
                        </div>
                        
                        {vehicle.description && (
                          <p className="text-gray-600 text-base mb-4 line-clamp-2">
                            {vehicle.description}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-6 mb-4 text-gray-700">
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                              <line x1="16" y1="2" x2="16" y2="6"></line>
                              <line x1="8" y1="2" x2="8" y2="6"></line>
                              <line x1="3" y1="10" x2="21" y2="10"></line>
                            </svg>
                            <span>{vehicle.year}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                            <span>{vehicle.mileage?.toLocaleString() || 0} KM</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                              <polyline points="14 2 14 8 20 8"></polyline>
                            </svg>
                            <span>{vehicle.fuelType || 'Gasoline'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"></circle>
                              <line x1="12" y1="8" x2="12" y2="12"></line>
                              <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span>{vehicle.transmission || 'Automatic'}</span>
                          </div>
                        </div>
                        
                        {vehicle.location && (
                          <div className="flex items-center gap-2 text-gray-700 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                              <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                            <span>{typeof vehicle.location === 'string' ? vehicle.location : vehicle.location?.city || ''}</span>
                          </div>
                        )}
                        
                        {vehicle.canExport && (
                          <div className="inline-flex items-center bg-slate-500 text-white text-sm font-medium px-4 py-2 rounded-lg">
                            Can Be Exported
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="w-56 flex-shrink-0 flex flex-col gap-3 py-1">
                        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                          Show Number
                        </button>
                        
                        <button className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          WhatsApp
                        </button>
                        
                        <button 
                          onClick={() => navigate(`/vehicle/${vehicle.vehicleId || vehicle.id || vehicle._id}`)}
                          className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </svg>
                          View details
                        </button>
                        
                        {vehicle.dealerName && (
                          <div className="mt-4 flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold text-center leading-tight p-2 border-4 border-red-600">
                              {vehicle.dealerName}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {sortedVehicles.length > 0 && totalPages > 1 && (
              <div className="mt-6 md:mt-8 flex justify-center items-center gap-1 md:gap-2 flex-wrap">
                <button onClick={handlePrevPage} disabled={page === 1} className="px-2 md:px-4 py-1.5 md:py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-xs md:text-base">
                  Previous
                </button>
                {getPageNumbers().map(num => (
                  <button key={num} onClick={() => { setPage(num); fetchFilteredVehicles(num, true); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className={`px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-base ${page === num ? 'bg-brand-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    {num}
                  </button>
                ))}
                <button onClick={handleNextPage} disabled={page >= totalPages} className="px-2 md:px-4 py-1.5 md:py-2 bg-brand-600 text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-500 text-xs md:text-base">
                  Next
                </button>
              </div>
            )}
            {loading && sortedVehicles.length > 0 && (
              <div className="mt-8 text-center">
                <div className="text-sm text-gray-500">Loading more...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listings;
