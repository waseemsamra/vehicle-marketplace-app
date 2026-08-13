import React, { useMemo } from 'react';

const resolveApiImageUrl = (url) => {
  if (!url || typeof url !== 'string') return url;
  if (url.includes('localhost:5001')) {
    return url.replace(/http:\/\/localhost:5001\/api\//, '/api/');
  }
  if (url.includes('vehicle-marketplace-app.vercel.app/api/images/')) {
    return url.replace('vehicle-marketplace-app.vercel.app/api/images/', 'vehicle-marketplace-app.onrender.com/api/images/');
  }
  return url;
};

const VehicleCard = ({ vehicle, onClick, onEdit, onDelete, variant = 'default', className = '' }) => {
  const vehicleId = vehicle.vehicleId || vehicle.id || vehicle._id;
  const uploadedImg = resolveApiImageUrl(vehicle.coverImage || vehicle.images?.[0] || '');
  const legacyImg = resolveApiImageUrl(vehicle.img || vehicle.imageUrl || '');
  const imgSrc = uploadedImg || legacyImg || '';
  const title = vehicle.title || `${vehicle.year || ''} ${vehicle.make || ''} ${vehicle.model || ''}`.trim() || 'Vehicle';
  const price = vehicle.price || (vehicle.priceNum ? `$${vehicle.priceNum.toLocaleString()}` : '');
  const status = vehicle.status || (vehicle.condition || 'Available');
  const miles = vehicle.mileage ? `${vehicle.mileage.toLocaleString()} miles` : (vehicle.sub || '');
  const sub = vehicle.sub || '';

  const cacheBustedSrc = useMemo(() => {
    if (!imgSrc) return imgSrc;
    const sep = imgSrc.includes('?') ? '&' : '?';
    return `${imgSrc}${sep}_cb=${Date.now()}`;
  }, [imgSrc]);

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  const handleClick = (e) => {
    if (onClick) {
      e.stopPropagation();
      onClick(vehicleId);
    }
  };

  if (variant === 'compact') {
    return (
      <div key={vehicleId} onClick={() => onClick?.(vehicleId)} className={`group cursor-pointer transform hover:-translate-y-1 transition-transform ${className}`}>
        <div className="aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-50">
          {imgSrc ? (
            <img
              src={cacheBustedSrc}
              alt={`${title} front 3/4 view`}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        {onClick && <button className="text-gray-900 font-semibold hover:underline">Shop now</button>}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div key={vehicleId} onClick={() => onClick?.(vehicleId)} className={`group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-brand-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/10 cursor-pointer ${className}`}>
        <div className="relative h-64 overflow-hidden bg-gray-100">
          {imgSrc ? (
            <img
              src={cacheBustedSrc}
              alt={`${title} front 3/4 view`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              onError={handleImageError}
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
              {status}
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
              <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
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
    );
  }

  const cardClasses = `group bg-white rounded-xl overflow-hidden vehicle-card-shadow border border-surface-container hover:border-primary-fixed-dim transition-all group-hover:translate-y-[-4px] group-hover:shadow-xl cursor-pointer ${className}`;

  return (
    <div key={vehicleId} className={cardClasses} onClick={() => onClick?.(vehicleId)}>
      <div className="relative h-48 overflow-hidden">
        {imgSrc ? (
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            alt={`${title} front 3/4 view`}
            src={cacheBustedSrc}
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        )}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: status === 'Reserved' ? '#f59e0b' : '#22c55e' }}></span>
          <span className="font-label-md text-label-md text-on-surface">{status}</span>
        </div>
        {onClick && (
          <button onClick={(e) => e.stopPropagation()} className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors">
            <span className="material-symbols-outlined text-sm">favorite</span>
          </button>
        )}
      </div>
      <div className="p-md">
        <h3 className="font-headline-sm text-headline-sm text-primary mb-1">{title}</h3>
        <div className="flex items-center gap-2 mb-4">
          <span className="font-label-md text-label-md text-secondary">{miles}</span>
          {sub && (
            <>
              <span className="text-outline-variant text-xs">•</span>
              <span className="font-label-md text-label-md text-secondary">{sub}</span>
            </>
          )}
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="font-headline-sm text-headline-sm text-on-tertiary-container">{price}</span>
          {variant === 'admin' && onEdit && onDelete ? (
            <div className="flex gap-2">
              {onEdit && (
                <button onClick={(e) => { e.stopPropagation(); onEdit(vehicle); }} className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
                  Edit
                </button>
              )}
              {onDelete && (
                <button onClick={(e) => { e.stopPropagation(); onDelete(vehicleId); }} className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors">
                  Delete
                </button>
              )}
            </div>
          ) : (
            onClick && (
              <button onClick={handleClick} className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity">
                View Details
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
