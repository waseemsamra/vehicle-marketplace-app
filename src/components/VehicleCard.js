import React from 'react';

const VehicleCard = ({ vehicle, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 w-full">
      <div className="flex gap-6">
        {/* Image Section */}
        <div className="relative w-80 h-56 flex-shrink-0">
          <img 
            src={vehicle.images?.[0] || vehicle.image || 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80'} 
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover rounded-xl"
          />
          
          <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md">
            {vehicle.condition || 'FEATURED'}
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
              ${vehicle.price?.toLocaleString() || 'Call for price'}
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
                <path d="M21.54 15H17a2 2 0 0 0-2 2v4.54"></path>
                <path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17"></path>
                <path d="M11 21.95V18a2 2 0 0 0-2-2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              <span>{vehicle.mileage?.toLocaleString() || 0} KM</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>{vehicle.fuelType || 'Gasoline'}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v4"></path>
                <path d="m16.2 7.8 2.9-2.9"></path>
                <path d="M18 12h4"></path>
                <path d="m16.2 16.2 2.9 2.9"></path>
                <path d="M12 18v4"></path>
                <path d="m4.9 19.1 2.9-2.9"></path>
                <path d="M2 12h4"></path>
                <path d="m4.9 4.9 2.9 2.9"></path>
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
              <span>{vehicle.location}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-56 flex-shrink-0 flex flex-col gap-3 py-1">
          <button 
            onClick={() => onEdit(vehicle)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Edit
          </button>
          
          <button 
            onClick={() => onDelete(vehicle.vehicleId || vehicle.id)}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Delete
          </button>
          
          <button className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            View details
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
