const imageByMake = {
  'Land Rover': '/image/range-rover.jpg',
  'BMW': '/image/bmw-x7.jpg',
  'Mercedes-Benz': '/image/mercedes-eqs.jpg',
  'Porsche': '/image/porsche-cayenne.jpg',
  'Tesla': '/image/tesla-model-3.jpg',
  'Ford': '/image/ford-f150.jpg',
  'Audi': '/image/hero.jpg',
  'Chevrolet': '/image/hero.jpg',
  'Toyota': '/image/hero.jpg',
  'Lexus': '/image/hero.jpg',
  'Jaguar': '/image/hero.jpg',
  'Bentley': '/image/hero.jpg',
  'Rolls-Royce': '/image/hero.jpg',
  'Lamborghini': '/image/hero.jpg',
  'Ferrari': '/image/hero.jpg',
};

const featureTags = ['Sunroof', 'AWD', 'Navigation', 'Leather', 'Adaptive Cruise', 'Sport Mode', 'Third Row', 'Heated Seats'];

const bodies = [
  { label: 'Sedan', icon: 'directions_car' },
  { label: 'SUV', icon: 'airport_shuttle' },
  { label: 'Coupe', icon: 'minor_crash' },
  { label: 'Truck', icon: 'mobile_code' },
];

const CITIES = [
  'Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Peshawar',
  'Multan', 'Gujranwala', 'Sialkot', 'Sargodha', 'Hyderabad', 'Bahawalpur',
  'Abbottabad', 'Wah Cantt', 'Gujrat', 'Mardan', 'Quetta', 'Sahiwal',
  'Rahim Yar Khan', 'Jhelum', 'Sheikhupura', 'Attock', 'Okara', 'Mandi bahauddin',
  'Chakwal', 'Haripur', 'Mansehra', 'Jhang', 'Swabi', 'Taxila',
];
const CATEGORIES = [
  'Sports cars', 'Electric cars', 'Luxury Car', 'Japanese cars', 'Automatic cars', 'Old Cars',
  'Hybrid cars', 'Carry Daba', '7 Seater', 'Accidental', 'Modified Cars', 'Small cars',
  'Cheap cars', '8 Seater', '660cc cars', '1300cc cars', '1000cc cars', 'Petrol Cars',
];
const BUDGETS = [
  'Cars under 5 Lakhs', 'Cars under 10 Lakhs', 'Cars under 20 Lakhs', 'Cars under 30 Lakhs',
  'Cars under 40 Lakhs', 'Cars under 50 Lakhs', 'Cars under 60 Lakhs', 'Cars under 80 Lakhs',
  'Cars under 1 Crore', 'Cars under 1.5 Crore', 'Cars under 2 Crore', 'Cars above 2 Crore',
];
const BODY_TYPES = [
  'Sedan', 'Hatchback', 'SUV', 'Crossover', 'Mini Van', 'Compact SUV',
  'Compact sedan', 'MPV', 'Double Cabin', 'Van', 'Pick Up', 'Micro Van',
];
const JAPANESE_MAKES = ['Toyota', 'Honda', 'Nissan', 'Mazda', 'Subaru', 'Mitsubishi', 'Suzuki', 'Lexus', 'Acura', 'Isuzu', 'Daihatsu'];
const categorize = (t, year) => {
  if (t.fuel === 'Electric') return 'Electric cars';
  if (t.fuel === 'Hybrid') return 'Hybrid cars';
  if (t.features.includes('Sport Mode')) return 'Sports cars';
  if (t.basePrice >= 80000) return 'Luxury Car';
  if (['Automatic', 'Steptronic', 'PDK', 'Direct-Drive'].includes(t.transmission)) return 'Automatic cars';
  if (JAPANESE_MAKES.includes(t.make)) return 'Japanese cars';
  if (year <= 2021) return 'Old Cars';
  if (t.features.includes('Third Row')) return '7 Seater';
  if (t.basePrice < 25000) return 'Small cars';
  if (t.basePrice < 40000) return 'Cheap cars';
  return 'Petrol Cars';
};
const slugify = (s) => String(s).toLowerCase().replace(/\s+/g, '-');
const BUDGET_RANGES = {
  'Cars under 5 Lakhs': { max: 20000 },
  'Cars under 10 Lakhs': { max: 40000 },
  'Cars under 20 Lakhs': { max: 80000 },
  'Cars under 30 Lakhs': { max: 120000 },
  'Cars under 40 Lakhs': { max: 160000 },
  'Cars under 50 Lakhs': { max: 200000 },
  'Cars under 60 Lakhs': { max: 240000 },
  'Cars under 80 Lakhs': { max: 320000 },
  'Cars under 1 Crore': { max: 400000 },
  'Cars under 1.5 Crore': { max: 600000 },
  'Cars under 2 Crore': { max: 800000 },
  'Cars above 2 Crore': { min: 800000 },
};

const templates = [
  { make: 'Land Rover', model: 'Range Rover', body: 'SUV', fuel: 'Hybrid', transmission: 'Automatic', engine: 'Inline-4', features: ['Sunroof', 'AWD', 'Navigation', 'Leather'], basePrice: 124900 },
  { make: 'Land Rover', model: 'Range Rover Sport', body: 'SUV', fuel: 'Gasoline', transmission: 'Automatic', engine: 'V8', features: ['AWD', 'Leather'], basePrice: 98500 },
  { make: 'Land Rover', model: 'Defender', body: 'SUV', fuel: 'Diesel', transmission: 'Manual', engine: 'Inline-4', features: ['AWD'], basePrice: 65000 },
  { make: 'BMW', model: 'X5', body: 'SUV', fuel: 'Gasoline', transmission: 'Automatic', engine: 'Inline-6', features: ['AWD', 'Navigation'], basePrice: 72000 },
  { make: 'BMW', model: 'X7', body: 'SUV', fuel: 'Gasoline', transmission: 'Steptronic', engine: 'V8', features: ['Leather', 'AWD'], basePrice: 105200 },
  { make: 'BMW', model: 'M3', body: 'Sedan', fuel: 'Gasoline', transmission: 'Manual', engine: 'Inline-6', features: ['Sport Mode', 'Heated Seats'], basePrice: 75000 },
  { make: 'BMW', model: 'M5', body: 'Sedan', fuel: 'Gasoline', transmission: 'Automatic', engine: 'V8', features: ['Sport Mode', 'Leather'], basePrice: 110000 },
  { make: 'BMW', model: 'iX', body: 'SUV', fuel: 'Electric', transmission: 'Direct-Drive', engine: 'Electric', features: ['Navigation', 'AWD'], basePrice: 95000 },
  { make: 'Mercedes-Benz', model: 'G-Class', body: 'SUV', fuel: 'Gasoline', transmission: 'Manual', engine: 'V8', features: ['AWD', 'Leather'], basePrice: 160000 },
  { make: 'Mercedes-Benz', model: 'EQS SUV', body: 'SUV', fuel: 'Electric', transmission: 'Direct-Drive', engine: 'Electric', features: ['Navigation', 'Adaptive Cruise'], basePrice: 112000 },
  { make: 'Mercedes-Benz', model: 'C-Class', body: 'Sedan', fuel: 'Gasoline', transmission: 'Automatic', engine: 'Inline-4', features: ['Leather'], basePrice: 48000 },
  { make: 'Mercedes-Benz', model: 'E-Class', body: 'Sedan', fuel: 'Hybrid', transmission: 'Automatic', engine: 'Inline-4', features: ['Navigation', 'Adaptive Cruise'], basePrice: 55000 },
  { make: 'Porsche', model: 'Cayenne', body: 'SUV', fuel: 'Gasoline', transmission: 'PDK', engine: 'V6', features: ['AWD'], basePrice: 98500 },
  { make: 'Porsche', model: '911', body: 'Coupe', fuel: 'Gasoline', transmission: 'Manual', engine: 'Flat-6', features: ['Sport Mode'], basePrice: 130000 },
  { make: 'Porsche', model: 'Taycan', body: 'Sedan', fuel: 'Electric', transmission: 'Direct-Drive', engine: 'Electric', features: ['Navigation', 'AWD'], basePrice: 95000 },
  { make: 'Porsche', model: 'Panamera', body: 'Coupe', fuel: 'Gasoline', transmission: 'PDK', engine: 'V6', features: ['Leather', 'AWD'], basePrice: 115000 },
  { make: 'Audi', model: 'Q5', body: 'SUV', fuel: 'Gasoline', transmission: 'Automatic', engine: 'Inline-4', features: ['AWD', 'Navigation'], basePrice: 52000 },
  { make: 'Audi', model: 'Q7', body: 'SUV', fuel: 'Gasoline', transmission: 'Steptronic', engine: 'V6', features: ['AWD', 'Third Row'], basePrice: 65000 },
  { make: 'Audi', model: 'A4', body: 'Sedan', fuel: 'Gasoline', transmission: 'Automatic', engine: 'Inline-4', features: ['Navigation'], basePrice: 42000 },
  { make: 'Audi', model: 'e-tron', body: 'SUV', fuel: 'Electric', transmission: 'Direct-Drive', engine: 'Electric', features: ['Navigation', 'AWD'], basePrice: 70000 },
  { make: 'Tesla', model: 'Model 3', body: 'Sedan', fuel: 'Electric', transmission: 'Direct-Drive', engine: 'Electric', features: ['Navigation', 'Heated Seats'], basePrice: 45000 },
  { make: 'Tesla', model: 'Model S', body: 'Sedan', fuel: 'Electric', transmission: 'Direct-Drive', engine: 'Electric', features: ['Navigation', 'Leather'], basePrice: 95000 },
  { make: 'Tesla', model: 'Model X', body: 'SUV', fuel: 'Electric', transmission: 'Direct-Drive', engine: 'Electric', features: ['AWD', 'Third Row'], basePrice: 120000 },
  { make: 'Tesla', model: 'Model Y', body: 'SUV', fuel: 'Electric', transmission: 'Direct-Drive', engine: 'Electric', features: ['AWD', 'Sunroof'], basePrice: 60000 },
  { make: 'Ford', model: 'F-150', body: 'Truck', fuel: 'Gasoline', transmission: 'Manual', engine: 'V6', features: ['AWD'], basePrice: 55000 },
  { make: 'Ford', model: 'Bronco', body: 'SUV', fuel: 'Gasoline', transmission: 'Manual', engine: 'V6', features: ['AWD'], basePrice: 48000 },
  { make: 'Ford', model: 'Mustang Mach-E', body: 'SUV', fuel: 'Electric', transmission: 'Direct-Drive', engine: 'Electric', features: ['Navigation'], basePrice: 50000 },
  { make: 'Ford', model: 'Explorer', body: 'SUV', fuel: 'Gasoline', transmission: 'Automatic', engine: 'V6', features: ['Third Row', 'AWD'], basePrice: 60000 },
  { make: 'Chevrolet', model: 'Silverado', body: 'Truck', fuel: 'Gasoline', transmission: 'Manual', engine: 'V8', features: [], basePrice: 50000 },
  { make: 'Chevrolet', model: 'Equinox', body: 'SUV', fuel: 'Gasoline', transmission: 'Automatic', engine: 'Inline-4', features: ['AWD'], basePrice: 32000 },
  { make: 'Chevrolet', model: 'Corvette', body: 'Coupe', fuel: 'Gasoline', transmission: 'Manual', engine: 'V8', features: ['Sport Mode'], basePrice: 65000 },
  { make: 'Toyota', model: 'Camry', body: 'Sedan', fuel: 'Gasoline', transmission: 'Automatic', engine: 'Inline-4', features: ['Navigation'], basePrice: 28000 },
  { make: 'Toyota', model: 'Tacoma', body: 'Truck', fuel: 'Gasoline', transmission: 'Manual', engine: 'V6', features: ['AWD'], basePrice: 30000 },
  { make: 'Toyota', model: 'Highlander', body: 'SUV', fuel: 'Gasoline', transmission: 'Automatic', engine: 'V6', features: ['Third Row', 'AWD'], basePrice: 38000 },
  { make: 'Lexus', model: 'RX', body: 'SUV', fuel: 'Gasoline', transmission: 'Automatic', engine: 'V6', features: ['Leather', 'AWD'], basePrice: 45000 },
  { make: 'Lexus', model: 'LS', body: 'Sedan', fuel: 'Gasoline', transmission: 'Automatic', engine: 'V8', features: ['Leather', 'Navigation'], basePrice: 80000 },
  { make: 'Lexus', model: 'LC', body: 'Coupe', fuel: 'Electric', transmission: 'Direct-Drive', engine: 'Electric', features: ['Sport Mode'], basePrice: 100000 },
  { make: 'Jaguar', model: 'F-Pace', body: 'SUV', fuel: 'Gasoline', transmission: 'Automatic', engine: 'Inline-6', features: ['AWD', 'Leather'], basePrice: 50000 },
  { make: 'Jaguar', model: 'I-PACE', body: 'SUV', fuel: 'Electric', transmission: 'Direct-Drive', engine: 'Electric', features: ['Navigation', 'AWD'], basePrice: 70000 },
  { make: 'Bentley', model: 'Bentayga', body: 'SUV', fuel: 'Gasoline', transmission: 'Automatic', engine: 'W12', features: ['AWD', 'Leather'], basePrice: 200000 },
  { make: 'Bentley', model: 'Continental GT', body: 'Coupe', fuel: 'Gasoline', transmission: 'Automatic', engine: 'W12', features: ['Leather'], basePrice: 220000 },
  { make: 'Rolls-Royce', model: 'Cullinan', body: 'SUV', fuel: 'Gasoline', transmission: 'Automatic', engine: 'V8', features: ['Leather'], basePrice: 250000 },
  { make: 'Rolls-Royce', model: 'Phantom', body: 'Sedan', fuel: 'Gasoline', transmission: 'Automatic', engine: 'V8', features: ['Leather'], basePrice: 450000 },
  { make: 'Lamborghini', model: 'Urus', body: 'SUV', fuel: 'Gasoline', transmission: 'Automatic', engine: 'V8', features: ['Sport Mode'], basePrice: 230000 },
  { make: 'Lamborghini', model: 'Huracán', body: 'Coupe', fuel: 'Gasoline', transmission: 'Manual', engine: 'V10', features: ['Sport Mode'], basePrice: 210000 },
  { make: 'Ferrari', model: 'Roma', body: 'Coupe', fuel: 'Gasoline', transmission: 'Manual', engine: 'V8', features: ['Sport Mode'], basePrice: 220000 },
  { make: 'Ferrari', model: 'Purosangue', body: 'SUV', fuel: 'Gasoline', transmission: 'Automatic', engine: 'V12', features: ['AWD'], basePrice: 250000 },
  { make: 'Ferrari', model: 'F8', body: 'Coupe', fuel: 'Gasoline', transmission: 'Manual', engine: 'V8', features: ['Sport Mode'], basePrice: 210000 },
  { make: 'McLaren', model: '720S', body: 'Coupe', fuel: 'Gasoline', transmission: 'Manual', engine: 'V8', features: ['Sport Mode'], basePrice: 210000 },
  { make: 'Aston Martin', model: 'DBX', body: 'SUV', fuel: 'Gasoline', transmission: 'Automatic', engine: 'V12', features: ['AWD', 'Leather'], basePrice: 190000 },
];

const MODELS = [...new Set(templates.map((t) => t.model))];

const badgeOptions = [
  [{ text: 'Certified', cls: 'bg-primary text-on-primary' }],
  [{ text: 'New Arrival', cls: 'bg-primary text-on-primary' }],
  [{ text: 'Price Drop', cls: 'bg-on-tertiary-container text-white' }],
  [{ text: 'Reserved', cls: 'bg-on-tertiary-container text-white' }],
  [{ text: 'Special Offer', cls: 'bg-primary text-on-primary' }],
  [],
];

const fuelIcon = (fuel) =>
  fuel === 'Electric' ? 'electric_car' : fuel === 'Hybrid' ? 'ev_station' : 'local_gas_station';

function buildVehicles() {
  const out = [];
  for (let i = 0; i < 50; i++) {
    const t = templates[i % templates.length];
    const year = 2020 + (i % 5);
    const miles = 500 + (i * 1373) % 30000;
    const priceNum = Math.max(1000, t.basePrice + (((i * 26541) % 9000) | 0) - 4500);
    const drivetrain = t.features.includes('AWD') ? 'AWD' : 'RWD';
    out.push({
      id: i + 1,
      img: imageByMake[t.make] || '/image/hero.jpg',
      badges: badgeOptions[i % badgeOptions.length],
      title: `${year} ${t.make} ${t.model}`,
      price: `$${priceNum.toLocaleString()}`,
      priceNum,
      sub: `· ${miles.toLocaleString()} miles`,
      make: t.make,
      model: t.model,
      year,
      mileage: miles,
      body: t.body,
      fuel: t.fuel,
      transmission: t.transmission,
      engine: t.engine,
      features: t.features,
      category: categorize(t, year),
      city: CITIES[(i * 7) % CITIES.length],
      specs: [
        [fuelIcon(t.fuel), t.fuel],
        ['settings_input_component', t.transmission],
        ['settings_suggest', drivetrain],
      ],
    });
  }
  return out;
}

const vehicles = buildVehicles();

const unique = (key) => [...new Set(templates.map((t) => t[key]))];
const engines = unique('engine');
const transmissions = unique('transmission');
const fuels = unique('fuel');
const makes = ['All Makes', ...unique('make')];

export {
  imageByMake,
  featureTags,
  bodies,
  templates,
  badgeOptions,
  fuelIcon,
  vehicles,
  makes,
  fuels,
  transmissions,
  engines,
  CITIES,
  CATEGORIES,
  MODELS,
  BUDGETS,
  BODY_TYPES,
  BUDGET_RANGES,
  slugify,
  categorize,
  JAPANESE_MAKES,
};
