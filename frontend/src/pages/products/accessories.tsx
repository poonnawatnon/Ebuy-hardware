import { useState } from 'react';
import ProductGrid from '../../components/products/ProductGrid';
import { Filter, ChevronRight, Tag, Star } from 'lucide-react';
import { ProductCondition } from '../../types/product';
export default function AccessoriesPage() {
  const [subcategory, setSubcategory] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortBy, setSortBy] = useState('newest');
  const [featured, setFeatured] = useState(false);
  const [condition, setCondition] = useState('all');

  const subcategories = [
    { value: 'all', label: 'All Accessories', icon: '🎮' },
    { value: 'CABLES', label: 'Cables & Adapters', icon: '🔌' },
    { value: 'TOOLS', label: 'Tools & Equipment', icon: '🔧' },
    { value: 'THERMAL_PASTE', label: 'Thermal Products', icon: '❄️' },
    { value: 'FANS', label: 'Case Fans', icon: '💨' },
    { value: 'RGB', label: 'RGB & Lighting', icon: '💡' },
    { value: 'CLEANING', label: 'Cleaning Products', icon: '🧹' },
    { value: 'STANDS', label: 'Stands & Mounts', icon: '📺' }
  ];

  // Get subcategory specific featured items
  const getFeaturedItems = () => {
    switch (subcategory) {
      case 'CABLES':
        return ['100k LAN Cable', '9-ARM LAN CABLE', 'forsen'];
      case 'TOOLS':
        return ['LTT Screwdriver Sets', 'Anti-Static Equipment', 'Cable Management'];
      case 'THERMAL_PASTE':
        return ['not thermalpaste sadE', 'Arctic Silver', 'Noctua NT-H1'];
      default:
        return [];
    }
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
          <span>Accessories</span>
          {subcategory !== 'all' && (
            <>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-gray-900">
                {subcategories.find(s => s.value === subcategory)?.label}
              </span>
            </>
          )}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">PC Accessories</h1>
        <p className="mt-2 text-gray-600">
          Essential accessories to complete your PC build and setup
        </p>
      </div>

      {/* Subcategory Navigation */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {subcategories.map((sub) => (
          <button
            key={sub.value}
            onClick={() => setSubcategory(sub.value)}
            className={`p-4 rounded-lg text-center transition-all hover:transform hover:-translate-y-1 
              ${subcategory === sub.value
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-200 hover:shadow'
              }`}
          >
            <div className="text-2xl mb-2">{sub.icon}</div>
            <div className="text-sm">{sub.label}</div>
          </button>
        ))}
      </div>

      {/* Featured Items (if any) */}
      {getFeaturedItems().length > 0 && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg font-medium text-gray-900">Featured {subcategories.find(s => s.value === subcategory)?.label}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {getFeaturedItems().map((item, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg 
                  border border-purple-200 flex items-center justify-between cursor-pointer
                  hover:shadow-md transition-shadow"
              >
                <span className="text-purple-900">{item}</span>
                <Tag className="w-5 h-5 text-purple-600" />
              </div>
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
             {/* Condition Filter */}
    <select
      className="rounded-md border-gray-300 px-3 py-2"
      value={condition}
      onChange={(e) => setCondition(e.target.value as ProductCondition | 'all')}
    >
      <option value="all">All Conditions</option>
      {conditions.map((c) => (
        <option key={c.value} value={c.value}>
          {c.label}
        </option>
      ))}
    </select>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Price Range Filter */}
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={`${priceRange[0]}-${priceRange[1]}`}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-').map(Number);
              setPriceRange([min, max]);
            }}
          >
            <option value="0-200">All Prices</option>
            <option value="0-20">Under $20</option>
            <option value="20-50">$20 - $50</option>
            <option value="50-100">$50 - $100</option>
            <option value="100-200">Over $100</option>
          </select>
              
          {/* Featured Toggle */}
          <button
            onClick={() => setFeatured(!featured)}
            className={`px-4 py-2 rounded-md border ${
              featured
                ? 'bg-purple-50 border-purple-200 text-purple-700'
                : 'border-gray-300 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              <span>Featured Items</span>
            </div>
          </button>
          

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
        category="ACCESSORIES"
        filter={{
          subcategory: subcategory !== 'all' ? subcategory : undefined,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          featured: featured,
          condition: condition !== 'all' ? condition as ProductCondition : undefined,
          sortBy,
          
        }}
      />
    </div>
  );
}