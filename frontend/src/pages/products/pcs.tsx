import { useState } from 'react';
import ProductGrid from '../../components/products/ProductGrid';
import { Filter, ChevronRight, Cpu, Monitor, Zap } from 'lucide-react';
import { ProductCondition } from '../../types/product';

export default function GamingPcsPage() {
  const [subcategory, setSubcategory] = useState('all');
  const [style, setStyle] = useState('all');
  const [type, setType] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [processor, setProcessor] = useState('all');
  const [gpu, setGpu] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [condition, setCondition] = useState('all');

  const pcTypes = [
    {
      value: 'PREBUILT',
      label: 'Pre-built PCs',
      icon: Cpu,
      description: 'Ready-to-go gaming computers',
      color: 'from-blue-50 to-blue-100',
      hoverColor: 'hover:border-blue-200',
      selectedBg: 'bg-blue-600',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      value: 'CUSTOM',
      label: 'Custom Built PCs',
      icon: Monitor,
      description: 'Tailored gaming rigs',
      color: 'from-green-50 to-green-100',
      hoverColor: 'hover:border-green-200',
      selectedBg: 'bg-green-600',
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
    {
      value: 'REFURBISHED',
      label: 'Refurbished PCs',
      icon: Zap,
      description: 'Pre-owned, restored to full functionality',
      color: 'from-yellow-50 to-yellow-100',
      hoverColor: 'hover:border-yellow-200',
      selectedBg: 'bg-yellow-600',
      iconBg: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
    },
  ];

  const processors = [
    { value: 'all', label: 'All CPUs' },
    { value: 'intel-i9', label: 'Intel Core i9' },
    { value: 'intel-i7', label: 'Intel Core i7' },
    { value: 'intel-i5', label: 'Intel Core i5' },
    { value: 'amd-r9', label: 'AMD Ryzen 9' },
    { value: 'amd-r7', label: 'AMD Ryzen 7' },
    { value: 'amd-r5', label: 'AMD Ryzen 5' },
  ];

  const gpus = [
    { value: 'all', label: 'All GPUs' },
    { value: 'rtx-4090', label: 'RTX 4090' },
    { value: 'rtx-4080', label: 'RTX 4080' },
    { value: 'rtx-4070', label: 'RTX 4070' },
    { value: 'rx-7900', label: 'RX 7900 XT' },
    { value: 'rx-7800', label: 'RX 7800 XT' },
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
          <span>Gaming PCs</span>
          {type !== 'all' && (
            <>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-900">
                {pcTypes.find((t) => t.value === type)?.label}
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Gaming PCs</h1>
        <p className="mt-2 text-gray-600">
          Discover high-performance gaming computers built for every level of gamer
        </p>
      </div>

      {/* PC Type Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {pcTypes.map((pcType) => {
          const IconComponent = pcType.icon;
          return (
            <button
              key={pcType.value}
              onClick={() => {
                setSubcategory(pcType.value);
                setStyle('all'); // Reset style when changing category
              }}
              
              className={`p-6 rounded-xl text-left transition-all ${
                type === pcType.value
                  ? `${pcType.selectedBg} text-white shadow-lg scale-105`
                  : `bg-gradient-to-r ${pcType.color} border border-gray-200 text-gray-700 ${pcType.hoverColor} hover:shadow`
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    type === pcType.value ? 'bg-white/20' : pcType.iconBg
                  }`}
                >
                  <IconComponent
                    className={`w-6 h-6 ${
                      type === pcType.value ? 'text-white' : pcType.iconColor
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{pcType.label}</h3>
                  <p
                    className={`mt-1 text-sm ${
                      type === pcType.value ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {pcType.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filters Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Processor Filter */}
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={processor}
            onChange={(e) => setProcessor(e.target.value)}
          >
            {processors.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          {/* GPU Filter */}
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={gpu}
            onChange={(e) => setGpu(e.target.value)}
          >
            {gpus.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
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
            <option value="0-10000">All Prices</option>
            <option value="0-1000">Under $1,000</option>
            <option value="1000-2000">$1,000 - $2,000</option>
            <option value="2000-3000">$2,000 - $3,000</option>
            <option value="3000-10000">Over $3,000</option>
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
            <option value="performance">Performance</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        category="GAMING_PCS"
        filter={{
          subcategory: subcategory !== 'all' ? subcategory : undefined,
          type: type !== 'all' ? type : undefined,
          processor: processor !== 'all' ? processor : undefined,
          gpu: gpu !== 'all' ? gpu : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sortBy,
          condition: condition !== 'all' ? condition as ProductCondition : undefined,
        }}
      />
    </div>
  );
}