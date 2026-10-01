import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Heart,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
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
  const [couponMessage, setCouponMessage] = useState<{ text: string; error: boolean } | null>(null);

  const freeDeliveryThreshold = 999;
  const remainingForFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);
  const freeDeliveryProgress = Math.min(100, Math.round((subtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    setCouponMessage({ text: res.message, error: !res.success });
    if (res.success) {
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Cart Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-base text-gray-900">
              Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="bg-blue-50/70 px-4 py-2.5 border-b border-blue-100">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            {remainingForFreeDelivery === 0 ? (
              <span className="text-green-700 font-semibold flex items-center">
                🎉 Congratulations! You have unlocked FREE Delivery!
              </span>
            ) : (
              <span className="text-blue-800">
                Add <strong className="text-blue-900 font-bold">₹{remainingForFreeDelivery}</strong> more to get <strong>FREE Pan-India Delivery</strong>
              </span>
            )}
            <span className="text-blue-700 font-bold">{freeDeliveryProgress}%</span>
          </div>
          <div className="w-full bg-blue-200/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${freeDeliveryProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Your Cart is Empty</h4>
                <p className="text-xs text-gray-500 mt-1 max-w-xs">
                  Discover trending fashion dresses, college bags, elegant jewellery & accessories!
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-sm transition"
              >
                Start Shopping Now
              </button>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}-${idx}`} className="py-3.5 flex gap-3">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate(`/product/${item.product.id}`);
                  }}
                  className="w-18 h-22 object-cover rounded-xl cursor-pointer hover:opacity-90 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate(`/product/${item.product.id}`);
                      }}
                      className="text-xs font-semibold text-gray-900 hover:text-blue-600 line-clamp-1 cursor-pointer"
                    >
                      {item.product.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      Color: <strong className="text-gray-700">{item.selectedColor}</strong> | Size: <strong className="text-gray-700">{item.selectedSize}</strong>
                    </p>
                    <div className="flex items-baseline space-x-1.5 mt-1">
                      <span className="text-sm font-bold text-gray-900">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </span>
                      {item.product.originalPrice > item.product.price && (
                        <span className="text-[11px] text-gray-400 line-through">
                          ₹{item.product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.selectedColor, item.selectedSize, -1)
                        }
                        className="p-1 hover:bg-gray-200 text-gray-600 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-gray-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(item.product.id, item.selectedColor, item.selectedSize, 1)
                        }
                        disabled={item.quantity >= item.product.stock}
                        className="p-1 hover:bg-gray-200 text-gray-600 disabled:opacity-30 transition"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleWishlist(item.product.id)}
                        className="text-gray-400 hover:text-red-500 transition p-1"
                        title="Move to Wishlist"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() =>
                          removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                        }
                        className="text-gray-400 hover:text-red-500 transition p-1"
                        title="Remove from Cart"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-100 bg-white space-y-3">
            {/* Promo Code Input */}
            <div>
              {activeCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2 rounded-xl text-xs">
                  <div className="flex items-center space-x-1.5 text-green-800 font-semibold">
                    <Tag className="w-3.5 h-3.5 text-green-600" />
                    <span>Coupon <strong>{activeCoupon.code}</strong> Applied!</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 font-bold hover:underline text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter promo coupon (e.g. NOVA10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold transition"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponMessage && (
                <p
                  className={`text-[11px] mt-1 font-medium ${
                    couponMessage.error ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Bill Details */}
            <div className="space-y-1.5 text-xs text-gray-600 pt-1">
              <div className="flex justify-between">
                <span>Cart Subtotal</span>
                <span className="font-semibold text-gray-900">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Pan-India Delivery</span>
                {shippingFee === 0 ? (
                  <span className="text-green-600 font-semibold uppercase text-[11px]">
                    FREE
                  </span>
                ) : (
                  <span className="font-semibold text-gray-900">₹{shippingFee}</span>
                )}
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Discount ({activeCoupon?.code})</span>
                  <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="border-t border-gray-100 pt-2 flex justify-between text-sm font-bold text-gray-900">
                <span>Total Amount</span>
                <span className="text-base text-blue-700">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center justify-center space-x-1 text-[11px] text-gray-400">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
              <span>Safe & Secure UPI, Cards, Net Banking & COD</span>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
