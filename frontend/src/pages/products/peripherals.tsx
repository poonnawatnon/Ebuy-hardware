import { useState } from 'react';
import ProductGrid from '../../components/products/ProductGrid';
import { Filter, ChevronRight, Monitor, Keyboard, Mouse, Headphones, Speaker, Camera, Gamepad, Star } from 'lucide-react';
import { ProductCondition } from '../../types/product';

export default function PeripheralsPage() {
  const [subcategory, setSubcategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [brand, setBrand] = useState('all');
  const [style, setStyle] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [condition, setCondition] = useState('all');

  const categories = [
    {
      value: 'MONITOR',
      label: 'Monitors',
      icon: Monitor,
      description: 'Gaming & Professional Displays',
      color: 'from-blue-50 to-blue-100',
      hoverColor: 'hover:border-blue-200',
      selectedBg: 'bg-blue-600',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      styles: [
        { value: 'gaming', label: 'Gaming' },
        { value: 'professional', label: 'Professional' },
        { value: 'ultrawide', label: 'Ultrawide' },
        { value: '4k', label: '4K/5K' }
      ]
    },
    {
      value: 'KEYBOARD',
      label: 'Keyboards',
      icon: Keyboard,
      description: 'Mechanical & Membrane Keyboards',
      color: 'from-purple-50 to-purple-100',
      hoverColor: 'hover:border-purple-200',
      selectedBg: 'bg-purple-600',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      styles: [
        { value: 'mechanical', label: 'Mechanical' },
        { value: 'membrane', label: 'Membrane' },
        { value: 'wireless', label: 'Wireless' },
        { value: 'compact', label: 'Compact' }
      ]
    },
    {
      value: 'MOUSE',
      label: 'Mice',
      icon: Mouse,
      description: 'Gaming & Ergonomic Mice',
      color: 'from-red-50 to-red-100',
      hoverColor: 'hover:border-red-200',
      selectedBg: 'bg-red-600',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      styles: [
        { value: 'gaming', label: 'Gaming' },
        { value: 'wireless', label: 'Wireless' },
        { value: 'ergonomic', label: 'Ergonomic' },
        { value: 'lightweight', label: 'Lightweight' }
      ]
    },
    {
      value: 'HEADSET',
      label: 'Headsets',
      icon: Headphones,
      description: 'Gaming & Audio Headsets',
      color: 'from-green-50 to-green-100',
      hoverColor: 'hover:border-green-200',
      selectedBg: 'bg-green-600',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      styles: [
        { value: 'gaming', label: 'Gaming' },
        { value: 'wireless', label: 'Wireless' },
        { value: 'studio', label: 'Studio' },
        { value: 'noise-cancelling', label: 'Noise Cancelling' }
      ]
    },
    {
      value: 'SPEAKERS',
      label: 'Speakers',
      icon: Speaker,
      description: 'Desktop & Gaming Speakers',
      color: 'from-yellow-50 to-yellow-100',
      hoverColor: 'hover:border-yellow-200',
      selectedBg: 'bg-yellow-600',
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      styles: [
        { value: 'stereo', label: 'Stereo' },
        { value: 'surround', label: 'Surround' },
        { value: 'soundbar', label: 'Soundbar' },
        { value: 'bluetooth', label: 'Bluetooth' }
      ]
    },
    {
      value: 'WEBCAM',
      label: 'Webcams',
      icon: Camera,
      description: 'Streaming & Conference Cameras',
      color: 'from-indigo-50 to-indigo-100',
      hoverColor: 'hover:border-indigo-200',
      selectedBg: 'bg-indigo-600',
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      styles: [
        { value: 'streaming', label: 'Streaming' },
        { value: 'conference', label: 'Conference' },
        { value: '4k', label: '4K' },
        { value: 'webcam', label: 'Webcam' }
      ]
    }
  ];

  const conditions = [
    { value: 'NEW', label: 'New' },
    { value: 'LIKE_NEW', label: 'Like New' },
    { value: 'USED', label: 'Used' },
  ];

  const getPriceRanges = () => {
    switch (subcategory) {
      case 'MONITOR':
        return [
          { value: '0-2000', label: 'All Prices' },
          { value: '0-200', label: 'Under $200' },
          { value: '200-500', label: '$200 - $500' },
          { value: '500-1000', label: '$500 - $1,000' },
          { value: '1000-2000', label: 'Over $1,000' }
        ];
      default:
        return [
          { value: '0-500', label: 'All Prices' },
          { value: '0-50', label: 'Under $50' },
          { value: '50-100', label: '$50 - $100' },
          { value: '100-200', label: '$100 - $200' },
          { value: '200-500', label: 'Over $200' }
        ];
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>Peripherals</span>
          {subcategory !== 'all' && (
            <>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-900">
                {categories.find(c => c.value === subcategory)?.label}
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Gaming Peripherals</h1>
        <p className="mt-2 text-gray-600">
          Premium peripherals for gaming and professional use
        </p>
      </div>

      {/* Peripheral Type Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.value}
              onClick={() => {
                setSubcategory(category.value);
                setStyle('all'); // Reset style when changing category
              }}
              className={`p-6 rounded-xl text-left transition-all ${
                subcategory === category.value
                  ? `${category.selectedBg} text-white shadow-lg scale-105`
                  : `bg-gradient-to-r ${category.color} border border-gray-200 text-gray-700 ${category.hoverColor} hover:shadow`
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  subcategory === category.value ? 'bg-white/20' : category.iconBg
                }`}>
                  <IconComponent className={`w-6 h-6 ${
                    subcategory === category.value ? 'text-white' : category.iconColor
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{category.label}</h3>
                  <p className={`mt-1 text-sm ${
                    subcategory === category.value ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Styles Section */}
      {subcategory !== 'all' && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-medium text-gray-900">Styles</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories
              .find(c => c.value === subcategory)
              ?.styles.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    style === s.value
                      ? 'bg-purple-100 text-purple-700 border-purple-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">{s.label}</div>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Price Range Filter */}
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={`${priceRange[0]}-${priceRange[1]}`}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-').map(Number);
              setPriceRange([min, max]);
            }}
          >
            {getPriceRanges().map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>

          {/* Brand Filter */}
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          >
            <option value="all">All Brands</option>
            <option value="logitech">Logitech</option>
            <option value="razer">Razer</option>
            <option value="corsair">Corsair</option>
            <option value="steelseries">SteelSeries</option>
          </select>

          {/* Condition Filter */}
          <select
              className="rounded-md border border-gray-300 px-3 py-2"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}>
              <option value="all">All Conditions</option>
              {conditions.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

          {/* Sort */}
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        category="PERIPHERALS"
        filter={{
          subcategory: subcategory !== 'all' ? subcategory : undefined,
          style: style !== 'all' ? style : undefined,
          brand: brand !== 'all' ? brand : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sortBy,
          condition: condition !== 'all' ? condition as ProductCondition : undefined,
        }}
      />
    </div>
  );
}