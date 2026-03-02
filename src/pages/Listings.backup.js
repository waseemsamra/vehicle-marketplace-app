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

  const fetchMetadata = async () => {
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
  };

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
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    if (key === 'make') newFilters.model = '';
    setFilters(newFilters);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
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
                  <div key={vehicle.vehicleId} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow group flex flex-col md:flex-row md:h-56">
                    <div className="relative w-full md:w-64 h-48 md:h-full bg-gray-100 flex-shrink-0 overflow-hidden">
                      {vehicle.images?.[0] ? (
                        <img src={vehicle.images[0]} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-brand-500 text-white text-xs font-bold rounded-full uppercase">{vehicle.condition || 'Used'}</span>
                      </div>
                    </div>
                    <div className="flex-1 p-3 md:p-6 flex flex-col">
                      <h3 className="text-base md:text-xl font-bold text-gray-800 mb-1 md:mb-2">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                      <p className="text-lg md:text-xl font-bold text-brand-500 mb-2 md:mb-4">${vehicle.price?.toLocaleString()}</p>
                      <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-gray-700 mb-2 md:mb-4">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                          <span>{vehicle.mileage?.toLocaleString()} miles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                          <span>{vehicle.transmission || 'Automatic'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          <span>{vehicle.fuelType || 'Gasoline'}</span>
                        </div>
                        {vehicle.color && (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
                            <span>{vehicle.color}</span>
                          </div>
                        )}
                      </div>
                      {vehicle.description && <p className="text-gray-700 text-xs md:text-sm leading-relaxed flex-1 overflow-hidden line-clamp-2">{vehicle.description}</p>}
                    </div>
                    <div className="w-full md:w-40 p-3 md:p-4 flex items-center justify-center border-t md:border-t-0 md:border-l border-gray-200">
                      <div className="flex flex-row md:flex-col gap-2 w-full">
                        <button className="bg-white hover:bg-gray-50 text-gray-800 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium border border-gray-300 transition-all">
                          Show Number
                        </button>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all flex items-center gap-1 justify-center">
                          <svg className="w-3 md:w-4 h-3 md:h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                          </svg>
                          WhatsApp
                        </button>
                        <button onClick={() => navigate(`/vehicle/${vehicle.vehicleId}`)} className="bg-brand-600 hover:bg-brand-500 text-white px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-all">
                          View Details
                        </button>
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
