import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_API_URL || process.env.REACT_APP_MCP_URL || 'http://localhost:3002';

const Hero = ({ onSearch }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [condition, setCondition] = useState('all');
  const [makes, setMakes] = useState([]);
  const [metadata, setMetadata] = useState({ makes: [], models: {} });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    fetchMakes();
    fetchOneVehicleImage();
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchMakes = async () => {
    try {
      const response = await fetch(`${API_URL}/vehicles/metadata`);
      if (response.ok) {
        const data = await response.json();
        setMakes(data.makes || []);
        setMetadata(data);
      }
    } catch (error) {
      console.error('Failed to load makes:', error);
    }
  };

  const fetchOneVehicleImage = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vehicles?make=Nissan&model=Titan&year=2025&limit=1`);
      if (response.ok) {
        const data = await response.json();
        const vehicles = data.vehicles || data.items || [];
        if (vehicles.length > 0 && vehicles[0].images && vehicles[0].images.length > 0) {
          setBgImage(vehicles[0].images[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load background image:', error);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    if (value.length >= 2) {
      const lowerValue = value.toLowerCase();
      const matchedMakes = metadata.makes.filter(m => m.toLowerCase().includes(lowerValue)).slice(0, 5);
      const matchedModels = Object.entries(metadata.models).flatMap(([make, models]) => 
        models.filter(model => model.toLowerCase().includes(lowerValue)).map(model => `${make} ${model}`)
      ).slice(0, 5);
      setSuggestions([...matchedMakes, ...matchedModels].slice(0, 8));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (brand) params.set('make', brand);
    if (model) params.set('model', model);
    navigate(`/vehicles?${params.toString()}`);
  };

  const availableModels = brand && metadata.models[brand] ? metadata.models[brand] : [];

  return (
    <section className="relative h-[70vh] overflow-hidden pt-8 md:pt-20">
      {bgImage && (
        <div className="absolute inset-0">
          <img src={bgImage} alt="Vehicle" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      )}
      {!bgImage && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700"></div>
      )}

      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        {/* Left side - Search Panel */}
        <div className="w-full md:w-[420px] bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 md:p-8">
          <h1 className="text-2xl md:text-4xl font-bold text-gray-900 leading-tight mb-4 md:mb-8">
            Imagine the<br/>possibilities
          </h1>

          <div className="flex mb-4 md:mb-6 border-b border-gray-200">
            <button 
              onClick={() => setActiveTab('buy')}
              className={`pb-2 md:pb-3 px-2 md:px-4 text-sm md:text-base flex-1 text-center transition-all ${
                activeTab === 'buy' 
                  ? 'border-b-3 border-gray-900 text-gray-900 font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Shop cars for sale
            </button>
            <button 
              onClick={() => setActiveTab('sell')}
              className={`pb-2 md:pb-3 px-2 md:px-4 text-sm md:text-base flex-1 text-center transition-all ${
                activeTab === 'sell' 
                  ? 'border-b-3 border-gray-900 text-gray-900 font-semibold' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sell your car
            </button>
          </div>

          {activeTab === 'buy' ? (
            <div className="space-y-0 border border-gray-300 rounded-xl overflow-hidden bg-white">
              <div className="border-b border-gray-300">
                <label className="block text-xs text-gray-500 px-3 md:px-4 pt-2 md:pt-3 pb-1">New/used</label>
                <select 
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full px-3 md:px-4 pb-2 md:pb-3 text-base md:text-lg text-gray-900 bg-transparent border-none outline-none font-medium appearance-none cursor-pointer"
                >
                  <option value="all">New & used</option>
                  <option value="new">New</option>
                  <option value="used">Used</option>
                </select>
              </div>
              <div className="border-b border-gray-300">
                <label className="block text-xs text-gray-500 px-3 md:px-4 pt-2 md:pt-3 pb-1">Make</label>
                <select 
                  value={brand}
                  onChange={(e) => { setBrand(e.target.value); setModel(''); }}
                  className="w-full px-3 md:px-4 pb-2 md:pb-3 text-base md:text-lg text-gray-900 bg-transparent border-none outline-none font-medium appearance-none cursor-pointer"
                >
                  <option value="">All makes</option>
                  {makes.map((make, i) => <option key={i} value={make}>{make}</option>)}
                </select>
              </div>
              <div className="border-b border-gray-300">
                <label className="block text-xs text-gray-500 px-3 md:px-4 pt-2 md:pt-3 pb-1">Model</label>
                <select 
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!brand}
                  className="w-full px-3 md:px-4 pb-2 md:pb-3 text-base md:text-lg text-gray-900 bg-transparent border-none outline-none font-medium appearance-none cursor-pointer disabled:text-gray-400"
                >
                  <option value="">All models</option>
                  {availableModels.map((m, i) => <option key={i} value={m}>{m}</option>)}
                </select>
              </div>
              <button 
                onClick={handleSearch}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base md:text-lg py-3 md:py-4 transition-colors"
              >
                Search Vehicles
              </button>
            </div>
          ) : (
            <div className="space-y-0 border border-gray-300 rounded-xl overflow-hidden bg-white">
              <div className="border-b border-gray-300">
                <label className="block text-xs text-gray-500 px-3 md:px-4 pt-2 md:pt-3 pb-1">VIN or License Plate</label>
                <input 
                  type="text" 
                  className="w-full px-3 md:px-4 pb-2 md:pb-3 text-base md:text-lg text-gray-900 bg-transparent border-none outline-none font-medium" 
                  placeholder="Enter VIN"
                />
              </div>
              <div className="border-b border-gray-300">
                <label className="block text-xs text-gray-500 px-3 md:px-4 pt-2 md:pt-3 pb-1">Email</label>
                <input 
                  type="email" 
                  className="w-full px-3 md:px-4 pb-2 md:pb-3 text-base md:text-lg text-gray-900 bg-transparent border-none outline-none font-medium" 
                  placeholder="Your email"
                />
              </div>
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-base md:text-lg py-3 md:py-4 transition-colors">
                Get Your Offer
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
