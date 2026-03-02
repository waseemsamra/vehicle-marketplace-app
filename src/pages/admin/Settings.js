import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = process.env.REACT_APP_API_URL || 'https://4peif882l0.execute-api.us-east-1.amazonaws.com/dev';

const CATEGORIES = [
  { id: 'makes', label: 'Make/Brand', icon: '🚗' },
  { id: 'colors', label: 'Color', icon: '🎨' },
  { id: 'bodyTypes', label: 'Body Type', icon: '🚙' },
  { id: 'transmissions', label: 'Transmission', icon: '⚙️' },
  { id: 'fuelTypes', label: 'Fuel Type', icon: '⛽' },
  { id: 'conditions', label: 'Condition', icon: '✨' },
  { id: 'cities', label: 'City', icon: '📍' },
  { id: 'provinces', label: 'Province', icon: '🗺️' },
  { id: 'assembly', label: 'Assembly', icon: '🏭' },
  { id: 'sellerTypes', label: 'Seller Type', icon: '👤' },
  { id: 'features', label: 'Features', icon: '⭐' },
  { id: 'engineCapacities', label: 'Engine Capacity', icon: '🔧' }
];

const Settings = () => {
  const [activeCategory, setActiveCategory] = useState('makes');
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingOption, setEditingOption] = useState(null);
  const [formData, setFormData] = useState({ value: '', label: '', order: 0 });

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/settings`);
      if (response.ok) {
        const data = await response.json();
        setOptions(data || {});
      } else {
        // Fallback to localStorage if endpoint doesn't exist yet
        const stored = localStorage.getItem('vehicleFilterOptions');
        if (stored) setOptions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Load error:', error);
      const stored = localStorage.getItem('vehicleFilterOptions');
      if (stored) setOptions(JSON.parse(stored));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentOptions = options[activeCategory] || [];
      let updatedOptions;

      if (editingOption !== null) {
        updatedOptions = currentOptions.map((opt, idx) => 
          idx === editingOption ? formData : opt
        );
      } else {
        updatedOptions = [...currentOptions, formData];
      }

      const response = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: activeCategory, options: updatedOptions })
      });

      if (response.ok) {
        const data = await response.json();
        setOptions(data.options || { ...options, [activeCategory]: updatedOptions });
      } else {
        // Fallback to localStorage
        const newOptions = { ...options, [activeCategory]: updatedOptions };
        localStorage.setItem('vehicleFilterOptions', JSON.stringify(newOptions));
        setOptions(newOptions);
      }
      
      toast.success(editingOption !== null ? 'Option updated!' : 'Option added!');
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.message);
    }
  };

  const handleDelete = async (index) => {
    if (!window.confirm('Delete this option?')) return;
    
    try {
      const currentOptions = options[activeCategory] || [];
      const updatedOptions = currentOptions.filter((_, idx) => idx !== index);

      const response = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category: activeCategory, options: updatedOptions })
      });

      if (response.ok) {
        const data = await response.json();
        setOptions(data.options || { ...options, [activeCategory]: updatedOptions });
      } else {
        // Fallback to localStorage
        const newOptions = { ...options, [activeCategory]: updatedOptions };
        localStorage.setItem('vehicleFilterOptions', JSON.stringify(newOptions));
        setOptions(newOptions);
      }

      toast.success('Option deleted!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleEdit = (option, index) => {
    setEditingOption(index);
    setFormData(option);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ value: '', label: '', order: 0 });
    setEditingOption(null);
  };

  const currentOptions = options[activeCategory] || [];

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage filter options and categories</p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Categories Sidebar */}
        <div className="col-span-3">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-4">
            <h3 className="text-sm font-semibold text-slate-400 uppercase mb-3">Categories</h3>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                    activeCategory === cat.id
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{cat.icon}</span>
                  <span className="font-medium">{cat.label}</span>
                  <span className="ml-auto text-xs bg-slate-800 px-2 py-1 rounded">
                    {(options[cat.id] || []).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Options List */}
        <div className="col-span-9">
          <div className="bg-slate-900 rounded-xl border border-slate-800">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {CATEGORIES.find(c => c.id === activeCategory)?.label} Options
                </h2>
                <p className="text-slate-400 text-sm mt-1">{currentOptions.length} options</p>
              </div>
              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Option
              </button>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                </div>
              ) : currentOptions.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  No options yet. Click "Add Option" to create one.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentOptions.map((option, index) => {
                    const displayValue = typeof option === 'string' ? option : (option.label || option.value);
                    const subValue = typeof option === 'object' && option.value !== option.label ? option.value : null;
                    
                    return (
                      <div
                        key={index}
                        className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-brand-500/50 transition-all"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="font-semibold text-white">{displayValue}</div>
                            {subValue && (
                              <div className="text-xs text-slate-500 mt-1">{subValue}</div>
                            )}
                          </div>
                          {typeof option === 'object' && option.order > 0 && (
                            <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                              #{option.order}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleEdit(typeof option === 'string' ? { value: option, label: option, order: 0 } : option, index)}
                            className="flex-1 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded text-sm font-medium transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(index)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-2xl border border-slate-800 w-full max-w-md">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {editingOption !== null ? 'Edit Option' : 'Add New Option'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm(); }}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Value *</label>
                <input
                  type="text"
                  required
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  placeholder="e.g., BMW, Sedan, Red"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Label (Optional)</label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
                  placeholder="Display name (defaults to value)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-semibold transition-colors"
                >
                  {editingOption !== null ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors"
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
