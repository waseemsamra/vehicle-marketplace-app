import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehicleApi } from '../services/vehicleApi';
import toast from 'react-hot-toast';

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('Carrara White');
  const [downPayment, setDownPayment] = useState(20000);
  const [isFavorited, setIsFavorited] = useState(false);

  const images = vehicle?.images || (vehicle?.imageUrl ? [vehicle.imageUrl] : []);

  useEffect(() => {
    loadVehicle();
  }, [id]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxOpen) {
        if (e.key === 'Escape') setLightboxOpen(false);
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, selectedImage]);

  const loadVehicle = async () => {
    try {
      const data = await vehicleApi.getById(id);
      setVehicle(data);
    } catch (error) {
      toast.error('Failed to load vehicle');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const calculateMonthlyPayment = () => {
    const price = vehicle?.price || 142500;
    const loanAmount = price - downPayment;
    const monthlyRate = 0.059 / 12;
    const numberOfPayments = 72;
    const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    return Math.round(payment);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vehicle) return null;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Breadcrumb */}
      <div className="pt-24 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <button onClick={() => navigate('/')} className="hover:text-gray-900 transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span>Inventory</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">{vehicle.make} {vehicle.model}</span>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              {vehicle.status === 'available' && (
                <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30 uppercase">Available</span>
              )}
              <span className="px-3 py-1 bg-brand-500/20 text-brand-400 text-xs font-bold rounded-full border border-brand-500/30 uppercase">Featured</span>
              {vehicle.mileage < 10000 && (
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-bold rounded-full border border-yellow-500/30 uppercase">Low Miles</span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-2">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <p className="text-gray-600 text-lg">{vehicle.bodyType} • {vehicle.transmission}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl font-bold text-gray-900">${vehicle.price?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-2 space-y-4">
            {/* Main Image */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-white group cursor-zoom-in shadow-xl border border-gray-200" onClick={() => setLightboxOpen(true)}>
              <img 
                src={images[selectedImage]} 
                alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 right-4 glass-panel px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                Click to expand
              </div>
              <button 
                className="absolute top-4 right-4 p-3 glass-panel rounded-full hover:bg-white/10 transition-all transform hover:scale-110 active:scale-95"
                onClick={(e) => { e.stopPropagation(); setIsFavorited(!isFavorited); toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites'); }}
              >
                <svg className={`w-6 h-6 transition-all ${isFavorited ? 'fill-current text-red-500 scale-110' : 'text-white'}`} fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {images.slice(0, 5).map((img, idx) => (
                  <div 
                    key={idx}
                    className={`relative aspect-video rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      selectedImage === idx ? 'border-brand-500 shadow-lg shadow-brand-500/50 scale-105' : 'border-gray-300 hover:border-brand-400'
                    }`}
                    onClick={() => setSelectedImage(idx)}
                  >
                    <img src={img} className="w-full h-full object-cover" alt={`View ${idx + 1}`} />
                    {idx === 4 && images.length > 5 && (
                      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white font-bold text-sm">+{images.length - 5}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tabs */}
            <div className="mt-8 border-b border-gray-200">
              <div className="flex space-x-8">
                {['overview', 'features', 'history', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pb-4 font-medium transition-colors ${
                      activeTab === tab ? 'text-brand-500 border-b-2 border-brand-500' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Contents */}
            <div className="mt-6">
              {activeTab === 'overview' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">About This Vehicle</h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {vehicle.description || `Experience the pinnacle of automotive engineering with this pristine ${vehicle.year} ${vehicle.make} ${vehicle.model}.`}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="feature-card p-5 rounded-xl text-center bg-white border border-gray-200 hover:border-brand-500/50 transition-all duration-300 hover:shadow-lg shadow-sm">
                      <svg className="w-8 h-8 text-brand-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Mileage</p>
                      <p className="text-gray-900 font-bold text-lg">{vehicle.mileage?.toLocaleString()} mi</p>
                    </div>
                    <div className="feature-card p-5 rounded-xl text-center bg-white border border-gray-200 hover:border-brand-500/50 transition-all duration-300 hover:shadow-lg shadow-sm">
                      <svg className="w-8 h-8 text-brand-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Fuel Type</p>
                      <p className="text-gray-900 font-bold text-lg">{vehicle.fuelType || 'Gasoline'}</p>
                    </div>
                    <div className="feature-card p-5 rounded-xl text-center bg-white border border-gray-200 hover:border-brand-500/50 transition-all duration-300 hover:shadow-lg shadow-sm">
                      <svg className="w-8 h-8 text-brand-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Transmission</p>
                      <p className="text-gray-900 font-bold text-lg">{vehicle.transmission}</p>
                    </div>
                    <div className="feature-card p-5 rounded-xl text-center bg-white border border-gray-200 hover:border-brand-500/50 transition-all duration-300 hover:shadow-lg shadow-sm">
                      <svg className="w-8 h-8 text-brand-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Color</p>
                      <p className="text-gray-900 font-bold text-lg">{vehicle.color}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'features' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <h4 className="font-bold text-gray-900 mb-4">Specifications</h4>
                    <div className="space-y-3">
                      {vehicle.vin && <div className="flex justify-between p-3 hover:bg-gray-50 rounded"><span className="text-gray-600">VIN</span><span className="text-gray-900 font-mono">{vehicle.vin}</span></div>}
                      {vehicle.mileage && <div className="flex justify-between p-3 hover:bg-gray-50 rounded"><span className="text-gray-600">Mileage</span><span className="text-gray-900">{vehicle.mileage.toLocaleString()} miles</span></div>}
                      {vehicle.transmission && <div className="flex justify-between p-3 hover:bg-gray-50 rounded"><span className="text-gray-600">Transmission</span><span className="text-gray-900">{vehicle.transmission}</span></div>}
                      {vehicle.drivetrain && <div className="flex justify-between p-3 hover:bg-gray-50 rounded"><span className="text-gray-600">Drivetrain</span><span className="text-gray-900">{vehicle.drivetrain}</span></div>}
                      {vehicle.color && <div className="flex justify-between p-3 hover:bg-gray-50 rounded"><span className="text-gray-600">Exterior Color</span><span className="text-gray-900">{vehicle.color}</span></div>}
                      {vehicle.fuelType && <div className="flex justify-between p-3 hover:bg-gray-50 rounded"><span className="text-gray-600">Fuel Type</span><span className="text-gray-900">{vehicle.fuelType}</span></div>}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-lg">Clean Title Verified</h4>
                        <p className="text-gray-600 text-sm">No accidents reported</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-4xl font-bold text-gray-900">4.9</div>
                    <div>
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm">Based on customer reviews</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Purchase Options */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-6 sticky top-24 border border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-600 text-sm">Price</p>
                  <p className="text-3xl font-bold text-gray-900">${vehicle.price?.toLocaleString()}</p>
                </div>
              </div>

              {/* Financing Calculator */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-900">Estimated Payment</span>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Down Payment</span>
                    <span className="text-gray-900 font-medium">${downPayment.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="50000" 
                    value={downPayment} 
                    step="1000"
                    onChange={(e) => setDownPayment(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #0ea5e9 0%, #0ea5e9 ${(downPayment/50000)*100}%, #e5e7eb ${(downPayment/50000)*100}%, #e5e7eb 100%)`
                    }}
                  />
                </div>
                <div className="flex justify-between items-end border-t border-gray-200 pt-4">
                  <div>
                    <p className="text-xs text-gray-600">Monthly Payment</p>
                    <p className="text-2xl font-bold text-gray-900">${calculateMonthlyPayment().toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-gray-500">72 months @ 5.9% APR</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button className="w-full py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-brand-500/30 hover:shadow-brand-500/50 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Buy Now
                </button>
                <button className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-xl transition-all border border-gray-300 hover:border-gray-400 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Make an Offer
                </button>
                <button className="w-full py-4 bg-white hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-all border border-gray-300 hover:border-brand-500 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule Test Drive
                </button>
              </div>

              {/* Protection Plans */}
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>7-Day Money Back Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <span>Free Delivery Nationwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-6 right-6 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors z-10" onClick={(e) => { e.stopPropagation(); setLightboxOpen(false); }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <img src={images[selectedImage]} alt="Full size" className="max-w-[90%] max-h-[90%] object-contain" onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-full text-white font-medium">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #0ea5e9;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
          border: none;
        }
      `}</style>
    </div>
  );
};

export default VehicleDetail;
