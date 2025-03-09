import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { formatPrice } from '../../utils/format';
import { productApi } from '../../services/api';
import { Loader2, Plus, Edit, Trash2, Eye, Package } from 'lucide-react';
import { showToast } from '../../utils/toast';
import { Product, ProductResponse } from '../../types/product';
import { useState } from 'react';

export default function SellerListingsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  const { data, isLoading, error, refetch } = useQuery<ProductResponse>({
    queryKey: ['seller-products', filter, sortBy],
    queryFn: () => productApi.getSellerProducts({ 
      status: filter !== 'all' ? filter.toUpperCase() : undefined,
      sortBy
    })
  });

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await productApi.deleteProduct(productId);
        showToast.success('Listing deleted successfully');
        refetch();
      } catch (error: any) {
        // Check if error is related to existing orders
        if (error.response?.status === 400 && error.response?.data?.error === 'Product is referenced in orders') {
          // Ask user if they want to deactivate instead
          if (window.confirm('This product cannot be deleted because it has existing orders. Would you like to mark it as inactive instead?')) {
            try {
              await productApi.updateProduct(productId, { status: 'INACTIVE' });
              showToast.success('Listing marked as inactive');
              refetch();
            } catch (updateError) {
              showToast.error('Failed to update listing status');
            }
          }
        } else {
          showToast.error('Failed to delete listing');
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Error loading listings</h2>
        <p className="mt-2 text-gray-600">Please try again later</p>
      </div>
    );
  }

  const products = data?.products ?? [];
  const meta = data?.meta;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="mt-1 text-gray-600">Manage your product listings</p>
        </div>
        <button
          onClick={() => router.push('/sell')}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Listing
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Listings</option>
            <option value="active">Active</option>
            <option value="sold">Sold</option>
            <option value="reserved">Reserved</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
          </select>
        </div>
      </div>

      {/* Listings */}
      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No listings</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new listing.</p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/sell')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Listing
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="min-w-full divide-y divide-gray-200">
            <div className="bg-gray-50 px-6 py-3">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">Product</div>
                <div className="col-span-2">Price</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Views</div>
                <div className="col-span-2">Actions</div>
              </div>
            </div>

            <div className="divide-y divide-gray-200">
              {products.map((product: Product) => (
                <div key={product.id} className="px-6 py-4">
                  <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4 flex items-center">
                      <div className="h-16 w-16 flex-shrink-0">
                        <img
                          src={product.images[0] || '/placeholder.png'}
                          alt={product.title}
                          className="h-full w-full object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          {product.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {product.category}
                        </p>
                      </div>
                    </div>

                    <div className="col-span-2 font-medium">
                      {formatPrice(product.price)}
                    </div>

                    <div className="col-span-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          product.status === 'SOLD' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'}`}
                      >
                        {product.status}
                      </span>
                    </div>

                    <div className="col-span-2 text-gray-500">
                      {product.views} views
                    </div>

                    <div className="col-span-2 flex space-x-2">
                      <button
                        onClick={() => router.push(`/products/${product.id}`)}
                        className="p-2 text-gray-400 hover:text-blue-500"
                        title="View"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => router.push(`/sell/edit/${product.id}`)}
                        className="p-2 text-gray-400 hover:text-green-500"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 text-gray-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {meta && meta.lastPage > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between">
                <button
                  onClick={() => {
                    const currentPage = Number(router.query.page || 1);
                    if (currentPage > 1) {
                      router.push({
                        query: { ...router.query, page: currentPage - 1 }
                      });
                    }
                  }}
                  disabled={Number(router.query.page || 1) <= 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    const currentPage = Number(router.query.page || 1);
                    if (currentPage < meta.lastPage) {
                      router.push({
                        query: { ...router.query, page: currentPage + 1 }
                      });
                    }
                  }}
                  disabled={Number(router.query.page || 1) >= meta.lastPage}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}