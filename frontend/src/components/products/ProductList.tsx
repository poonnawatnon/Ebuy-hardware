import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

import { productApi } from '../../services/api';
import ProductCard from './ProductCard';
import { showToast } from '../../utils/toast';
import { Product, ProductResponse } from '../../types/product'; // Make sure this path is correct

interface ProductFilters {
  category?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
}

const ProductList = () => {
  const [filters, setFilters] = useState<ProductFilters>({});
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery<ProductResponse, Error>({
    queryKey: ['products', filters, page],
    queryFn: () => productApi.getProducts({
      ...filters,
      page,
      limit: 12,
      minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
    }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    // Remove keepPreviousData as it's not needed with the current setup
  });

  // Prefetch next page
  useEffect(() => {
    if (data?.meta?.page != null && data?.meta?.lastPage != null && 
        data.meta.page < data.meta.lastPage) {
      queryClient.prefetchQuery({
        queryKey: ['products', filters, page + 1],
        queryFn: () => productApi.getProducts({
          ...filters,
          page: page + 1,
          limit: 12,
          minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
        })
      });
    }
  }, [data, filters, page, queryClient]);

  const handleFilterChange = (field: keyof ProductFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  if (isError && error) {
    return (
      <div className="flex justify-center items-center p-8">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />

        <select
          value={filters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Complete PC">Complete PC</option>
          <option value="Graphics Card">Graphics Card</option>
          <option value="Processor">Processor</option>
          <option value="Motherboard">Motherboard</option>
          <option value="Memory">Memory</option>
          <option value="Storage">Storage</option>
        </select>

        <select
          value={filters.condition || ''}
          onChange={(e) => handleFilterChange('condition', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">All Conditions</option>
          <option value="New">New</option>
          <option value="Like New">Like New</option>
          <option value="Used">Used</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice || ''}
          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice || ''}
          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading ? (
          // Skeleton loading state
          Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
        ) : (
          data?.products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* Load More */}
      {data?.meta?.page != null && 
       data?.meta?.lastPage != null && 
       data.meta.page < data.meta.lastPage && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={isFetching}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetching ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

const ProductCardSkeleton = () => (
  <div className="animate-pulse">
    <div className="bg-gray-200 h-48 rounded-t-lg"></div>
    <div className="p-4 bg-white border-x border-b rounded-b-lg space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
);

export default ProductList;