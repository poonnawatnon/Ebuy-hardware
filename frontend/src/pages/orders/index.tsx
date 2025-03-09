import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { formatPrice } from '../../utils/format';
import { Loader2, Package, Eye, ChevronRight } from 'lucide-react';

export default function OrdersPage() {
  const router = useRouter();

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['buyer-orders'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    }
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Error loading orders</h2>
          <p className="mt-2 text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-2 text-gray-600">Track and manage your orders</p>
      </div>

      {orders?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
          <p className="mt-1 text-sm text-gray-500">You haven't made any orders yet.</p>
          <div className="mt-6">
            <button
              onClick={() => router.push('/products')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Start Shopping
              <ChevronRight className="ml-2 -mr-1 h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="divide-y divide-gray-200">
            {orders?.map((order: any) => (
              <div key={order.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium">Order #{order.id.slice(-8)}</h2>
                    <p className="text-sm text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex flex-col space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center">
                        <div className="h-20 w-20 flex-shrink-0">
                          <img
                            src={item.product.images[0] || '/placeholder.png'}
                            alt={item.product.title}
                            className="h-full w-full object-cover rounded-md"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">
                                {item.product.title}
                              </h3>
                              <p className="mt-1 text-sm text-gray-500">
                                Quantity: {item.quantity}
                              </p>
                            </div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Seller: {order.seller.username}
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-lg font-medium text-gray-900">
                      Total: {formatPrice(order.totalAmount)}
                    </p>
                    <button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}