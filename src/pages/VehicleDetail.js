import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import vehicleDetailsData from '../data/vehicleDetails.json';
import { vehicleApi } from '../services/vehicleApi';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const detailById = new Map();
const detailBySlug = new Map();
vehicleDetailsData.vehicles.forEach((v) => {
  detailById.set(v.id, v);
  detailBySlug.set(v.slug, v);
  detailBySlug.set(v.key, v);
});

const VehicleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [downPayment, setDownPayment] = useState(20000);
  const [isFavorited, setIsFavorited] = useState(false);

  const images = useMemo(() => {
    const cover = vehicle?.coverImage;
    if (vehicle?.gallery?.length) {
      const urls = vehicle.gallery.map((g) => g.url);
      return cover ? [cover, ...urls.filter((u) => u !== cover)] : urls;
    }
    if (vehicle?.images?.length) {
      return cover ? [cover, ...vehicle.images.filter((u) => u !== cover)] : vehicle.images;
    }
    if (vehicle?.img) return [vehicle.img];
    if (vehicle?.imageUrl) return [vehicle.imageUrl];
    return [];
  }, [vehicle]);

  useEffect(() => {
    loadFromApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    document.title = vehicle ? `AutoMarket | ${vehicle.title}` : 'AutoMarket | Vehicle Details';
  }, [vehicle]);

  const nextImage = useCallback(() => {
    setSelectedImage((p) => (p + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback(() => {
    setSelectedImage((p) => (p - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    const onKey = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, selectedImage, nextImage, prevImage]);

  const loadFromApi = async () => {
    try {
      const data = await vehicleApi.getById(id);
      if (data?.images?.length && !data?.gallery?.length) {
        data.gallery = data.images.map((url, idx) => ({ url, alt: `${data.title || 'Vehicle'} photo ${idx + 1}` }));
      }
      setVehicle(data);
    } catch (error) {
      toast.error('Failed to load vehicle');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyPayment = () => {
    const price = vehicle?.priceNum || 142500;
    const loanAmount = Math.max(0, price - downPayment);
    const monthlyRate = 0.059 / 12;
    const n = 72;
    const payment =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1);
    return Math.round(payment);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vehicle) return null;

  const {
    title,
    subtitle,
    priceNum,
    msrp,
    status,
    badge,
    mileage,
    fuelType,
    transmission,
    seats,
    gallery = [],
    description = '',
    features,
    seller,
    dealership,
    make,
    model,
    year,
    body,
    engine,
    color,
    condition,
    city,
  } = vehicle;

  const thumbCount = 4;
  const restCount = Math.max(0, gallery.length - thumbCount);

  const specItems = [
    { label: 'Make', value: make },
    { label: 'Model', value: model },
    { label: 'Year', value: year ? String(year) : '' },
    { label: 'Body Type', value: body },
    { label: 'Location', value: city },
    { label: 'Transmission', value: transmission },
    { label: 'Fuel Type', value: fuelType },
    { label: 'Engine', value: engine },
    { label: 'Color', value: color },
    { label: 'Condition', value: condition },
    { label: 'Mileage', value: mileage ? `${Number(mileage).toLocaleString()} km` : '' },
    { label: 'Seats', value: seats ? String(seats) : '' },
  ].filter((item) => item.value);

  return (
    <div className="bg-background text-on-surface min-h-screen">
      <Navbar />

      <main className="mx-auto px-margin-desktop py-8" style={{ maxWidth: '1536px' }}>
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-6 text-sm text-on-surface-variant">
          <button onClick={() => navigate('/')} className="flex items-center gap-1 hover:text-primary transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <a href="/search" className="hover:text-primary transition-colors">Inventory</a>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-primary font-bold">{title}</span>
        </nav>

        {/* Premium Hero Gallery: 1 large + 4 small thumbnails */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-xl">
          <div className="lg:col-span-8">
            <div
              className="relative aspect-[16/9] lg:h-[500px] rounded-xl overflow-hidden shadow-ambient group cursor-pointer bg-surface-container"
              onClick={() => setLightboxOpen(true)}
            >
              <img
                src={images[selectedImage]}
                alt={gallery?.[selectedImage]?.alt || title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  e.target.src = '/image/hero.jpg';
                }}
              />
              <div className="absolute bottom-4 left-4 bg-surface/80 glass-effect px-3 py-1.5 rounded-lg font-label-sm text-label-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                {selectedImage + 1} / {gallery.length} Photos
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorited(!isFavorited);
                  toast.success(isFavorited ? 'Removed from favorites' : 'Added to favorites');
                }}
                className="absolute top-4 right-4 p-3 glass-panel-light rounded-full hover:bg-surface-container transition-all transform hover:scale-110 active:scale-95"
              >
                <svg
                  className={`w-6 h-6 transition-all ${isFavorited ? 'fill-current text-red-500 scale-110' : 'text-primary'}`}
                  fill={isFavorited ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 lg:grid-rows-2 gap-4">
            {gallery.slice(0, thumbCount).map((img, idx) => (
              <div
                key={idx}
                className="rounded-xl overflow-hidden shadow-ambient relative group cursor-pointer bg-surface-container aspect-square"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(idx);
                }}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {idx === thumbCount - 1 && restCount > 0 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-label-md text-label-md">+{restCount} More</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Main Layout with Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-xl">
            {/* Vehicle Overview Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                   <h1 className="font-headline-lg text-headline-lg md:text-display-lg font-extrabold text-primary text-2xl md:text-3xl lg:text-4xl">{title}</h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">{subtitle}</p>
                </div>
                <div className="text-right">
                  <p className="font-headline-md text-headline-md text-primary">${priceNum?.toLocaleString()}</p>
                  {msrp && <p className="font-label-sm text-label-sm text-on-surface-variant">MSRP: {msrp}</p>}
                </div>
              </div>

              <div className="flex flex-wrap gap-sm">
                <div className="bg-surface-container-high px-4 py-2 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">speed</span>
                  <span className="font-label-md text-label-md">{mileage?.toLocaleString()} mi</span>
                </div>
                <div className="bg-surface-container-high px-4 py-2 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">local_gas_station</span>
                  <span className="font-label-md text-label-md">{fuelType || 'Gasoline'}</span>
                </div>
                <div className="bg-surface-container-high px-4 py-2 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">settings_input_component</span>
                  <span className="font-label-md text-label-md">{transmission}</span>
                </div>
                <div className="bg-surface-container-high px-4 py-2 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary">event_seat</span>
                  <span className="font-label-md text-label-md">{seats} Seats</span>
                </div>
              </div>
            </div>

            {/* Status / Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              {badge && (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.cls}`}>{badge.text}</span>
              )}
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  status === 'available'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : status === 'reserved'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : status === 'pricedrop'
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    : 'bg-surface-container border border-outline-variant text-on-surface'
                }`}
              >
                {status === 'available' ? 'Available' : status}
              </span>
            </div>

            {/* Technical Specifications */}
            <section>
              <h2 className="font-headline-sm text-headline-sm mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">analytics</span>
                Vehicle Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-surface-container-lowest p-lg rounded-xl shadow-ambient border border-outline-variant/20">
                {specItems.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <span className="text-xs text-on-surface-variant uppercase tracking-wider">{item.label}</span>
                    <span className="text-sm font-semibold text-primary">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Premium Features */}
            <section>
              <h2 className="font-headline-sm text-headline-sm mb-6">Premium Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {(features || []).map((f, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-surface-container-low rounded-lg transition-all hover:bg-surface-container">
                    <span className="material-symbols-outlined text-primary text-3xl">check_circle</span>
                    <div>
                      <p className="font-label-md text-label-md text-primary">{typeof f === 'string' ? f : (f.title || f)}</p>
                      {typeof f === 'object' && f.detail && (
                        <p className="text-[12px] text-on-surface-variant">{f.detail}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Seller's Description */}
            <section>
              <h2 className="font-headline-sm text-headline-sm mb-4">Seller's Description</h2>
              <div className="text-on-surface-variant leading-relaxed space-y-4">
                {(description || '').split('\n').map((para, i) => (
                  <p key={i} className="mb-4">{para}</p>
                ))}
              </div>
            </section>

            {/* Trust Indicators */}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant/30">
                <div className="w-12 h-12 flex items-center justify-center bg-secondary-container text-on-secondary-container rounded-full">
                  <span className="material-symbols-outlined">verified</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-primary">Certified Inspection</p>
                  <p className="text-label-sm text-on-surface-variant">165-point detailed check</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-lg bg-surface-container-lowest rounded-xl shadow-ambient border border-outline-variant/30">
                <div className="w-12 h-12 flex items-center justify-center bg-tertiary-container text-on-tertiary-container rounded-full">
                  <span className="material-symbols-outlined">history_edu</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-primary">CARFAX® Report</p>
                   <button className="text-label-sm text-primary underline">View Full History</button>
                </div>
              </div>
            </section>

          </div>

          {/* Right Column: Sticky Action Panel */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              <div className="bg-surface-container-lowest p-lg rounded-xl shadow-ambient border border-outline-variant/20 flex flex-col gap-6">
                <div className="space-y-4">
                  <button
                    onClick={() => {
                      toast.success('Redirecting to purchase');
                      navigate(`/vehicle/${vehicle.id}/checkout`);
                    }}
                    className="w-full bg-primary text-on-primary py-4 rounded-lg font-label-md text-label-md hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined">bolt</span>
                    Start Purchase Online
                  </button>
                  <button
                    onClick={() => toast.success('Checking availability...')}
                    className="w-full border border-primary text-primary py-4 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-colors"
                  >
                    Check Availability
                  </button>
                </div>

                <hr className="border-outline-variant/10" />

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-on-surface-variant">Est. Monthly Payment</span>
                    <span className="font-headline-sm text-headline-sm text-primary">${calculateMonthlyPayment().toLocaleString()} / mo</span>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-label-sm mb-2">
                      <span className="material-symbols-outlined text-[16px]">calculate</span>
                      <span>Loan Calculator</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={priceNum ? priceNum * 0.6 : 50000}
                      value={downPayment}
                      step="1000"
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full h-1 accent-primary"
                    />
                    <div className="flex justify-between text-[11px] text-on-surface-variant mt-1">
                      <span>$0</span>
                      <span>${priceNum ? (priceNum * 0.6).toLocaleString() : 50000}</span>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant">72 months @ 5.9% APR</p>
                </div>

                <hr className="border-outline-variant/10" />

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                    <input type="checkbox" className="accent-primary h-4 w-4" defaultChecked />
                    Include 3-year warranty +$2,995
                  </label>
                  <label className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                    <input type="checkbox" className="accent-primary h-4 w-4" />
                    Free delivery nationwide
                  </label>
                  <label className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                    <input type="checkbox" className="accent-primary h-4 w-4" />
                    7-day money-back guarantee
                  </label>
                </div>
              </div>

              {/* Your Client Advisor */}
              <div className="flex items-center gap-6 p-lg bg-surface-container-lowest rounded-2xl shadow-ambient border border-outline-variant/20">
                <img
                  src={seller?.avatar}
                  alt={seller?.name}
                  className="w-24 h-24 rounded-full object-cover border-2 border-outline-variant/20"
                />
                <div className="flex-1">
                  <p className="text-on-surface-variant text-xs uppercase tracking-wider">Your Client Advisor</p>
                  <h4 className="font-semibold text-lg text-primary">{seller?.name}</h4>
                  <p className="text-on-surface-variant">{seller?.title}</p>
                  <p className="text-primary font-semibold mt-1">{seller?.phone}</p>
                </div>
                <a
                  href={`tel:${seller?.phone?.replace(/\D/g, '')}`}
                  className="flex items-center justify-center w-12 h-12 bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.586l-2.7 1.104a11.99 11.99 0 006.39 6.39l1.104-2.7a1 1 0 011.586-.502l4.493 1.498A1 1 0 0121 16.691V19a2 2 0 00-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </a>
              </div>

              {/* Dealer location */}
              <div className="bg-primary-container p-lg rounded-xl text-on-primary-container shadow-ambient">
                <h3 className="font-label-md text-label-md mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-primary-container">location_on</span>
                  {dealership?.name}
                </h3>
                <p className="text-label-sm opacity-80 mb-4">
                  {dealership?.address}, {dealership?.city}, {dealership?.state} {dealership?.zip}
                </p>
                <div className="h-32 w-full rounded-lg bg-surface-container-highest overflow-hidden mb-4 border border-outline-variant/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-3xl text-on-primary-container/40">map</span>
                </div>
                <button
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                        `${dealership?.address}, ${dealership?.city}, ${dealership?.state}`
                      )}`,
                      '_blank'
                    )
                  }
                  className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-lg text-label-sm font-medium transition-colors"
                >
                  Get Directions
                </button>
              </div>
            </div>
          </aside>
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
          <img src={images[selectedImage]} alt="Full size" className="max-w-[90%] max-h-[85%] object-contain" onClick={(e) => e.stopPropagation()} />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-full text-white font-medium">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDetail;
