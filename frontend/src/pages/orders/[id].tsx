import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { formatPrice } from '../../utils/format';
import { Loader2, Package, MapPin, Clock } from 'lucide-react';
import { showToast } from '../../utils/toast';

interface Order {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  // ... other fields
}
interface UpdateStatusRequest {
  status: Order['status'];
}
export default function OrderConfirmationPage() {
  const router = useRouter();
  const { id } = router.query;

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3001/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      return response.json();
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600">Error loading order</h2>
        <p className="mt-2 text-gray-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Order Status Banner */}
      <div className="bg-green-50 rounded-lg p-6 mb-8">
        <div className="flex items-center">
          <Package className="h-8 w-8 text-green-600" />
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-green-900">
              Order Confirmed!
            </h1>
            <p className="text-green-700 mt-1">
              Thank you for your purchase. We'll send you shipping updates via email.
            </p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Order #{order?.id?.slice(-8)}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Placed on {new Date(order?.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {order?.status}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
          <div className="space-y-4">
            {order?.items.map((item: any) => (
              <div key={item.id} className="flex items-center">
                <div className="h-16 w-16 flex-shrink-0">
                  <img
                    src={item.product.images[0] || '/placeholder.png'}
                    alt={item.product.title}
                    className="h-full w-full object-cover rounded-md"
                  />
                </div>
                <div className="ml-4 flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {item.product.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center mb-4">
            <MapPin className="h-5 w-5 text-gray-400" />
            <h3 className="ml-2 text-lg font-medium text-gray-900">
              Shipping Address
            </h3>
          </div>
          <div className="text-sm text-gray-600">
            {order?.shippingAddress.fullName}<br />
            {order?.shippingAddress.address1}<br />
            {order?.shippingAddress.address2 && <>{order.shippingAddress.address2}<br /></>}
            {order?.shippingAddress.city}, {order?.shippingAddress.state} {order?.shippingAddress.zipCode}
          </div>
        </div>

        {/* Order Summary */}
        <div className="border-t border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Order Summary
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">{formatPrice(order?.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">Free</span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between">
                <span className="text-base font-medium text-gray-900">Total</span>
                <span className="text-base font-medium text-gray-900">
                  {formatPrice(order?.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Shopping Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => router.push('/products')}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
}