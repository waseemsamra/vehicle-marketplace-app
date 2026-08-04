import React, { useState, useEffect } from 'react';
import { useVehicleApi } from '../hooks/useVehicleApi';
import { useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import VehicleFilters from './VehicleFilters';
import VehicleCard from '../components/VehicleCard';

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
                  <VehicleCard
                    key={vehicleId}
                    vehicle={vehicle}
                    variant="detailed"
                    onClick={(id) => {
                      sessionStorage.setItem('scrollPosition', window.pageYOffset);
                      navigate(`/vehicle/${id}`);
                    }}
                  />
                );
              })}
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
