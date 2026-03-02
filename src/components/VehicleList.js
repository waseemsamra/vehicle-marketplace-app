import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleApi } from '../services/vehicleApi';

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const data = await vehicleApi.getAll();
      setVehicles(data.items || data || []);
    } catch (error) {
      console.error('Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white">Loading vehicles...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Featured Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div 
              key={vehicle.vehicleId || vehicle.id || vehicle.VehicleID}
              onClick={() => navigate(`/vehicle/${vehicle.vehicleId || vehicle.id || vehicle.VehicleID}`)}
              className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-brand-500 transition-all cursor-pointer"
            >
              {vehicle.images && vehicle.images[0] ? (
                <img src={vehicle.images[0]} alt={`${vehicle.make} ${vehicle.model}`} className="w-full h-48 object-cover" />
              ) : (
                <div className="w-full h-48 bg-slate-800 flex items-center justify-center text-slate-600">No Image</div>
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{vehicle.year} {vehicle.make} {vehicle.model}</h3>
                <p className="text-slate-400 text-sm mb-4">{vehicle.mileage?.toLocaleString()} miles • {vehicle.condition}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-brand-500">${vehicle.price?.toLocaleString()}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    vehicle.status === 'available' ? 'bg-green-500/20 text-green-400' :
                    vehicle.status === 'sold' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {vehicle.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VehicleList;
