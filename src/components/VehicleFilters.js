import React, { useState } from 'react';

const VehicleFilters = ({ onFilter, onReset }) => {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    minMileage: '',
    maxMileage: '',
    transmission: '',
    color: '',
    bodyType: '',
    engineType: '',
    fuelType: '',
    province: '',
    city: '',
    trustedCars: false,
    hasPictures: false,
    hasVideo: false
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleApply = () => {
    const activeFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== '' && value !== false) {
        acc[key] = value;
      }
      return acc;
    }, {});
    onFilter(activeFilters);
  };

  const handleReset = () => {
    setFilters({
      make: '', model: '', minPrice: '', maxPrice: '', minYear: '', maxYear: '',
      minMileage: '', maxMileage: '', transmission: '', color: '', bodyType: '',
      engineType: '', fuelType: '', province: '', city: '', trustedCars: false,
      hasPictures: false, hasVideo: false
    });
    onReset();
  };

  const activeCount = Object.values(filters).filter(v => v !== '' && v !== false).length;

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="w-full md:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        Filters {activeCount > 0 && `(${activeCount})`}
      </button>

      {showFilters && (
        <div className="mt-4 bg-slate-900 rounded-xl border border-slate-800 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Make</label>
              <input
                type="text"
                value={filters.make}
                onChange={(e) => handleChange('make', e.target.value)}
                placeholder="e.g., Toyota"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Model</label>
              <input
                type="text"
                value={filters.model}
                onChange={(e) => handleChange('model', e.target.value)}
                placeholder="e.g., Camry"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleChange('minPrice', e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleChange('maxPrice', e.target.value)}
                placeholder="100000"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Min Year</label>
              <input
                type="number"
                value={filters.minYear}
                onChange={(e) => handleChange('minYear', e.target.value)}
                placeholder="2000"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Max Year</label>
              <input
                type="number"
                value={filters.maxYear}
                onChange={(e) => handleChange('maxYear', e.target.value)}
                placeholder="2024"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Max Mileage</label>
              <input
                type="number"
                value={filters.maxMileage}
                onChange={(e) => handleChange('maxMileage', e.target.value)}
                placeholder="100000"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Transmission</label>
              <select
                value={filters.transmission}
                onChange={(e) => handleChange('transmission', e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              >
                <option value="">All</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Body Type</label>
              <select
                value={filters.bodyType}
                onChange={(e) => handleChange('bodyType', e.target.value)}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              >
                <option value="">All</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Truck">Truck</option>
                <option value="Coupe">Coupe</option>
                <option value="Hatchback">Hatchback</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
              <input
                type="text"
                value={filters.color}
                onChange={(e) => handleChange('color', e.target.value)}
                placeholder="e.g., Black"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Province</label>
              <input
                type="text"
                value={filters.province}
                onChange={(e) => handleChange('province', e.target.value)}
                placeholder="e.g., FL"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">City</label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="e.g., Miami"
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.trustedCars}
                onChange={(e) => handleChange('trustedCars', e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-brand-600 focus:ring-brand-500"
              />
              <span>Trusted Cars Only</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasPictures}
                onChange={(e) => handleChange('hasPictures', e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-brand-600 focus:ring-brand-500"
              />
              <span>Has Pictures</span>
            </label>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.hasVideo}
                onChange={(e) => handleChange('hasVideo', e.target.checked)}
                className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-brand-600 focus:ring-brand-500"
              />
              <span>Has Video</span>
            </label>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleApply}
              className="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-semibold transition-all"
            >
              Apply Filters
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleFilters;
