import React, { useState, useEffect } from 'react';
import ImageUpload from '../../components/ImageUpload';
import { vehicleApi } from '../../services/vehicleApi';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'https://4peif882l0.execute-api.us-east-1.amazonaws.com/dev';

const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({
    make: '', model: '', year: '', price: '', mileage: '', condition: 'used',
    fuelType: 'gasoline', transmission: 'automatic', color: '', description: '',
    images: [], status: 'available'
  });
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    fetchVehicles();
    fetchSettings();
  }, []);

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
      const data = await vehicleApi.getAll();
      setVehicles(data.items || data || []);
    } catch (error) {
      toast.error('Failed to load vehicles');
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const vehicleData = { ...formData, images: uploadedImages };
      if (editingVehicle) {
        const vehicleId = editingVehicle.vehicleId || editingVehicle.id || editingVehicle.VehicleID;
        await vehicleApi.update(vehicleId, vehicleData);
        toast.success('Vehicle updated');
      } else {
        const newVehicle = await vehicleApi.create(vehicleData);
        toast.success('Vehicle added');
      }
      setShowModal(false);
      setEditingVehicle(null);
      resetForm();
      fetchVehicles();
    } catch (error) {
      toast.error('Operation failed');
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

  const openEditModal = (vehicle) => {
    console.log('Editing vehicle:', vehicle);
    setEditingVehicle(vehicle);
    setFormData(vehicle);
    setUploadedImages(vehicle.images || []);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      make: '', model: '', year: '', price: '', mileage: '', condition: 'used',
      fuelType: 'gasoline', transmission: 'automatic', color: '', description: '',
      images: [], status: 'available'
    });
    setUploadedImages([]);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Vehicle Management</h1>
        <button onClick={() => { resetForm(); setShowModal(true); }} className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg">
          + Add Vehicle
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
      ) : (
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Vehicle</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.vehicleId || vehicle.id || vehicle.VehicleID} className="hover:bg-slate-800/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          {(vehicle.images?.[0] || vehicle.imageUrl) && (
                            <img src={vehicle.images?.[0] || vehicle.imageUrl} alt="" className="w-12 h-12 rounded object-cover" />
                          )}
                          <div>
                            <div className="text-white font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                            <div className="text-sm text-slate-400">{vehicle.mileage} miles • {vehicle.condition}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-white">${vehicle.price?.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <select value={vehicle.status} onChange={(e) => handleStatusChange(vehicle.vehicleId || vehicle.id || vehicle.VehicleID, e.target.value)} className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-white text-sm">
                          <option value="available">Available</option>
                          <option value="sold">Sold</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => openEditModal(vehicle)} className="text-brand-500 hover:text-brand-400 mr-4">View/Edit</button>
                        <button onClick={() => handleDelete(vehicle.vehicleId || vehicle.id || vehicle.VehicleID)} className="text-red-500 hover:text-red-400">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-xl border border-slate-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{editingVehicle ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
              <button onClick={() => { setShowModal(false); setEditingVehicle(null); }} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Make</label>
                  {settings.makes?.length > 0 ? (
                    <select value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                      <option value="">Select Make</option>
                      {settings.makes.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Model</label>
                  <input type="text" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Year</label>
                  <input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Price</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Mileage</label>
                  <input type="number" value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: e.target.value})} required className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
                  {settings.colors?.length > 0 ? (
                    <select value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                      <option value="">Select Color</option>
                      {settings.colors.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Body Type</label>
                  {settings.bodyTypes?.length > 0 ? (
                    <select value={formData.bodyType} onChange={(e) => setFormData({...formData, bodyType: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                      <option value="">Select Body Type</option>
                      {settings.bodyTypes.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={formData.bodyType} onChange={(e) => setFormData({...formData, bodyType: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Condition</label>
                  {settings.conditions?.length > 0 ? (
                    <select value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                      {settings.conditions.map((opt, i) => <option key={i} value={opt.toLowerCase()}>{opt}</option>)}
                    </select>
                  ) : (
                    <select value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                      <option value="new">New</option>
                      <option value="used">Used</option>
                      <option value="certified">Certified</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Transmission</label>
                  {settings.transmissions?.length > 0 ? (
                    <select value={formData.transmission} onChange={(e) => setFormData({...formData, transmission: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                      {settings.transmissions.map((opt, i) => <option key={i} value={opt.toLowerCase()}>{opt}</option>)}
                    </select>
                  ) : (
                    <select value={formData.transmission} onChange={(e) => setFormData({...formData, transmission: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Fuel Type</label>
                  {settings.fuelTypes?.length > 0 ? (
                    <select value={formData.fuelType} onChange={(e) => setFormData({...formData, fuelType: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                      {settings.fuelTypes.map((opt, i) => <option key={i} value={opt.toLowerCase()}>{opt}</option>)}
                    </select>
                  ) : (
                    <select value={formData.fuelType} onChange={(e) => setFormData({...formData, fuelType: e.target.value})} className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
                      <option value="gasoline">Gasoline</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="electric">Electric</option>
                    </select>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Images</label>
                <ImageUpload 
                  vehicleId={editingVehicle?.id || `temp-${Date.now()}`} 
                  onUploadComplete={(url) => setUploadedImages([...uploadedImages, url])} 
                />
                {uploadedImages.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {uploadedImages.map((url, idx) => (
                      <div key={idx} className="relative">
                        <img src={url} alt="" className="w-20 h-20 object-cover rounded border border-slate-700" />
                        <button type="button" onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditingVehicle(null); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg">{editingVehicle ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleManagement;
