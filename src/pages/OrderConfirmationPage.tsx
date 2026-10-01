import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  ShoppingBag,
  MapPin,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';

export const OrderConfirmationPage: React.FC = () => {
  const { orderIdParam, navigate } = useRouter();
  const { orders } = useStore();

  const order = orders.find((o) => o.id === orderIdParam) || orders[0];

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-xs font-semibold"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Celebration Check Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-blue-100 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Order Placed Successfully!
        </h1>

        <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
          Thank you for shopping with NovaCart Ai. We have received your order and will dispatch it shortly.
        </p>

        <div className="inline-block bg-blue-50 border border-blue-200 text-blue-900 px-4 py-2 rounded-2xl text-xs font-mono font-bold">
          Order ID: #{order.id}
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pb-4 border-b border-gray-100">
          <div>
            <span className="text-gray-500 font-medium">Estimated Pan-India Delivery:</span>
            <p className="font-bold text-gray-900 text-sm flex items-center space-x-1.5 mt-0.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>{order.estimatedDeliveryDate}</span>
            </p>
          </div>

          <div>
            <span className="text-gray-500 font-medium">Payment Mode:</span>
            <p className="font-bold text-gray-900 text-sm mt-0.5">
              {order.paymentMethod === 'CashOnDelivery'
                ? 'Cash on Delivery (₹' + order.total.toLocaleString('en-IN') + ')'
                : 'Prepaid (' + order.paymentMethod + ') - ₹' + order.total.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Shipping Address */}
        <div>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Delivery Destination</span>
          </h3>
          <p className="text-xs text-gray-700 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-200">
            <strong>{order.shippingAddress.fullName}</strong> ({order.shippingAddress.phone})
            <br />
            {order.shippingAddress.houseNo}, {order.shippingAddress.street}
            {order.shippingAddress.landmark ? `, ${order.shippingAddress.landmark}` : ''}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
          </p>
        </div>

        {/* Items List */}
        <div>
          <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
            Ordered Products ({order.items.length})
          </h3>
          <div className="space-y-3 divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-3 flex items-center justify-between gap-4 text-xs">
                <img
                  src={item.image}
                  alt=""
                  className="w-14 h-16 object-cover rounded-xl shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-gray-900 truncate">{item.name}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Color: {item.selectedColor} | Size: {item.selectedSize} | Qty: {item.quantity}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(`/track/${order.id}`)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition shadow-md shadow-blue-500/20"
          >
            <Truck className="w-4 h-4" />
            <span>Track Order Status</span>
          </button>
          <button
            onClick={() => navigate('/shop')}
            className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 font-semibold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 transition"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>
      </div>
    </div>
  );
};
