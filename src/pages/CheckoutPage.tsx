import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Banknote,
  CheckCircle2,
  Lock,
  ArrowRight,
  Truck,
  MapPin,
  Plus,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { ShippingAddress, PaymentMethod } from '../types';
import { indianStates } from '../data/initialOffers';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    subtotal,
    shippingFee,
    discountAmount,
    finalTotal,
    savedAddresses,
    addAddress,
    createOrder,
    activeCoupon,
  } = useStore();
  const { navigate } = useRouter();

  // Selected or custom address
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [useNewAddress, setUseNewAddress] = useState<boolean>(savedAddresses.length === 0);

  const [formData, setFormData] = useState<ShippingAddress>({
    fullName: savedAddresses[0]?.fullName || '',
    phone: savedAddresses[0]?.phone || '',
    email: savedAddresses[0]?.email || '',
    houseNo: savedAddresses[0]?.houseNo || '',
    street: savedAddresses[0]?.street || '',
    landmark: savedAddresses[0]?.landmark || '',
    city: savedAddresses[0]?.city || '',
    state: savedAddresses[0]?.state || 'Karnataka',
    pincode: savedAddresses[0]?.pincode || '',
  });

  const [saveToAccount, setSaveToAccount] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState<string>('sharma.priya@okaxis');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'qr'>('gpay');
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="text-xs text-gray-500">Please add items to cart before checking out.</p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-full text-xs font-semibold"
        >
          Browse Shop
        </button>
      </div>
    );
  }

  const handleSelectSavedAddress = (index: number) => {
    setSelectedAddressIndex(index);
    setUseNewAddress(false);
    const addr = savedAddresses[index];
    if (addr) {
      setFormData(addr);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Basic validation
    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.pincode.trim()) {
      setFormError('Please enter full name, mobile number and 6-digit PIN code.');
      return;
    }

    if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!/^\d{6}$/.test(formData.pincode.trim())) {
      setFormError('Please enter a valid 6-digit PIN code.');
      return;
    }

    setIsProcessing(true);

    try {
      if (useNewAddress && saveToAccount) {
        addAddress(formData);
      }

      const newOrder = await createOrder(formData, paymentMethod);
      setIsProcessing(false);
      navigate(`/order-confirmation/${newOrder.id}`);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
      setFormError('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Title */}
      <div className="border-b border-gray-100 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Secure Indian Checkout
        </h1>
        <p className="text-xs text-gray-500 mt-1 flex items-center space-x-1.5">
          <Lock className="w-3.5 h-3.5 text-green-600" />
          <span>256-Bit Encrypted & Compliant Payment Processing</span>
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Address & Payment */}
        <div className="lg:col-span-8 space-y-8">
          {/* Section 1: Delivery Address */}
          <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h2 className="text-base font-bold text-gray-900 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Indian Delivery Address</span>
              </h2>
              {savedAddresses.length > 0 && !useNewAddress && (
                <button
                  type="button"
                  onClick={() => {
                    setUseNewAddress(true);
                    setFormData({
                      fullName: '',
                      phone: '',
                      email: '',
                      houseNo: '',
                      street: '',
                      landmark: '',
                      city: '',
                      state: 'Karnataka',
                      pincode: '',
                    });
                  }}
                  className="text-xs text-blue-600 hover:underline font-semibold flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              )}
            </div>

            {/* Saved Addresses Picker */}
            {savedAddresses.length > 0 && !useNewAddress && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {savedAddresses.map((addr, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectSavedAddress(idx)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition relative ${
                      selectedAddressIndex === idx
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                    }`}
                  >
                    {selectedAddressIndex === idx && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 absolute top-3 right-3" />
                    )}
                    <div className="font-bold text-xs text-gray-900">{addr.fullName}</div>
                    <div className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                      {addr.houseNo}, {addr.street}
                      <br />
                      {addr.city}, {addr.state} - {addr.pincode}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-1">Phone: {addr.phone}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Address Form */}
            {(useNewAddress || savedAddresses.length === 0) && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      10-Digit Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-gray-500 font-semibold">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        maxLength={10}
                        placeholder="98765 43210"
                        value={formData.phone}
                        onChange={handleFormChange}
                        className="w-full pl-12 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email Address (for invoice & delivery tracking)
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="priya.sharma@example.in"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Flat / House No. / Building *
                    </label>
                    <input
                      type="text"
                      name="houseNo"
                      required
                      placeholder="Flat 402, Sunshine Residency"
                      value={formData.houseNo}
                      onChange={handleFormChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Street / Area / Colony *
                    </label>
                    <input
                      type="text"
                      name="street"
                      required
                      placeholder="100 Feet Road, Indiranagar"
                      value={formData.street}
                      onChange={handleFormChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      name="landmark"
                      placeholder="Near Metro Station"
                      value={formData.landmark}
                      onChange={handleFormChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Bengaluru"
                      value={formData.city}
                      onChange={handleFormChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      State / UT *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    >
                      {indianStates.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    6-Digit PIN Code *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    placeholder="560038"
                    value={formData.pincode}
                    onChange={handleFormChange}
                    className="w-full max-w-xs bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div className="pt-2">
                  <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={saveToAccount}
                      onChange={(e) => setSaveToAccount(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                    />
                    <span>Save this address for fast checkout in future orders</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Payment Method */}
          <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xs space-y-5">
            <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                2
              </span>
              <h2 className="text-base font-bold text-gray-900">Select Indian Payment Method</h2>
            </div>

            {/* Payment Method Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'UPI', label: 'UPI / QR', icon: QrCode, badge: 'Fastest' },
                { id: 'Card', label: 'Debit / Credit', icon: CreditCard },
                { id: 'NetBanking', label: 'Net Banking', icon: Building2 },
                { id: 'CashOnDelivery', label: 'Cash on Delivery', icon: Banknote },
              ].map((tab) => {
                const isSelected = paymentMethod === tab.id;
                const Icon = tab.icon;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPaymentMethod(tab.id as PaymentMethod)}
                    className={`p-3 rounded-2xl border-2 flex flex-col items-center justify-center text-center transition ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 text-blue-700 font-bold shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-gray-50/50'
                    }`}
                  >
                    <Icon className="w-5 h-5 mb-1.5" />
                    <span className="text-xs">{tab.label}</span>
                    {tab.badge && (
                      <span className="mt-1 text-[9px] bg-green-100 text-green-700 px-1.5 py-0.2 rounded-full font-bold">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Detailed UI based on selected payment method */}
            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200 text-xs">
              {paymentMethod === 'UPI' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'gpay', label: 'Google Pay' },
                      { id: 'phonepe', label: 'PhonePe' },
                      { id: 'paytm', label: 'Paytm UPI' },
                      { id: 'qr', label: 'Dynamic QR Code' },
                    ].map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => setUpiApp(app.id as any)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                          upiApp === app.id
                            ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                            : 'border-gray-200 bg-white text-gray-700'
                        }`}
                      >
                        {app.label}
                      </button>
                    ))}
                  </div>

                  {upiApp === 'qr' ? (
                    <div className="p-4 bg-white rounded-xl border border-gray-200 text-center max-w-xs mx-auto space-y-2">
                      <div className="w-32 h-32 bg-gray-100 border border-gray-300 rounded-xl mx-auto flex items-center justify-center font-mono text-xs text-gray-400">
                        [UPI QR CODE]
                      </div>
                      <p className="text-[11px] text-gray-600 font-medium">
                        Scan with GPay, PhonePe, or BHIM after clicking "Place Order".
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Enter UPI ID / VPA
                      </label>
                      <input
                        type="text"
                        placeholder="yourname@okhdfcbank"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="w-full max-w-sm bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                      />
                      <p className="text-[11px] text-gray-500 mt-1">
                        A payment collect request will be sent to your UPI app.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === 'Card' && (
                <div className="space-y-3 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="•••• •••• •••• •••• (RuPay, Visa, MasterCard)"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600 font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        placeholder="12/28"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">CVV</label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'NetBanking' && (
                <div className="space-y-2 max-w-sm">
                  <label className="block text-xs font-semibold text-gray-700">
                    Select Your Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-blue-600"
                  >
                    <option value="HDFC Bank">HDFC Bank</option>
                    <option value="State Bank of India">State Bank of India (SBI)</option>
                    <option value="ICICI Bank">ICICI Bank</option>
                    <option value="Axis Bank">Axis Bank</option>
                    <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                    <option value="Punjab National Bank">Punjab National Bank</option>
                  </select>
                </div>
              )}

              {paymentMethod === 'CashOnDelivery' && (
                <div className="text-gray-700 space-y-1">
                  <p className="font-semibold text-gray-900">
                    Pay with Cash or UPI directly to the courier executive upon delivery.
                  </p>
                  <p className="text-[11px] text-gray-500">
                    Exact change is appreciated. Delivery partner will provide an official receipt.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-blue-100 shadow-xs space-y-5 sticky top-28">
          <h2 className="text-base font-bold text-gray-900">Order Summary</h2>

          {/* Items preview */}
          <div className="space-y-3 max-h-56 overflow-y-auto divide-y divide-gray-100 pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="pt-2 flex items-center justify-between gap-3 text-xs">
                <img
                  src={item.product.images[0]}
                  alt=""
                  className="w-10 h-12 object-cover rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item.product.name}</p>
                  <p className="text-[10px] text-gray-500">
                    Qty: {item.quantity} | {item.selectedSize}
                  </p>
                </div>
                <span className="font-bold text-gray-900 shrink-0">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          {/* Breakdown */}
          <div className="space-y-2 text-xs text-gray-600 pt-3 border-t border-gray-100">
            <div className="flex justify-between">
              <span>Items Total</span>
              <span className="font-semibold text-gray-900">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              {shippingFee === 0 ? (
                <span className="text-green-600 font-bold uppercase text-[11px]">FREE</span>
              ) : (
                <span className="font-semibold text-gray-900">₹{shippingFee}</span>
              )}
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-green-600 font-medium">
                <span>Coupon ({activeCoupon?.code})</span>
                <span className="font-bold">-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="pt-3 border-t border-gray-100 flex justify-between text-base font-extrabold text-gray-900">
              <span>Total Amount</span>
              <span className="text-xl text-blue-700">
                ₹{finalTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {formError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl font-medium border border-red-200">
              {formError}
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Order...</span>
              </div>
            ) : (
              <>
                <span>Place Order (₹{finalTotal.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-[11px] text-gray-400 text-center space-y-1">
            <p>By placing this order you agree to NovaCart's Terms of Service.</p>
            <p className="flex items-center justify-center space-x-1 text-green-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>7-Day Return Guarantee Included</span>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
