import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ImageUpload from '../../components/ImageUpload';
import { vehicleApi } from '../../services/vehicleApi';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const VehicleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [settings, setSettings] = useState({});
  const [makes, setMakes] = useState([]);
  const [models, setModels] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  const [colors, setColors] = useState([]);
  const [bodyTypes, setBodyTypes] = useState([]);
  const [engineTypes, setEngineTypes] = useState([]);
  const [engineCapacities, setEngineCapacities] = useState([]);
  const [assemblies, setAssemblies] = useState([]);
  const [doors, setDoors] = useState([]);
  const [seatingCapacities, setSeatingCapacities] = useState([]);
  const [modelCategories, setModelCategories] = useState([]);

  const [formData, setFormData] = useState({
    make: '', model: '', year: '', price: '', mileage: '', condition: 'used',
    fuelType: 'gasoline', transmission: 'automatic', color: '', description: '',
    images: [], status: 'available', bodyType: '', engineType: '', engineCapacity: '',
    assembly: '', door: '', seatingCapacity: '', modelCategory: ''
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
    if (isEdit) {
      fetchVehicle();
    }
  }, [id]);

  const fetchSettings = async () => {
    try {
      const [settingsRes, makesRes, modelsRes, transmissionsRes, colorsRes, bodyTypesRes, engineTypesRes, engineCapacitiesRes, assembliesRes, doorsRes, seatingCapacitiesRes, modelCategoriesRes] = await Promise.all([
        fetch(`${API_URL}/settings`),
        fetch(`${API_URL}/makes`),
        fetch(`${API_URL}/models`),
        fetch(`${API_URL}/transmissions`),
        fetch(`${API_URL}/colors`),
        fetch(`${API_URL}/body-types`),
        fetch(`${API_URL}/engine-types`),
        fetch(`${API_URL}/engine-capacities`),
        fetch(`${API_URL}/assemblies`),
        fetch(`${API_URL}/doors`),
        fetch(`${API_URL}/seating-capacities`),
        fetch(`${API_URL}/model-categories`),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setSettings(data || {});
      }
      if (makesRes.ok) setMakes(await makesRes.json());
      if (modelsRes.ok) setModels(await modelsRes.json());
      if (transmissionsRes.ok) setTransmissions(await transmissionsRes.json());
      if (colorsRes.ok) setColors(await colorsRes.json());
      if (bodyTypesRes.ok) setBodyTypes(await bodyTypesRes.json());
      if (engineTypesRes.ok) setEngineTypes(await engineTypesRes.json());
      if (engineCapacitiesRes.ok) setEngineCapacities(await engineCapacitiesRes.json());
      if (assembliesRes.ok) setAssemblies(await assembliesRes.json());
      if (doorsRes.ok) setDoors(await doorsRes.json());
      if (seatingCapacitiesRes.ok) setSeatingCapacities(await seatingCapacitiesRes.json());
      if (modelCategoriesRes.ok) setModelCategories(await modelCategoriesRes.json());
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      const data = await vehicleApi.getById(id);
      setFormData({
        make: data.make || '',
        model: data.model || '',
        year: data.year || '',
        price: data.price || '',
        mileage: data.mileage || '',
        condition: data.condition || 'used',
        fuelType: data.fuelType || 'gasoline',
        transmission: data.transmission || 'automatic',
        color: data.color || '',
        description: data.description || '',
        images: data.images || [],
        status: data.status || 'available'
      });
      setUploadedImages(data.images || []);
    } catch (error) {
      toast.error('Failed to load vehicle');
      navigate('/admin/vehicles');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const vehicleData = { ...formData, images: uploadedImages };
      if (isEdit) {
        await vehicleApi.update(id, vehicleData);
        toast.success('Vehicle updated');
      } else {
        await vehicleApi.create(vehicleData);
        toast.success('Vehicle added');
      }
      navigate('/admin/vehicles');
    } catch (error) {
      console.error('Vehicle submit error:', error);
      toast.error(error.message || 'Operation failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{isEdit ? 'Edit Vehicle' : 'Add Vehicle'}</h1>
        <button onClick={() => navigate('/admin/vehicles')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg">
          Back to List
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Make</label>
              <select value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value, model: ''})} required className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                <option value="">Select Make</option>
                {makes.map((m) => <option key={m._id || m.makeId} value={m.makeName}>{m.makeName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Model</label>
              <select value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} required className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900" disabled={!formData.make}>
                <option value="">Select Model</option>
                {models.filter(m => m.brandName === formData.make).map((m) => <option key={m._id || m.modelId} value={m.modelName}>{m.modelName}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Year</label>
              <input type="number" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Price</label>
              <input type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Mileage</label>
              <input type="number" value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: e.target.value})} required className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Color</label>
              {settings.colors?.length > 0 ? (
                <select value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                  <option value="">Select Color</option>
                  {settings.colors.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input type="text" value={formData.color} onChange={(e) => setFormData({...formData, color: e.target.value})} className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Body Type</label>
              {settings.bodyTypes?.length > 0 ? (
                <select value={formData.bodyType} onChange={(e) => setFormData({...formData, bodyType: e.target.value})} className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                  <option value="">Select Body Type</option>
                  {settings.bodyTypes.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                </select>
              ) : (
                <input type="text" value={formData.bodyType} onChange={(e) => setFormData({...formData, bodyType: e.target.value})} className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Condition</label>
              {settings.conditions?.length > 0 ? (
                <select value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                  {settings.conditions.map((opt, i) => <option key={i} value={opt.toLowerCase()}>{opt}</option>)}
                </select>
              ) : (
                <select value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                  <option value="new">New</option>
                  <option value="used">Used</option>
                  <option value="certified">Certified</option>
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Transmission</label>
              {settings.transmissions?.length > 0 ? (
                <select value={formData.transmission} onChange={(e) => setFormData({...formData, transmission: e.target.value})} className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                  {settings.transmissions.map((opt, i) => <option key={i} value={opt.toLowerCase()}>{opt}</option>)}
                </select>
              ) : (
                <select value={formData.transmission} onChange={(e) => setFormData({...formData, transmission: e.target.value})} className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Fuel Type</label>
              {settings.fuelTypes?.length > 0 ? (
                <select value={formData.fuelType} onChange={(e) => setFormData({...formData, fuelType: e.target.value})} className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                  {settings.fuelTypes.map((opt, i) => <option key={i} value={opt.toLowerCase()}>{opt}</option>)}
                </select>
              ) : (
                <select value={formData.fuelType} onChange={(e) => setFormData({...formData, fuelType: e.target.value})} className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900">
                  <option value="gasoline">Gasoline</option>
                  <option value="diesel">Diesel</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="electric">Electric</option>
                </select>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Description</label>
            <textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} rows="3" className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Images (max 5)</label>
            <ImageUpload
              vehicleId={id || `temp-${Date.now()}`}
              onUploadComplete={(url) => setUploadedImages([...uploadedImages, url])}
              maxFiles={5}
            />
            {uploadedImages.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {uploadedImages.map((url, idx) => (
                  <div key={idx} className="relative">
                    <img src={url} alt="" className="w-20 h-20 object-cover rounded border border-gray-300" />
                    <button type="button" onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== idx))} className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs">×</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={() => navigate('/admin/vehicles')} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded-lg disabled:opacity-50">
              {saving ? 'Saving...' : (isEdit ? 'Update' : 'Add')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
