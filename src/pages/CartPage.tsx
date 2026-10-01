import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  Heart,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    toggleWishlist,
    subtotal,
    shippingFee,
    discountAmount,
    finalTotal,
    activeCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();
  const { navigate } = useRouter();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const freeDeliveryThreshold = 999;
  const remainingForFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMsg({ text: res.message, error: !res.success });
    if (res.success) setCouponInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          Looks like you haven't added anything yet. Explore our latest fashion dresses, college totes, and jewellery collections!
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-xs sm:text-sm shadow-md transition"
        >
          Explore Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Your Shopping Cart</h1>
        <p className="text-xs text-gray-500 mt-1">
          {cart.reduce((a, b) => a + b.quantity, 0)} items in your cart
        </p>
      </div>

      {/* Free Delivery Bar */}
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl">
        <div className="flex justify-between items-center text-xs font-semibold mb-2">
          {remainingForFree === 0 ? (
            <span className="text-green-700">🎉 Congratulations! Free Pan-India Delivery unlocked!</span>
          ) : (
            <span className="text-blue-900">
              Add <strong className="text-blue-700 font-bold">₹{remainingForFree}</strong> more to qualify for <strong>FREE Pan-India Delivery</strong>!
            </span>
          )}
          <span className="text-blue-700">{progressPercent}%</span>
        </div>
        <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Item List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item, idx) => (
            <div
              key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row gap-4"
            >
              <img
                src={item.product.images[0]}
                alt={item.product.name}
                onClick={() => navigate(`/product/${item.product.id}`)}
                className="w-24 h-28 object-cover rounded-xl cursor-pointer hover:opacity-90 shrink-0"
              />

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        onClick={() => navigate(`/product/${item.product.id}`)}
                        className="text-sm font-bold text-gray-900 hover:text-blue-600 cursor-pointer"
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Color: <strong className="text-gray-700">{item.selectedColor}</strong> | Size: <strong className="text-gray-700">{item.selectedSize}</strong>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-gray-900">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </div>
                      {item.product.originalPrice > item.product.price && (
                        <div className="text-xs text-gray-400 line-through">
                          ₹{(item.product.originalPrice * item.quantity).toLocaleString('en-IN')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                  {/* Quantity control */}
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                    <button
                      onClick={() =>
                        updateCartQuantity(item.product.id, item.selectedColor, item.selectedSize, -1)
                      }
                      className="p-1.5 px-3 text-gray-600 hover:bg-gray-200"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateCartQuantity(item.product.id, item.selectedColor, item.selectedSize, 1)
                      }
                      disabled={item.quantity >= item.product.stock}
                      className="p-1.5 px-3 text-gray-600 hover:bg-gray-200 disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleWishlist(item.product.id)}
                      className="text-xs text-gray-500 hover:text-red-500 flex items-center space-x-1"
                    >
                      <Heart className="w-3.5 h-3.5" />
                      <span>Save to Wishlist</span>
                    </button>
                    <button
                      onClick={() =>
                        removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                      }
                      className="text-xs text-red-600 hover:text-red-700 flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-blue-100 shadow-xs space-y-5 sticky top-28">
          <h2 className="text-base font-bold text-gray-900">Order Summary</h2>

          {/* Coupon Input */}
          <div>
            {activeCoupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-2xl text-xs">
                <div className="flex items-center space-x-2 text-green-800 font-semibold">
                  <Tag className="w-4 h-4 text-green-600" />
                  <span>Coupon <strong>{activeCoupon.code}</strong> Applied</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-red-600 font-bold hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">Have a promo coupon?</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. NOVA10, FIRSTFASHION"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-blue-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition"
                  >
                    Apply
                  </button>
                </div>
              </form>
            )}

            {couponMsg && (
              <p
                className={`text-[11px] mt-1 font-medium ${
                  couponMsg.error ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {couponMsg.text}
              </p>
            )}
          </div>

          {/* Line items */}
          <div className="space-y-2.5 text-xs text-gray-600 pt-2 border-t border-gray-100">
            <div className="flex justify-between">
              <span>Item Subtotal</span>
              <span className="font-semibold text-gray-900">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Pan-India Delivery Fee</span>
              {shippingFee === 0 ? (
                <span className="text-green-600 font-bold uppercase text-[11px]">FREE</span>
              ) : (
                <span className="font-semibold text-gray-900">₹{shippingFee}</span>
              )}
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Coupon Discount ({activeCoupon?.code})</span>
                <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-extrabold text-gray-900">
              <span>Total Payable</span>
              <span className="text-xl text-blue-700">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 transition"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center space-x-1.5 text-[11px] text-gray-400">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>100% Safe & Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};
