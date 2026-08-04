import React, { useState, useEffect } from 'react';
import { useVehicleApi } from '../hooks/useVehicleApi';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import VehicleFilters from './VehicleFilters';

const CustomerManagement = ({ searchParams }) => {
  const {
    vehicles,
    loading,
    error,
    hasMore,
    fetchVehicles,
    searchVehicles,
    filterVehicles,
    loadMore,
    refresh,
  } = useVehicleApi();

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVehicles(true);
    const savedPosition = sessionStorage.getItem('scrollPosition');
    if (savedPosition) {
      setTimeout(() => {
        window.scrollTo(0, parseInt(savedPosition));
        sessionStorage.removeItem('scrollPosition');
      }, 100);
    }
  }, []);

  useEffect(() => {
    if (searchParams?.query || searchParams?.brand) {
      const query = [searchParams.query, searchParams.brand].filter(Boolean).join(' ');
      searchVehicles(query);
    }
  }, [searchParams]);

  const handleFilter = (filters) => {
    filterVehicles(filters);
  };

  const handleResetFilters = () => {
    refresh();
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.trim()) {
      searchVehicles(query);
    } else {
      refresh();
    }
  };

  return (
    <section id="listings" className="py-24 bg-gray-50 relative">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900">
              Featured <span className="text-gradient">Listings</span>
            </h2>
            <p className="text-gray-600 text-lg">Hand-picked premium vehicles available now</p>
          </div>
          <button 
            onClick={refresh}
            className="mt-6 md:mt-0 flex items-center space-x-2 text-brand-500 hover:text-brand-400 font-semibold transition-colors group"
          >
            <span>View All Cars</span>
            <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <VehicleFilters onFilter={handleFilter} onReset={handleResetFilters} />

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400">
            {error}
          </div>
        )}

        {loading && vehicles.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400">Loading vehicles...</p>
          </div>
        )}

        {!loading && vehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">No vehicles found</p>
          </div>
        )}

        {vehicles.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vehicles.map((vehicle) => {
                const vehicleId = vehicle.vehicleId || vehicle.id || vehicle._id;
                return (
                  <div
                    key={vehicleId}
                    onClick={() => {
                      sessionStorage.setItem('scrollPosition', window.pageYOffset);
                      navigate(`/vehicle/${vehicleId}`);
                    }}
                    className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-brand-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/10 cursor-pointer"
                  >
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {vehicle.images?.[0] || vehicle.imageUrl ? (
                      <img 
                        src={vehicle.images?.[0] || vehicle.imageUrl} 
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-brand-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full uppercase">
                        {vehicle.condition || vehicle.status || 'Available'}
                      </span>
                    </div>
                    {vehicle.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-accent-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                          FEATURED
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {vehicle.trim && `${vehicle.trim} • `}
                          {vehicle.bodyType || 'Sedan'}
                          {vehicle.mileage && ` • ${vehicle.mileage.toLocaleString()} mi`}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-brand-500">
                          ${vehicle.price?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 mt-4 py-4 border-t border-gray-200">
                      <div className="flex items-center space-x-1 text-gray-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span>{vehicle.fuelType || 'Gas'}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600 text-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span>{vehicle.transmission || 'Auto'}</span>
                      </div>
                      {vehicle.color && (
                        <div className="flex items-center space-x-1 text-gray-600 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                          <span>{vehicle.color}</span>
                        </div>
                      )}
                    </div>

                    <button className="w-full mt-4 py-3 rounded-xl bg-gray-100 hover:bg-brand-600 text-gray-900 hover:text-white font-semibold transition-all duration-300 flex items-center justify-center space-x-2 group-hover:bg-brand-600 group-hover:text-white">
                      <span>View Details</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CustomerManagement;
