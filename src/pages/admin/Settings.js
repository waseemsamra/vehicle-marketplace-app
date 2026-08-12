import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5001/api').replace(/\/$/, '');
const TOKEN_KEY = 'authToken';

const CATEGORIES = [
  { id: 'cities', label: 'City', icon: '📍' },
  { id: 'provinces', label: 'Province', icon: '🗺️' },
  { id: 'makes', label: 'Make', icon: '🚗' },
  { id: 'models', label: 'Model', icon: '🏎️' },
  { id: 'transmissions', label: 'Transmission', icon: '⚙️' },
  { id: 'colors', label: 'Color', icon: '🎨' },
  { id: 'engineTypes', label: 'Engine Type', icon: '🔧' },
  { id: 'engineCapacities', label: 'Engine Capacity (cc)', icon: '🧮' },
  { id: 'assembly', label: 'Assembly', icon: '🏭' },
  { id: 'bodyTypes', label: 'Body Type', icon: '🚙' },
  { id: 'doors', label: 'Number of Doors', icon: '🚪' },
  { id: 'seatingCapacity', label: 'Seating Capacity', icon: '🪑' },
  { id: 'modelCategory', label: 'Model Category', icon: '🏷️' },
];

const STORAGE_KEY = 'vehicleAttributes';

const readStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeStorage = (data) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

const authHeaders = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const generateCityId = (cityName) => {
  const clean = (cityName || '').trim();
  if (!clean) return '';
  const prefix = clean
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();
  const suffix = String(Math.floor(Math.random() * 900) + 1).padStart(3, '0');
  return `${prefix}-${suffix}`;
};

const Settings = () => {
  const [activeCategory, setActiveCategory] = useState('cities');
  const [options, setOptions] = useState(() => readStorage());
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ value: '', label: '', order: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [provinces, setProvinces] = useState([]);
  const [bulkText, setBulkText] = useState('');
  const [bulkLoading, setBulkLoading] = useState(false);

  const isProvinceCategory = activeCategory === 'provinces';
  const isCityCategory = activeCategory === 'cities';
  const isMakeCategory = activeCategory === 'makes';
  const isModelCategory = activeCategory === 'models';

  const loadOptions = useCallback(async () => {
    setLoading(true);
    try {
      if (isProvinceCategory) {
        const res = await fetch(`${API_URL}/provinces`, {
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((item) => ({
            _id: item._id,
            provinceId: item.provinceId,
            provinceName: item.provinceName,
            label: item.provinceName,
            value: item.provinceId,
            order: 0,
          }));
          setOptions({ provinces: mapped });
          writeStorage({ provinces: mapped });
        } else {
          throw new Error('API error');
        }
      } else if (isCityCategory) {
        const res = await fetch(`${API_URL}/cities`, {
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((item) => ({
            _id: item._id,
            cityId: item.cityId,
            cityName: item.cityName,
            provinceId: item.provinceId,
            provinceName: item.provinceName,
            label: item.cityName,
            value: item.cityId,
            order: 0,
          }));
          setOptions({ cities: mapped });
          writeStorage({ cities: mapped });
        } else {
          throw new Error('API error');
        }
      } else if (isMakeCategory) {
        const res = await fetch(`${API_URL}/makes`, {
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = data.map((item) => ({
            _id: item._id,
            makeId: item.makeId,
            makeName: item.makeName,
            label: item.makeName,
            value: item.makeId,
            order: 0,
          }));
          setOptions({ makes: mapped });
          writeStorage({ makes: mapped });
        } else {
          throw new Error('API error');
        }
      } else if (isModelCategory) {
        const [modelsRes, makesRes] = await Promise.all([
          fetch(`${API_URL}/models`, {
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
          }),
          fetch(`${API_URL}/makes`, {
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
          }),
        ]);

        if (modelsRes.ok) {
          const data = await modelsRes.json();
          const mapped = data.map((item) => ({
            _id: item._id,
            modelId: item.modelId,
            modelName: item.modelName,
            brandId: item.brandId,
            brandName: item.brandName,
            label: item.modelName,
            value: item.modelId,
            order: 0,
          }));
          const newOptions = { models: mapped };
          if (makesRes.ok) {
            const makesData = await makesRes.json();
            const makesMapped = makesData.map((item) => ({
              _id: item._id,
              makeId: item.makeId,
              makeName: item.makeName,
              label: item.makeName,
              value: item.makeId,
              order: 0,
            }));
            newOptions.makes = makesMapped;
          }
          setOptions(newOptions);
          writeStorage(newOptions);
        } else {
          throw new Error('API error');
        }
      } else {
        const res = await fetch(`${API_URL}/vehicle-attributes?category=${encodeURIComponent(activeCategory)}`, {
          headers: { 'Content-Type': 'application/json', ...authHeaders() },
        });
        if (res.ok) {
          const data = await res.json();
          const grouped = {};
          data.forEach((item) => {
            if (!grouped[item.category]) grouped[item.category] = [];
            grouped[item.category].push(item);
          });
          const merged = { ...readStorage(), ...grouped };
          setOptions(merged);
          writeStorage(merged);
        } else {
          throw new Error('API error');
        }
      }
    } catch {
      const stored = readStorage();
      setOptions(stored);
    } finally {
      setLoading(false);
    }
  }, [activeCategory, isProvinceCategory, isCityCategory, isMakeCategory, isModelCategory]);

  useEffect(() => {
    loadOptions();
  }, [activeCategory, loadOptions]);

  const loadProvinces = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/provinces`, {
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
      });
      if (res.ok) {
        const data = await res.json();
        setProvinces(data);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    loadProvinces();
  }, [loadProvinces]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentOptions = options[activeCategory] || [];

      if (isProvinceCategory) {
        const payload = {
          provinceId: formData.value,
          provinceName: formData.label || formData.value,
        };

        let updated;
        if (editingId) {
          const res = await fetch(`${API_URL}/provinces/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Update failed');
          updated = await res.json();
          const newOptions = {
            ...options,
            [activeCategory]: currentOptions.map((o) =>
              o._id === editingId
                ? { _id: updated._id, provinceId: updated.provinceId, provinceName: updated.provinceName, label: updated.provinceName, value: updated.provinceId, order: 0 }
                : o
            ),
          };
          setOptions(newOptions);
          writeStorage(newOptions);
          toast.success('Province updated');
        } else {
          const res = await fetch(`${API_URL}/provinces`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Create failed');
          const created = await res.json();
          const newOptions = {
            ...options,
            [activeCategory]: [
              ...currentOptions,
              { _id: created._id, provinceId: created.provinceId, provinceName: created.provinceName, label: created.provinceName, value: created.provinceId, order: 0 },
            ],
          };
          setOptions(newOptions);
          writeStorage(newOptions);
          toast.success('Province added');
        }
      } else if (isCityCategory) {
        const payload = {
          cityId: formData.value,
          cityName: formData.label || formData.value,
          provinceId: formData.provinceId,
          provinceName: formData.provinceName,
        };

        let updated;
        if (editingId) {
          const res = await fetch(`${API_URL}/cities/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Update failed');
          updated = await res.json();
          const newOptions = {
            ...options,
            [activeCategory]: currentOptions.map((o) =>
              o._id === editingId
                ? { _id: updated._id, cityId: updated.cityId, cityName: updated.cityName, provinceId: updated.provinceId, provinceName: updated.provinceName, label: updated.cityName, value: updated.cityId, order: 0 }
                : o
            ),
          };
          setOptions(newOptions);
          writeStorage(newOptions);
          toast.success('City updated');
        } else {
          const res = await fetch(`${API_URL}/cities`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Create failed');
          const created = await res.json();
          const newOptions = {
            ...options,
            [activeCategory]: [
              ...currentOptions,
              { _id: created._id, cityId: created.cityId, cityName: created.cityName, provinceId: created.provinceId, provinceName: created.provinceName, label: created.cityName, value: created.cityId, order: 0 },
            ],
          };
          setOptions(newOptions);
          writeStorage(newOptions);
          toast.success('City added');
        }
      } else if (isMakeCategory) {
        const payload = {
          makeId: formData.value,
          makeName: formData.label || formData.value,
        };

        let updated;
        if (editingId) {
          const res = await fetch(`${API_URL}/makes/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Update failed');
          updated = await res.json();
          const newOptions = {
            ...options,
            [activeCategory]: currentOptions.map((o) =>
              o._id === editingId
                ? { _id: updated._id, makeId: updated.makeId, makeName: updated.makeName, label: updated.makeName, value: updated.makeId, order: 0 }
                : o
            ),
          };
          setOptions(newOptions);
          writeStorage(newOptions);
          toast.success('Make updated');
        } else {
          const res = await fetch(`${API_URL}/makes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Create failed');
          const created = await res.json();
          const newOptions = {
            ...options,
            [activeCategory]: [
              ...currentOptions,
              { _id: created._id, makeId: created.makeId, makeName: created.makeName, label: created.makeName, value: created.makeId, order: 0 },
            ],
          };
          setOptions(newOptions);
          writeStorage(newOptions);
          toast.success('Make added');
        }
      } else if (isModelCategory) {
        const payload = {
          modelId: formData.value,
          modelName: formData.label || formData.value,
          brandId: formData.brandId,
          brandName: formData.brandName,
        };

        let updated;
        if (editingId) {
          const res = await fetch(`${API_URL}/models/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Update failed');
          updated = await res.json();
          const newOptions = {
            ...options,
            [activeCategory]: currentOptions.map((o) =>
              o._id === editingId
                ? { _id: updated._id, modelId: updated.modelId, modelName: updated.modelName, brandId: updated.brandId, brandName: updated.brandName, label: updated.modelName, value: updated.modelId, order: 0 }
                : o
            ),
          };
          setOptions(newOptions);
          writeStorage(newOptions);
          toast.success('Model updated');
        } else {
          const res = await fetch(`${API_URL}/models`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Create failed');
          const created = await res.json();
          const newOptions = {
            ...options,
            [activeCategory]: [
              ...currentOptions,
              { _id: created._id, modelId: created.modelId, modelName: created.modelName, brandId: created.brandId, brandName: created.brandName, label: created.modelName, value: created.modelId, order: 0 },
            ],
          };
          setOptions(newOptions);
          writeStorage(newOptions);
          toast.success('Model added');
        }
      } else {
        const payload = {
          category: activeCategory,
          label: formData.label || formData.value,
          value: formData.value,
          order: formData.order ?? 0,
        };

        let updated;
        if (editingId) {
          const res = await fetch(`${API_URL}/vehicle-attributes/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Update failed');
          updated = await res.json();
          const newOptions = {
            ...options,
            [activeCategory]: currentOptions.map((o) =>
              o._id === editingId
                ? { label: updated.label || updated.value, value: updated.value, order: updated.order ?? 0, _id: updated._id }
                : o
            ),
          };
          setOptions(newOptions);
          writeStorage(newOptions);
          toast.success('Option updated');
        } else {
          const res = await fetch(`${API_URL}/vehicle-attributes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...authHeaders() },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error('Create failed');
          const created = await res.json();
          const newOptions = {
            ...options,
            [activeCategory]: [
              ...currentOptions,
              { label: created.label || created.value, value: created.value, order: created.order ?? 0, _id: created._id },
            ],
          };
          setOptions(newOptions);
          writeStorage(newOptions);
          toast.success('Option added');
        }
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const generateMakeId = (makeName) => {
    const clean = (makeName || '').trim().toUpperCase();
    if (!clean) return '';
    const parts = clean.split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 3);
    return parts.map((w) => w[0]).join('').slice(0, 3);
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!bulkText.trim()) {
      toast.error('Please enter at least one make name');
      return;
    }

    const names = bulkText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (!names.length) {
      toast.error('No valid make names found');
      return;
    }

    const items = names.map((name) => ({
      makeId: generateMakeId(name),
      makeName: name,
    }));

    setBulkLoading(true);
    try {
      const res = await fetch(`${API_URL}/makes/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(items),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Bulk add failed');

      toast.success(`Added ${data.count || items.length} makes`);
      setBulkText('');
      setShowBulkModal(false);
      await loadOptions();
    } catch (error) {
      toast.error(error.message || 'Bulk add failed');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleDelete = async (option) => {
    if (!window.confirm('Delete this option?')) return;
    try {
      const id = option._id;
      if (isProvinceCategory) {
        const res = await fetch(`${API_URL}/provinces/${id}`, {
          method: 'DELETE',
          headers: { ...authHeaders() },
        });
        if (!res.ok) throw new Error('Delete failed');
      } else if (isCityCategory) {
        const res = await fetch(`${API_URL}/cities/${id}`, {
          method: 'DELETE',
          headers: { ...authHeaders() },
        });
        if (!res.ok) throw new Error('Delete failed');
      } else if (isMakeCategory) {
        const res = await fetch(`${API_URL}/makes/${id}`, {
          method: 'DELETE',
          headers: { ...authHeaders() },
        });
        if (!res.ok) throw new Error('Delete failed');
      } else if (isModelCategory) {
        const res = await fetch(`${API_URL}/models/${id}`, {
          method: 'DELETE',
          headers: { ...authHeaders() },
        });
        if (!res.ok) throw new Error('Delete failed');
      } else {
        const res = await fetch(`${API_URL}/vehicle-attributes/${id}`, {
          method: 'DELETE',
          headers: { ...authHeaders() },
        });
        if (!res.ok) throw new Error('Delete failed');
      }
      const currentOptions = options[activeCategory] || [];
      const newOptions = { ...options, [activeCategory]: currentOptions.filter((o) => o._id !== id) };
      setOptions(newOptions);
      writeStorage(newOptions);
      toast.success('Deleted');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (option) => {
    setEditingId(option._id);
    if (isProvinceCategory) {
      setFormData({ value: option.provinceId || option.value, label: option.provinceName || option.label || '', order: 0, brandId: '', brandName: '' });
    } else if (isCityCategory) {
      setFormData({
        value: option.cityId || option.value,
        label: option.cityName || option.label || '',
        order: 0,
        provinceId: option.provinceId || '',
        provinceName: option.provinceName || '',
        brandId: '',
        brandName: '',
      });
    } else if (isMakeCategory) {
      setFormData({ value: option.makeId || option.value, label: option.makeName || option.label || '', order: 0, brandId: '', brandName: '' });
    } else if (isModelCategory) {
      setFormData({
        value: option.modelId || option.value,
        label: option.modelName || option.label || '',
        order: 0,
        brandId: option.brandId || '',
        brandName: option.brandName || '',
        provinceId: '',
        provinceName: '',
      });
    } else {
      setFormData({ value: option.value, label: option.label || option.value, order: option.order ?? 0, brandId: '', brandName: '' });
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ value: '', label: '', order: 0, provinceId: '', provinceName: '', brandId: '', brandName: '' });
    setEditingId(null);
  };

  const currentOptions = options[activeCategory] || [];
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredOptions = isProvinceCategory
    ? currentOptions.filter((option) => {
        const label = (option.label || '').toLowerCase();
        const value = (option.value || '').toLowerCase();
        return label.includes(normalizedQuery) || value.includes(normalizedQuery);
      })
    : isMakeCategory
      ? currentOptions.filter((option) => {
          const label = (option.label || '').toLowerCase();
          const value = (option.value || '').toLowerCase();
          return label.includes(normalizedQuery) || value.includes(normalizedQuery);
        })
      : isModelCategory
        ? currentOptions.filter((option) => {
            const label = (option.label || '').toLowerCase();
            const value = (option.value || '').toLowerCase();
            const brand = (option.brandName || '').toLowerCase();
            return label.includes(normalizedQuery) || value.includes(normalizedQuery) || brand.includes(normalizedQuery);
          })
        : isCityCategory
          ? currentOptions.filter((option) => {
              const name = (option.cityName || '').toLowerCase();
              const id = (option.cityId || '').toLowerCase();
              const province = (option.provinceName || '').toLowerCase();
              return name.includes(normalizedQuery) || id.includes(normalizedQuery) || province.includes(normalizedQuery);
            })
          : currentOptions.filter((option) => {
              const label = (option.label || '').toLowerCase();
              const value = (option.value || '').toLowerCase();
              return label.includes(normalizedQuery) || value.includes(normalizedQuery);
            });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage filter options and categories</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Categories Sidebar */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Categories</h3>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    activeCategory === cat.id ? 'bg-brand-600 text-gray-900' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-medium">{cat.label}</span>
                  <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded">
                    {(options[cat.id] || []).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Options List */}
        <div className="col-span-9">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {isProvinceCategory ? 'Provinces' : isMakeCategory ? 'Makes' : isModelCategory ? 'Models' : isCityCategory ? 'Cities' : CATEGORIES.find((c) => c.id === activeCategory)?.label}
                </h2>
                <p className="text-gray-500 text-sm mt-1">{filteredOptions.length} options</p>
              </div>
              <div className="flex items-center gap-3">
                {isCityCategory && (
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500 w-64"
                    placeholder="Search city name, ID, or province"
                  />
                )}
                <button
                  onClick={() => { resetForm(); setShowModal(true); }}
                  className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add {isProvinceCategory ? 'Province' : isMakeCategory ? 'Make' : isModelCategory ? 'Model' : isCityCategory ? 'City' : 'Option'}
                </button>
                {isMakeCategory && (
                  <button
                    onClick={() => { setBulkText(''); setShowBulkModal(true); }}
                    className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    Bulk Add Makes
                  </button>
                )}
              </div>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {normalizedQuery ? 'No matching results found.' : 'No options yet. Click "Add Option" to create one.'}
                </div>
              ) : isProvinceCategory ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                        <th className="pb-3">Province ID</th>
                        <th className="pb-3">Province Name</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOptions.map((option, index) => (
                        <tr key={option._id || index} className="hover:bg-gray-50">
                          <td className="py-4 font-medium text-gray-900">{option.provinceId || option.value}</td>
                          <td className="py-4 text-gray-600">{option.provinceName || option.label}</td>
                          <td className="py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleEdit(option)}
                                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded text-sm font-medium transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(option)}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-gray-900 rounded text-sm font-medium transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : isMakeCategory ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                        <th className="pb-3">Make ID</th>
                        <th className="pb-3">Make Name</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOptions.map((option, index) => (
                        <tr key={option._id || index} className="hover:bg-gray-50">
                          <td className="py-4 font-medium text-gray-900">{option.makeId || option.value}</td>
                          <td className="py-4 text-gray-600">{option.makeName || option.label}</td>
                          <td className="py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleEdit(option)}
                                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded text-sm font-medium transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(option)}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-gray-900 rounded text-sm font-medium transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : isModelCategory ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                        <th className="pb-3">Model ID</th>
                        <th className="pb-3">Model Name</th>
                        <th className="pb-3">Brand</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOptions.map((option, index) => (
                        <tr key={option._id || index} className="hover:bg-gray-50">
                          <td className="py-4 font-medium text-gray-900">{option.modelId || option.value}</td>
                          <td className="py-4 text-gray-600">{option.modelName || option.label}</td>
                          <td className="py-4 text-gray-600">{option.brandName || '-'}</td>
                          <td className="py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleEdit(option)}
                                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded text-sm font-medium transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(option)}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-gray-900 rounded text-sm font-medium transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : isCityCategory ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
                        <th className="pb-3">City ID</th>
                        <th className="pb-3">City Name</th>
                        <th className="pb-3">Province</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredOptions.map((option, index) => (
                        <tr key={option._id || index} className="hover:bg-gray-50">
                          <td className="py-4 font-medium text-gray-900">{option.cityId || option.value}</td>
                          <td className="py-4 text-gray-600">{option.cityName || option.label}</td>
                          <td className="py-4 text-gray-600">{option.provinceName || '-'}</td>
                          <td className="py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleEdit(option)}
                                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded text-sm font-medium transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(option)}
                                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-gray-900 rounded text-sm font-medium transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredOptions.map((option, index) => (
                    <div
                      key={option._id || index}
                      className="bg-gray-100/50 border border-gray-300 rounded-lg p-4 hover:border-brand-500/50 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{option.label || option.value}</div>
                          {option.label && option.value !== option.label && (
                            <div className="text-xs text-gray-400 mt-1">{option.value}</div>
                          )}
                        </div>
                        {option.order > 0 && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">#{option.order}</span>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleEdit(option)}
                          className="flex-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(option)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-gray-900 rounded text-sm font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-200/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-md">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">{editingId ? 'Edit' : 'Add'} {isProvinceCategory ? 'Province' : isMakeCategory ? 'Make' : isModelCategory ? 'Model' : isCityCategory ? 'City' : 'Option'}</h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {isCityCategory ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Province *</label>
                    <select
                      required
                      value={formData.provinceId}
                      onChange={(e) => {
                        const selected = provinces.find((p) => p.provinceId === e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          provinceId: e.target.value,
                          provinceName: selected ? selected.provinceName : '',
                        }));
                      }}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                    >
                      <option value="">Select province</option>
                      {provinces.map((province) => (
                        <option key={province._id || province.provinceId} value={province.provinceId}>
                          {province.provinceName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">City ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                      placeholder="e.g., KHI-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">City Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.label}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData((prev) => ({
                          ...prev,
                          label: name,
                          value: editingId ? prev.value : generateCityId(name),
                        }));
                      }}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                      placeholder="e.g., Karachi"
                    />
                  </div>
                </>
              ) : isMakeCategory ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Make ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                      placeholder="e.g., TOY"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Make Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                      placeholder="e.g., Toyota"
                    />
                  </div>
                </>
              ) : isModelCategory ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Brand *</label>
                    <select
                      required
                      value={formData.brandId}
                      onChange={(e) => {
                        const selected = (options.makes || []).find((m) => (m.makeId || m.value) === e.target.value);
                        setFormData((prev) => ({
                          ...prev,
                          brandId: e.target.value,
                          brandName: selected ? (selected.makeName || selected.label) : '',
                        }));
                      }}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                    >
                      <option value="">Select brand</option>
                      {(options.makes || []).map((make) => (
                        <option key={make._id || make.value} value={make.makeId || make.value}>
                          {make.makeName || make.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Model ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                      placeholder="e.g., COROLLA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Model Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                      placeholder="e.g., Corolla"
                    />
                  </div>
                </>
              ) : isProvinceCategory ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Province ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                      placeholder="e.g., PB"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Province Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                      placeholder="e.g., Punjab"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Value *</label>
                    <input
                      type="text"
                      required
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                      placeholder="e.g., BMW, Sedan, Red"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Label (Optional)</label>
                    <input
                      type="text"
                      value={formData.label}
                      onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                      placeholder="Display name (defaults to value)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-2">Order</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded-lg font-semibold transition-colors"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 bg-gray-200/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-lg">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Bulk Add Makes</h2>
              <button
                onClick={() => { setShowBulkModal(false); setBulkText(''); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleBulkSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Make Names *</label>
                <textarea
                  required
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-brand-500"
                  rows="8"
                  placeholder="Enter make names, one per line or comma-separated:&#10;Ferrari&#10;Lamborghini&#10;Porsche&#10;BMW"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Make IDs will be auto-generated from the names (e.g., Ferrari → FER, Lamborghini → LAM).
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={bulkLoading}
                  className="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  {bulkLoading ? 'Adding...' : 'Add Makes'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowBulkModal(false); setBulkText(''); }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
