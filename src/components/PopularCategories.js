import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || 'https://4peif882l0.execute-api.us-east-1.amazonaws.com/dev';

const PopularCategories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (activeCategory) {
      fetchVehiclesByCategory(activeCategory);
    }
  }, [activeCategory]);

  const fetchMetadata = async () => {
    try {
      const response = await fetch(`${API_URL}/vehicles/metadata`);
      if (response.ok) {
        const data = await response.json();
        const bodyTypes = data.bodyTypes || [];
        setCategories(bodyTypes);
        if (bodyTypes.length > 0) {
          setActiveCategory(bodyTypes[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch metadata:', error);
    }
  };

  const fetchVehiclesByCategory = async (category) => {
    try {
      const params = new URLSearchParams({ limit: '9', bodyType: category });
      const response = await fetch(`${API_URL}/vehicles?${params}`);
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
    }
  };

  return (
    <section className="bg-white py-12 px-8 md:px-12">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Popular categories</h2>

        <div className="relative mb-10">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}>
            <style>{`
              .flex.overflow-x-auto::-webkit-scrollbar { display: none; }
            `}</style>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all snap-start ${
                  activeCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <div className="flex flex-col justify-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">All {activeCategory}s</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">Experience the best way to search cars</p>
            <button onClick={() => navigate(`/vehicles?bodyType=${activeCategory}`)} className="text-gray-900 font-semibold text-lg text-left hover:underline">
              Buy Cars
            </button>
          </div>

          {vehicles.slice(0, 9).map((vehicle) => (
            <div
              key={vehicle.vehicleId}
              onClick={() => navigate(`/vehicle/${vehicle.vehicleId}`)}
              className="group cursor-pointer transform hover:-translate-y-1 transition-transform"
            >
              <div className="aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-50">
                {vehicle.images?.[0] ? (
                  <img
                    src={vehicle.images[0]}
                    alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                )}
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h4>
              <button className="text-gray-900 font-semibold hover:underline">Shop now</button>
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="lg:hidden overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch', touchAction: 'pan-x' }}>
          <style>{`
            .lg\:hidden.overflow-x-auto::-webkit-scrollbar { display: none; }
          `}</style>
          <div className="flex gap-4" style={{ width: 'max-content' }}>
            <div className="flex flex-col justify-center w-80 flex-shrink-0 snap-start">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">All {activeCategory}s</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">Experience the best way to search cars</p>
              <button onClick={() => navigate(`/vehicles?bodyType=${activeCategory}`)} className="text-gray-900 font-semibold text-lg text-left hover:underline">
                Buy Cars
              </button>
            </div>

            {vehicles.slice(0, 9).map((vehicle) => (
              <div
                key={vehicle.vehicleId}
                onClick={() => navigate(`/vehicle/${vehicle.vehicleId}`)}
                className="group cursor-pointer w-80 flex-shrink-0 snap-start"
              >
                <div className="aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-50">
                  {vehicle.images?.[0] ? (
                    <img
                      src={vehicle.images[0]}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                  )}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h4>
                <button className="text-gray-900 font-semibold hover:underline">Shop now</button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-center gap-6">
          <button onClick={() => navigate(`/vehicles?bodyType=${activeCategory}`)} className="text-gray-900 font-semibold text-base underline underline-offset-4 hover:text-gray-600 transition-colors">
            See more {activeCategory.toLowerCase()} cars
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <button onClick={() => navigate('/vehicles')} className="text-gray-900 font-semibold text-base underline underline-offset-4 hover:text-gray-600 transition-colors">
            Shop all cars
          </button>
        </div>
    </section>
  );
};

export default PopularCategories;
