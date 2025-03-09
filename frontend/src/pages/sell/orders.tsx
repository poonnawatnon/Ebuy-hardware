import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { formatPrice } from '../../utils/format';
import { Loader2, Package, Eye } from 'lucide-react';
import { showToast } from '../../utils/toast';

export default function SellerOrdersPage() {
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: ['seller-orders'],
    queryFn: async () => {
      const response = await fetch('http://localhost:3001/api/orders/seller/orders', {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Seller Orders</h1>
        <p className="mt-2 text-gray-600">Manage your incoming orders</p>
      </div>

      {/* Orders List */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        {data?.orders?.length === 0 ? (
          <div className="p-8 text-center">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              You haven't received any orders yet.
            </p>
          </div>
        ) : (
          <div className="min-w-full divide-y divide-gray-200">
            {/* Header */}
            <div className="bg-gray-50 px-6 py-3">
              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-2">Order Details</div>
                <div>Customer</div>
                <div>Total</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
            </div>

            {/* Orders */}
            <div className="divide-y divide-gray-200">
              {data?.orders.map((order: any) => (
                <div key={order.id} className="px-6 py-4">
                  <div className="grid grid-cols-6 gap-4 items-center">
                    <div className="col-span-2">
                      <p className="font-medium">#{order.id.slice(-8)}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm">{order.buyer.username}</p>
                      <p className="text-sm text-gray-500">{order.buyer.email}</p>
                    </div>

                    <div className="font-medium">
                      {formatPrice(order.totalAmount)}
                    </div>

                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'}`}>
                        {order.status}
                      </span>
                    </div>

                    <div>
                      <button
                        onClick={() => router.push(`/sell/orders/${order.id}`)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        <Eye className="w-4 h-4 mr-1" />
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
    </div>
  );
}