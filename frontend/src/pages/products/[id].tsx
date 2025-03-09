import { useRouter } from 'next/router';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Heart, Share2 } from 'lucide-react';
import { formatPrice } from '../../utils/format';
import { useCart } from '../../context/CartContext';
import { productApi } from '../../services/api';
import { showToast } from '../../utils/toast';
import { useAuth } from '../../context/AuthContext';
import { ProductDetailResponse } from '../../types/product';

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { addToCart, isLoading: isAddingToCart } = useCart();
  const { isLoggedIn, userId } = useAuth();
  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProduct(id as string),
    enabled: !!id,
  });

  // Loading state
  if (isLoading || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Error loading product</h2>
          <p className="mt-2 text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  const isOwnProduct = userId === product.sellerId;
  const isOutOfStock = product.quantity === 0;

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    try {
      await addToCart(product.id);
      // showToast.success('Added to cart successfully'); // already shown toast in Cartcontext
    } catch (error) {
      // Error handling is done in the cart context
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-lg overflow-hidden">
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-center object-cover"
              />
            )}
          </div>
          
          {/* Thumbnail Images */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-6 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-w-1 aspect-h-1 rounded-md overflow-hidden border-2 
                    ${selectedImage === index ? 'border-purple-500' : 'border-transparent'}`}
                >
                  <img
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    className="w-full h-full object-center object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            <div className="mt-2 flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(product.price)}
              </span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full
                ${product.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.status}
              </span>
            </div>
          </div>

          {/* Seller Info */}
          <div className="border-t border-b border-gray-200 py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">
                    {product.seller.username[0].toUpperCase()}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Sold by {product.seller.username}
                </p>
                <p className="text-sm text-gray-500">
                  Member since {new Date(product.createdAt).getFullYear()}
                </p>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Details</h3>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Condition</p>
                  <p className="text-sm font-medium text-gray-900">{product.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="text-sm font-medium text-gray-900">{product.category}</p>
                </div>
                {product.specs && Object.entries(product.specs).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-gray-500">{key}</p>
                    <p className="text-sm font-medium text-gray-900">{value as string}</p>
                  </div>
                ))}
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                <p className="mt-2 text-sm text-gray-600">{product.description}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleAddToCart}
                disabled={isAddingToCart || isOwnProduct || isOutOfStock}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent 
                  rounded-md shadow-sm text-base font-medium text-white bg-purple-600 hover:bg-purple-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingToCart ? 'Adding...' : 
                 isOwnProduct ? 'Your Product' :
                 isOutOfStock ? 'Out of Stock' :
                 'Add to Cart'}
                <ShoppingCart className="ml-2 h-5 w-5" />
              </button>
              
              <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 
                rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                Save
                <Heart className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
