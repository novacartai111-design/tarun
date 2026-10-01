import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { OrderStatus } from '../types';

export const OrderTrackingPage: React.FC = () => {
  const { orderIdParam, navigate } = useRouter();
  const { orders, updateOrderStatus } = useStore();

  const [searchId, setSearchId] = useState(orderIdParam || '');

  // Find targeted order
  const currentOrder =
    orders.find((o) => o.id.toLowerCase() === (searchId || orderIdParam || '').toLowerCase()) ||
    orders[0];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/track/${searchId.trim()}`);
    }
  };

  const steps: OrderStatus[] = [
    'Order Placed',
    'Confirmed',
    'Packed',
    'Shipped',
    'Out for Delivery',
    'Delivered',
  ];

  const getStepIndex = (status: OrderStatus) => {
    return steps.indexOf(status);
  };

  const currentStepIndex = currentOrder ? getStepIndex(currentOrder.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Bar for Order ID */}
      <div className="bg-white p-5 rounded-3xl border border-blue-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Track Your Order</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Enter your NovaCart Order ID to view real-time shipping updates.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="e.g. NC-2026-4819"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-blue-600 uppercase"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
          >
            Track
          </button>
        </form>
      </div>

      {!currentOrder ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-3">
          <Package className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="text-base font-bold text-gray-900">No Orders Found</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            We couldn't locate an order with ID "{searchId}". Please check the ID from your confirmation email.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Tracking Status Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-xs space-y-8">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                  Order #{currentOrder.id}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-2">
                  Status: <span className="text-blue-700">{currentOrder.orderStatus}</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Courier: <strong>{currentOrder.courierPartner}</strong> | AWB: <strong className="font-mono">{currentOrder.trackingNumber}</strong>
                </p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-gray-500">Expected Delivery</span>
                <p className="text-base font-bold text-gray-900 mt-0.5">
                  {currentOrder.estimatedDeliveryDate}
                </p>
              </div>
            </div>

            {/* Visual Step Progress Tracker */}
            <div className="py-2">
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-4 left-4 right-4 h-1 bg-gray-200 hidden sm:block -z-0">
                  <div
                    className="h-1 bg-blue-600 transition-all duration-500"
                    style={{
                      width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-6 gap-4 relative z-10">
                  {steps.map((step, idx) => {
                    const isCompleted = idx <= currentStepIndex;
                    const isCurrent = idx === currentStepIndex;

                    return (
                      <div key={step} className="flex flex-col items-center text-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition duration-300 ${
                            isCompleted
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                              : 'bg-gray-100 text-gray-400 border border-gray-200'
                          } ${isCurrent ? 'ring-4 ring-blue-100 scale-110' : ''}`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span
                          className={`text-xs mt-2 font-medium leading-tight ${
                            isCurrent
                              ? 'text-blue-700 font-bold'
                              : isCompleted
                              ? 'text-gray-900'
                              : 'text-gray-400'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Interactive Simulator for evaluation */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2 text-blue-900">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>
                  <strong>Interactive Testing:</strong> Advance order status to test live timeline updates.
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5 shrink-0">
                {steps.map((st) => (
                  <button
                    key={st}
                    onClick={() => updateOrderStatus(currentOrder.id, st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                      currentOrder.orderStatus === st
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:bg-blue-100'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Detailed Tracking Activity Log */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Shipment Activity Log</span>
              </h3>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-100">
                {currentOrder.trackingUpdates.map((update, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-gray-900">{update.status}</span>
                        <span className="text-[11px] text-gray-400">• {update.timestamp}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-0.5">{update.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items & Shipping Address breakdown */}
            <div className="pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Delivery Address</h4>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">
                  <strong>{currentOrder.shippingAddress.fullName}</strong> ({currentOrder.shippingAddress.phone})
                  <br />
                  {currentOrder.shippingAddress.houseNo}, {currentOrder.shippingAddress.street}
                  <br />
                  {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">
                  Items in this Shipment ({currentOrder.items.length})
                </h4>
                <div className="space-y-2">
                  {currentOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded-xl">
                      <div className="flex items-center space-x-2 truncate">
                        <img
                          src={item.image}
                          alt=""
                          className="w-8 h-10 object-cover rounded-lg shrink-0"
                        />
                        <div className="truncate">
                          <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                          <p className="text-[10px] text-gray-500">
                            {item.selectedColor} • {item.selectedSize} (Qty: {item.quantity})
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-900 ml-2">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
