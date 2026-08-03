import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { vehicleApi } from '../../services/vehicleApi';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const VehicleManagement = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    fetchVehicles();
    fetchSettings();
  }, [page]);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data || {});
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const data = await vehicleApi.getAll(offset, limit);
      setVehicles(data.items || []);
      setTotalCount(data.totalCount || 0);
      setHasMore(data.hasMore || false);
    } catch (error) {
      toast.error('Failed to load vehicles');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    try {
      await vehicleApi.delete(id);
      toast.success('Vehicle deleted');
      fetchVehicles();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await vehicleApi.updateStatus(id, status);
      toast.success('Status updated');
      fetchVehicles();
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Management</h1>
        <button onClick={() => navigate('/admin/vehicles/new')} className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded-lg">
          + Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
      ) : (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Vehicle</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.vehicleId || vehicle.id || vehicle.VehicleID} className="hover:bg-gray-100/50">
                       <td className="px-6 py-4">
                         <div className="flex items-center space-x-3">
                           {(vehicle.images?.[0] || vehicle.img || vehicle.imageUrl) && (
                             <img src={vehicle.images?.[0] || vehicle.img || vehicle.imageUrl} alt="" className="w-12 h-12 rounded object-cover" />
                           )}
                           <div>
                             <div className="text-gray-900 font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                             <div className="text-sm text-gray-500">{vehicle.mileage} miles • {vehicle.condition}</div>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-4 text-gray-900">${vehicle.price?.toLocaleString()}</td>
                       <td className="px-6 py-4">
                         <select value={vehicle.status} onChange={(e) => handleStatusChange(vehicle.vehicleId || vehicle.id || vehicle.VehicleID, e.target.value)} className="px-3 py-1 bg-gray-100 border border-gray-300 rounded text-gray-900 text-sm">
                           <option value="available">Available</option>
                           <option value="sold">Sold</option>
                           <option value="pending">Pending</option>
                         </select>
                       </td>
                       <td className="px-6 py-4">
                         <button onClick={() => navigate(`/admin/vehicles/${vehicle.vehicleId || vehicle.id || vehicle.VehicleID}/edit`)} className="text-brand-500 hover:text-brand-400 mr-4">View/Edit</button>
                         <button onClick={() => handleDelete(vehicle.vehicleId || vehicle.id || vehicle.VehicleID)} className="text-red-500 hover:text-red-700">Delete</button>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
              {totalCount > 0 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, totalCount)} of {totalCount} vehicles
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">Page {page}</span>
                    <button
                      onClick={() => setPage((p) => p + 1)}
                      disabled={!hasMore}
                      className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
    </div>
  );
};

export default VehicleManagement;

