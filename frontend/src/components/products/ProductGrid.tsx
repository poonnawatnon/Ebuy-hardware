import { useQuery } from '@tanstack/react-query';
import { productApi } from '../../services/api';
import ProductCard from './ProductCard';
import { Product } from '../../types/product';
import { Loader2 } from 'lucide-react';

interface ProductGridProps {
  category?: string;
  searchQuery?: string;
  filter?: Record<string, any>;
}

export default function ProductGrid({ category, searchQuery, filter }: ProductGridProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['products', category, searchQuery, filter],
    queryFn: () => productApi.getProducts({ 
      category, 
      search: searchQuery,
      status: 'ACTIVE',
      ...filter
    })
  });

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Error loading products. Please try again later.</p>
      </div>
    );
  }

  if (!data?.products?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No products found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.products.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}