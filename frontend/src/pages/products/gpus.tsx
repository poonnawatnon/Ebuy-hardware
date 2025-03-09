import { useState } from 'react';
import ProductGrid from '../../components/products/ProductGrid';
import { Filter, ChevronRight, Cpu, Monitor, Zap, Activity } from 'lucide-react';
import NvidiaLogo from '../../../public/images/Nvidia-logo.png';
import RadeonLogo from '../../../public/images/RADEON-Logo.png';
import { ProductCondition } from '../../types/product';

export default function GpusPage() {
  const [manufacturer, setManufacturer] = useState('all');
  const [memorySize, setMemorySize] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [condition, setCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    {
      value: 'NVIDIA',
      label: 'NVIDIA GPUs',
      icon: () => <img src={NvidiaLogo.src} alt="NVIDIA" className="w-12 h-12 object-contain" />,
      description: 'GeForce RTX & GTX Graphics Cards',
      color: 'from-green-50 to-green-100',
      hoverColor: 'hover:border-green-200',
      selectedBg: 'bg-green-600',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      value: 'AMD',
      label: 'AMD GPUs',
      icon: () => <img src={RadeonLogo.src} alt="AMD" className="w-16 h-16 object-contain" />,
      description: 'Radeon RX Graphics Cards',
      color: 'from-red-50 to-red-100',
      hoverColor: 'hover:border-red-200',
      selectedBg: 'bg-red-600',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600'
    },
    {
      value: 'WORKSTATION',
      label: 'Workstation GPUs',
      icon: Zap,
      description: 'Professional Graphics Solutions',
      color: 'from-blue-50 to-blue-100',
      hoverColor: 'hover:border-blue-200',
      selectedBg: 'bg-blue-600',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    }
  ];

  const memorySizes = [
    { value: '4GB', label: '4GB VRAM' },
    { value: '6GB', label: '6GB VRAM' },
    { value: '8GB', label: '8GB VRAM' },
    { value: '10GB', label: '10GB VRAM' },
    { value: '12GB', label: '12GB VRAM' },
    { value: '16GB', label: '16GB VRAM' },
    { value: '24GB', label: '24GB VRAM' }
  ];

  const conditions = [
    { value: 'NEW', label: 'New' },
    { value: 'LIKE_NEW', label: 'Like New' },
    { value: 'USED', label: 'Used' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>Graphics Cards</span>
          {manufacturer !== 'all' && (
            <>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-900">
                {categories.find(c => c.value === manufacturer)?.label}
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Graphics Cards</h1>
        <p className="mt-2 text-gray-600">
          High-performance GPUs for gaming and professional use
        </p>
      </div>

      {/* GPU Type Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.value}
              onClick={() => setManufacturer(category.value)}
              className={`p-6 rounded-xl text-left transition-all ${
                manufacturer === category.value
                  ? `${category.selectedBg} text-white shadow-lg scale-105`
                  : `bg-gradient-to-r ${category.color} border border-gray-200 text-gray-700 ${category.hoverColor} hover:shadow`
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  manufacturer === category.value ? 'bg-white/20' : category.iconBg
                }`}>
                  <IconComponent className={`w-6 h-6 ${
                    manufacturer === category.value ? 'text-white' : category.iconColor
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{category.label}</h3>
                  <p className={`mt-1 text-sm ${
                    manufacturer === category.value ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {category.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Performance Indicator */}
      {manufacturer !== 'all' && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-medium text-gray-900">Performance Range</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {manufacturer === 'NVIDIA' && (
              <>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Entry Level</div>
                  <div className="text-xs text-gray-500">RTX 3050, RTX 3060</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Mid Range</div>
                  <div className="text-xs text-gray-500">RTX 3070, RTX 3080</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">High End</div>
                  <div className="text-xs text-gray-500">RTX 3090, RTX 4090</div>
                </div>
              </>
            )}
            {manufacturer === 'AMD' && (
              <>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Entry Level</div>
                  <div className="text-xs text-gray-500">RTX 3050, RTX 3060</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">Mid Range</div>
                  <div className="text-xs text-gray-500">RTX 3070, RTX 3080</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-600">High End</div>
                  <div className="text-xs text-gray-500">RTX 3090, RTX 4090</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>
          
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Memory Size Filter */}
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={memorySize}
            onChange={(e) => setMemorySize(e.target.value)}
          >
            <option value="all">All Memory Sizes</option>
            {memorySizes.map((size) => (
              <option key={size.value} value={size.value}>{size.label}</option>
            ))}
          </select>

          {/* Price Range Filter */}
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={`${priceRange[0]}-${priceRange[1]}`}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-').map(Number);
              setPriceRange([min, max]);
            }}
          >
            <option value="0-5000">All Prices</option>
            <option value="0-300">Under $300</option>
            <option value="300-500">$300 - $500</option>
            <option value="500-1000">$500 - $1,000</option>
            <option value="1000-2000">$1,000 - $2,000</option>
            <option value="2000-5000">Over $2,000</option>
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
            <option value="performance">Performance Score</option>
          </select>
        </div>
      </div>
            
      {/* Product Grid */}
      <ProductGrid
        category="GPUS"
        filter={{
          subcategory: manufacturer !== 'all' ? manufacturer : undefined,
          memorySize: memorySize !== 'all' ? memorySize : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          condition: condition !== 'all' ? condition as ProductCondition : undefined,
          sortBy,
        }}
      />
    </div>
  );
}