import { useState } from 'react';
import ProductGrid from '../../components/products/ProductGrid';
import { Filter, ChevronRight, Server, Cpu, Monitor, Shield } from 'lucide-react';
import { ProductCondition } from '../../types/product';

export default function OtherSystemsPage() {
  const [subcategory, setSubcategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [purpose, setPurpose] = useState('all');
  const [condition, setCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const subcategories = [
    {
      value: 'WORKSTATION',
      label: 'Workstations',
      icon: Monitor,
      description: 'High-performance computers for professional work'
    },
    {
      value: 'SERVER',
      label: 'Servers',
      icon: Server,
      description: 'Enterprise and home server solutions'
    },
    {
      value: 'MINI_PC',
      label: 'Mini PCs',
      icon: Cpu,
      description: 'Compact and space-saving computers'
    }
  ];

  const purposeOptions = {
    WORKSTATION: [
      { value: 'all', label: 'All Purposes' },
      { value: '3D_RENDERING', label: '3D Rendering' },
      { value: 'VIDEO_EDITING', label: 'Video Editing' },
      { value: 'CAD', label: 'CAD/CAM' },
      { value: 'DEVELOPMENT', label: 'Software Development' },
    ],
    SERVER: [
      { value: 'all', label: 'All Purposes' },
      { value: 'FILE_SERVER', label: 'File Server' },
      { value: 'WEB_SERVER', label: 'Web Server' },
      { value: 'DATABASE', label: 'Database Server' },
      { value: 'VIRTUALIZATION', label: 'Virtualization' },
    ],
    MINI_PC: [
      { value: 'all', label: 'All Purposes' },
      { value: 'HOME_THEATER', label: 'Home Theater' },
      { value: 'OFFICE', label: 'Office Use' },
      { value: 'LIGHT_GAMING', label: 'Light Gaming' },
      { value: 'HTPC', label: 'HTPC' },
    ],
  };
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
          <span>Systems</span>
          {subcategory !== 'all' && (
            <>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-900">
                {subcategories.find(s => s.value === subcategory)?.label}
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Specialized Systems</h1>
        <p className="mt-2 text-gray-600">
          Professional workstations, servers, and compact computing solutions
        </p>
      </div>

      {/* System Type Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {subcategories.map((system) => {
          const IconComponent = system.icon;
          return (
            <button
              key={system.value}
              onClick={() => setSubcategory(system.value)}
              className={`p-6 rounded-xl text-left transition-all ${
                subcategory === system.value
                  ? 'bg-purple-600 text-white shadow-lg scale-105'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-200 hover:shadow'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  subcategory === system.value ? 'bg-purple-500' : 'bg-purple-50'
                }`}>
                  <IconComponent className={`w-6 h-6 ${
                    subcategory === system.value ? 'text-white' : 'text-purple-600'
                  }`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{system.label}</h3>
                  <p className={`mt-1 text-sm ${
                    subcategory === system.value ? 'text-purple-100' : 'text-gray-500'
                  }`}>
                    {system.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Filters Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Purpose Filter */}
          {subcategory !== 'all' && (
            <select
              className="rounded-md border border-gray-300 px-3 py-2"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            >
              {purposeOptions[subcategory as keyof typeof purposeOptions]?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}

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
            <option value="1000-2500">$1,000 - $2,500</option>
            <option value="2500-5000">$2,500 - $5,000</option>
            <option value="5000-10000">Over $5,000</option>
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

      {/* Additional Info Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {subcategory === 'WORKSTATION' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <Shield className="w-5 h-5" />
              <h3 className="font-medium">Workstation Guarantee</h3>
            </div>
            <p className="text-sm text-blue-600">
              All workstations are tested for stability and performance under professional workloads
            </p>
          </div>
        )}
        {subcategory === 'SERVER' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <Shield className="w-5 h-5" />
              <h3 className="font-medium">Server Reliability</h3>
            </div>
            <p className="text-sm text-green-600">
              Enterprise-grade servers with verified uptime and performance metrics
            </p>
          </div>
        )}
      </div>

      {/* Product Grid */}
      <ProductGrid
        category="OTHER_SYSTEMS"
        filter={{
          subcategory: subcategory !== 'all' ? subcategory : undefined,
          purpose: purpose !== 'all' ? purpose : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          condition: condition !== 'all' ? condition as ProductCondition : undefined,
          sortBy,
        }}
      />
    </div>
  );
}