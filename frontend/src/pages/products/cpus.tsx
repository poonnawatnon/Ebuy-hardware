import { useState } from 'react';
import ProductGrid from '../../components/products/ProductGrid';
import { Filter, ChevronRight, Cpu, Zap, Microchip, Activity } from 'lucide-react';
import IntelLogo from '../../../public/images/intel-logo.png';
import AMDLogo from '../../../public/images/AMD-Logo.png';
import { ProductCondition } from '../../types/product';

export default function CpusPage() {
  const [manufacturer, setManufacturer] = useState('all');
  const [series, setSeries] = useState('all');
  const [cores, setCores] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [condition, setCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    {
      value: 'INTEL',
      label: 'Intel Processors',
      icon: () => <img src={IntelLogo.src} alt="INTEL" className="w-12 h-12 object-contain" />,
      description: 'intel Core i3, i5, i7 & i9 Processors',
      color: 'from-blue-50 to-blue-100',
      hoverColor: 'hover:border-blue-200',
      selectedBg: 'bg-blue-600',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      series: [
        { value: 'i9', label: 'Core i9' },
        { value: 'i7', label: 'Core i7' },
        { value: 'i5', label: 'Core i5' },
        { value: 'i3', label: 'Core i3' }
      ]
    },
    {
      value: 'AMD',
      label: 'AMD Processors',
      icon: () => <img src={AMDLogo.src} alt="INTEL" className="w-16 h-16 object-contain" />,
      description: 'Ryzen 3, 5, 7 & 9 Processors',
      color: 'from-red-50 to-red-100',
      hoverColor: 'hover:border-red-200',
      selectedBg: 'bg-red-600',
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      series: [
        { value: 'ryzen9', label: 'Ryzen 9' },
        { value: 'ryzen7', label: 'Ryzen 7' },
        { value: 'ryzen5', label: 'Ryzen 5' },
        { value: 'ryzen3', label: 'Ryzen 3' }
      ]
    },
    {
      value: 'SERVER',
      label: 'Server CPUs',
      icon: Zap,
      description: 'Xeon & EPYC Processors',
      color: 'from-purple-50 to-purple-100',
      hoverColor: 'hover:border-purple-200',
      selectedBg: 'bg-purple-600',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      series: [
        { value: 'xeon', label: 'Intel Xeon' },
        { value: 'epyc', label: 'AMD EPYC' }
      ]
    }
  ];

  const coreOptions = [
    { value: 'all', label: 'All Core Counts' },
    { value: '4', label: '4 Cores' },
    { value: '6', label: '6 Cores' },
    { value: '8', label: '8 Cores' },
    { value: '12', label: '12 Cores' },
    { value: '16', label: '16+ Cores' }
  ];
  const conditions = [
    { value: 'NEW', label: 'New' },
    { value: 'LIKE_NEW', label: 'Like New' },
    { value: 'USED', label: 'Used' }
  ] as const;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>Processors</span>
          {manufacturer !== 'all' && (
            <>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-900">
                {categories.find(c => c.value === manufacturer)?.label}
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Processors (CPUs)</h1>
        <p className="mt-2 text-gray-600">
          High-performance processors for gaming, workstation, and server builds
        </p>
      </div>

      {/* CPU Type Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.value}
              onClick={() => {
                setManufacturer(category.value);
                setSeries('all'); // Reset series when changing manufacturer
              }}
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

      {/* Performance Tiers */}
      {manufacturer !== 'all' && (
        <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-medium text-gray-900">Processor Series</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories
              .find(c => c.value === manufacturer)
              ?.series.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSeries(s.value)}
                  className={`p-3 rounded-lg text-center transition-colors ${
                    series === s.value
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Core Count Filter */}
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={cores}
            onChange={(e) => setCores(e.target.value)}
          >
            {coreOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
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
            <option value="0-2000">All Prices</option>
            <option value="0-200">Under $200</option>
            <option value="200-400">$200 - $400</option>
            <option value="400-600">$400 - $600</option>
            <option value="600-1000">$600 - $1,000</option>
            <option value="1000-2000">Over $1,000</option>
          </select>

          {/* Condition Filter */}
          <select className="rounded-md border border-gray-300 px-3 py-2"value={condition}
              onChange={(e) => setCondition(e.target.value as ProductCondition | 'all')}>
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
        category="CPUS"
        filter={{
          subcategory: manufacturer !== 'all' ? manufacturer : undefined,
          manufacturer: manufacturer !== 'all' ? manufacturer : undefined,
          series: series !== 'all' ? series : undefined,
          cores: cores !== 'all' ? cores : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          condition: condition !== 'all' ? condition : undefined,
          sortBy,
        }}
      />
    </div>
  );
}