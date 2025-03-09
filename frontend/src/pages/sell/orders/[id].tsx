import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@tanstack/react-query';
import { formatPrice } from '../../../utils/format';
import { Loader2, Package, MapPin, CheckCircle, Truck } from 'lucide-react';
import { showToast } from '../../../utils/toast';
import { Order, OrderStatus, UpdateOrderStatusDto, UpdateStatusVariables } from '../../../types/order';

interface UpdateStatusResponse {
  id: string;
  status: OrderStatus;
  // ... other fields
}

export default function SellerOrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  // Fetch order details
  const { data: order, isLoading, error, refetch } = useQuery({
    queryKey: ['seller-order', id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3001/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch order');
      return response.json();
    },
    enabled: !!id
  });

  // Update order status mutation
  const { mutate: updateOrderStatus, isPending } = useMutation({
    mutationFn: async (variables: UpdateStatusVariables) => {
      const response = await fetch(`http://localhost:3001/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: variables.status })
      });
      if (!response.ok) throw new Error('Failed to update order');
      return response.json();
    },
    onSuccess: () => {
      refetch();
      showToast.success('Order status updated successfully');
    },
    onError: () => {
      showToast.error('Failed to update order status');
    }
  });

  // Update order status mutation
  const updateStatus = useMutation({
    mutationFn: async ({ status }: { status: string }) => {
      const response = await fetch(`http://localhost:3001/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });
      if (!response.ok) throw new Error('Failed to update order');
      return response.json();
    },
    onSuccess: () => {
      refetch();
      showToast.success('Order status updated successfully');
    },
    onError: () => {
      showToast.error('Failed to update order status');
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
          <h2 className="text-2xl font-bold text-gray-900">Error loading order</h2>
          <p className="mt-2 text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order?.id?.slice(-8)}
            </h1>
            <p className="mt-2 text-gray-600">
              Placed on {new Date(order?.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <div className="flex gap-2">
            {order?.status === 'PENDING' && (
              <button
                onClick={() => updateOrderStatus({ status: 'CONFIRMED' })}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                disabled={isPending}>
                <CheckCircle className="w-4 h-4 mr-2" />
                {isPending ? 'Accepting...' : 'Accept Order'}
              </button>
              )}
            
              {order?.status === 'CONFIRMED' && (
              <button
                onClick={() => updateOrderStatus({ status: 'SHIPPED' })}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                disabled={isPending}>
                <Truck className="w-4 h-4 mr-2" />
               {isPending ? 'Updating...' : 'Mark as Shipped'}
              </button>
              )}
          </div>
        </div>
      </div>

      {/* Order Status */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Status</h2>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
              ${order?.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                order?.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                order?.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'}`}>
              {order?.status}
            </span>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="mt-1">{order?.buyer.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="mt-1">{order?.buyer.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
          <div className="text-sm">
            <p>{order?.shippingAddress.fullName}</p>
            <p>{order?.shippingAddress.address1}</p>
            {order?.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
            <p>{order?.shippingAddress.city}, {order?.shippingAddress.state} {order?.shippingAddress.zipCode}</p>
            <p>{order?.shippingAddress.country}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Order Items</h2>
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
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Total</p>
              <p>{formatPrice(order?.totalAmount)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}