// /frontend/src/pages/cart.tsx
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import Link from 'next/link';
import { Trash2, Minus, Plus } from 'lucide-react';
import { showToast } from '../utils/toast';
import { Product, CartItem } from '../types/product';

export default function CartPage() {
  const { items, isLoading, error, removeFromCart, updateQuantity } = useCart();

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleUpdateQuantity = async (
    itemId: string, 
    newQuantity: number, 
    maxQuantity: number
  ) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
      return;
    }

    if (newQuantity > maxQuantity) {
      showToast.error(`Only ${maxQuantity} items available`);
      return;
    }

    await updateQuantity(itemId, newQuantity);
  };

  // ... loading and error states remain the same ...

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm"
          >
            {/* Image */}
            <div className="w-24 h-24">
              <img
                src={item.product.images[0] || '/placeholder.png'}
                alt={item.product.title}
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h3 className="font-medium">{item.product.title}</h3>
              <p className="text-sm text-gray-600">
                Condition: {item.product.condition}
              </p>
              <p className="text-sm text-gray-600">
                Seller: {item.product.seller.username}
              </p>
              {item.quantity === item.product.quantity && (
                <p className="text-sm text-orange-600 mt-1">
                  Maximum quantity available
                </p>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateQuantity(
                  item.id, 
                  item.quantity - 1,
                  item.product.quantity
                )}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={item.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button
                onClick={() => handleUpdateQuantity(
                  item.id, 
                  item.quantity + 1,
                  item.product.quantity
                )}
                className="p-1 hover:bg-gray-100 rounded"
                disabled={item.quantity >= item.product.quantity}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Price */}
            <div className="w-24 text-right font-medium">
              {formatPrice(item.product.price * item.quantity)}
            </div>

            {/* Remove Button */}
            <button
              onClick={() => removeFromCart(item.id)}
              className="p-2 text-gray-400 hover:text-red-500">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Subtotal and Checkout */}
      <div className="mt-8 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>
        <Link 
          href="/checkout"
          className="block w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-center">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}