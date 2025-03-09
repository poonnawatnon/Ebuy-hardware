// pages/products/components.tsx
import { useState } from 'react';
import ProductGrid from '../../components/products/ProductGrid';
import { Filter, ChevronRight } from 'lucide-react';

export default function ComponentsPage() {
  const [subcategory, setSubcategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [condition, setCondition] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [formFactor, setFormFactor] = useState('all');

  const subcategories = [
    { value: 'all', label: 'All Components' },
    { value: 'MOTHERBOARD', label: 'Motherboards' },
    { value: 'MEMORY', label: 'RAM Memory' },
    { value: 'STORAGE', label: 'Storage' },
    { value: 'PSU', label: 'Power Supplies' },
    { value: 'CASE', label: 'PC Cases' },
    { value: 'COOLING', label: 'Cooling' },
  ];
  const conditions = [
    { value: 'NEW', label: 'New' },
    { value: 'LIKE_NEW', label: 'Like New' },
    { value: 'USED', label: 'Used' },
  ];

  // Dynamic secondary filters based on subcategory
  const getSecondaryFilter = () => {
    switch (subcategory) {
      case 'MOTHERBOARD':
        return (
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={formFactor}
            onChange={(e) => setFormFactor(e.target.value)}
          >
            <option value="all">All Form Factors</option>
            <option value="ATX">ATX</option>
            <option value="MICRO_ATX">Micro ATX</option>
            <option value="MINI_ITX">Mini ITX</option>
            <option value="E_ATX">E-ATX</option>
          </select>
        );
      case 'MEMORY':
        return (
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={formFactor}
            onChange={(e) => setFormFactor(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="DDR4">DDR4</option>
            <option value="DDR5">DDR5</option>
          </select>
        );
      case 'STORAGE':
        return (
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={formFactor}
            onChange={(e) => setFormFactor(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="SSD">SSD</option>
            <option value="HDD">HDD</option>
            <option value="NVME">NVMe</option>
          </select>
        );
      case 'PSU':
        return (
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={formFactor}
            onChange={(e) => setFormFactor(e.target.value)}
          >
            <option value="all">All Ratings</option>
            <option value="BRONZE">80+ Bronze</option>
            <option value="SILVER">80+ Silver</option>
            <option value="GOLD">80+ Gold</option>
            <option value="PLATINUM">80+ Platinum</option>
            <option value="TITANIUM">80+ Titanium</option>
          </select>
        );
      default:
        return null;
    }
  };

  // Dynamic price ranges based on subcategory
  const getPriceRanges = () => {
    switch (subcategory) {
      case 'MOTHERBOARD':
        return [
          { value: '0-1000', label: 'All Prices' },
          { value: '0-100', label: 'Under $100' },
          { value: '100-200', label: '$100 - $200' },
          { value: '200-300', label: '$200 - $300' },
          { value: '300-1000', label: 'Over $300' },
        ];
      case 'MEMORY':
        return [
          { value: '0-1000', label: 'All Prices' },
          { value: '0-50', label: 'Under $50' },
          { value: '50-100', label: '$50 - $100' },
          { value: '100-200', label: '$100 - $200' },
          { value: '200-1000', label: 'Over $200' },
        ];
      default:
        return [
          { value: '0-1000', label: 'All Prices' },
          { value: '0-100', label: 'Under $100' },
          { value: '100-300', label: '$100 - $300' },
          { value: '300-500', label: '$300 - $500' },
          { value: '500-1000', label: 'Over $500' },
        ];
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header with Breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <span>Components</span>
          {subcategory !== 'all' && (
            <>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-900">
                {subcategories.find(s => s.value === subcategory)?.label}
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">PC Components</h1>
        <p className="mt-2 text-gray-600">
          Quality computer parts for your custom build or upgrade
        </p>
      </div>

      {/* Subcategory Navigation */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {subcategories.map((sub) => (
          <button
            key={sub.value}
            onClick={() => {
              setSubcategory(sub.value);
              setFormFactor('all'); // Reset secondary filter when changing subcategory
            }}
            className={`p-3 rounded-lg text-center transition-colors ${
              subcategory === sub.value
                ? 'bg-purple-600 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Filters Section */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="font-medium text-gray-700">Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Secondary Filter (Form Factor/Type) */}
          {getSecondaryFilter()}

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
          </select>
        </div>
      </div>

      {/* Product Grid */}
      <ProductGrid
        category="COMPONENTS"
        filter={{
          subcategory: subcategory !== 'all' ? subcategory : undefined,
          formFactor: formFactor !== 'all' ? formFactor : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          condition: condition !== 'all' ? condition : undefined,
          sortBy,
        }}
      />
    </div>
  );
}