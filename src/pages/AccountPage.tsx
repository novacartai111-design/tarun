import React, { useState } from 'react';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  Bell,
  LogOut,
  Edit2,
  Trash2,
  Plus,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { ProductCard } from '../components/ProductCard';
import { ShippingAddress } from '../types';
import { indianStates } from '../data/initialOffers';

export const AccountPage: React.FC = () => {
  const {
    user,
    orders,
    wishlist,
    products,
    savedAddresses,
    addAddress,
    deleteAddress,
    notifications,
    markNotificationRead,
    clearAllNotifications,
    logout,
    setIsLoginModalOpen,
  } = useStore();
  const { navigate } = useRouter();

  const [activeTab, setActiveTab] = useState<
    'profile' | 'orders' | 'wishlist' | 'addresses' | 'notifications'
  >('orders');

  // Address modal
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddr, setNewAddr] = useState<ShippingAddress>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    houseNo: '',
    street: '',
    landmark: '',
    city: '',
    state: 'Karnataka',
    pincode: '',
  });

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Sign In to Your Account</h2>
        <p className="text-xs text-gray-500">
          Sign in to view your orders, track shipments, and manage saved delivery addresses.
        </p>
        <button
          onClick={() => setIsLoginModalOpen(true)}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold text-xs"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.fullName || !newAddr.phone || !newAddr.pincode) return;
    addAddress(newAddr);
    setIsAddAddressOpen(false);
    setNewAddr({
      fullName: user.name,
      phone: user.phone,
      email: user.email,
      houseNo: '',
      street: '',
      landmark: '',
      city: '',
      state: 'Karnataka',
      pincode: '',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Account Hero Bar */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-white text-blue-700 flex items-center justify-center font-extrabold text-2xl shadow-md uppercase">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold">{user.name}</h1>
              {user.role === 'admin' && (
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-blue-100">{user.email} • {user.phone}</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {user.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs"
            >
              Admin Dashboard
            </button>
          )}
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs and Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-3 shadow-xs space-y-1">
          {[
            { id: 'orders', label: 'My Orders', icon: Package, badge: orders.length },
            { id: 'wishlist', label: 'My Wishlist', icon: Heart, badge: wishlistProducts.length },
            { id: 'addresses', label: 'Saved Addresses', icon: MapPin, badge: savedAddresses.length },
            {
              id: 'notifications',
              label: 'Notifications',
              icon: Bell,
              badge: notifications.filter((n) => !n.read).length,
            },
            { id: 'profile', label: 'Profile Settings', icon: UserIcon },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Tab Content Panel */}
        <main className="lg:col-span-9 bg-white rounded-3xl border border-blue-100 p-6 sm:p-8 shadow-xs min-h-[420px]">
          {/* TAB: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Your Order History</h2>
                <p className="text-xs text-gray-500">Track and view receipts of your previous purchases.</p>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Package className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-bold text-gray-700">No orders placed yet</p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="px-5 py-2 bg-blue-600 text-white rounded-full text-xs font-semibold"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-200 rounded-2xl p-4 sm:p-5 space-y-4 hover:border-blue-200 transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-gray-100 gap-2">
                        <div>
                          <span className="font-mono font-bold text-xs text-blue-700">
                            #{order.id}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                            {order.orderStatus}
                          </span>
                          <button
                            onClick={() => navigate(`/track/${order.id}`)}
                            className="text-xs text-blue-600 hover:underline font-semibold flex items-center space-x-1"
                          >
                            <span>Track Order</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Items preview */}
                      <div className="space-y-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-xs gap-3">
                            <div className="flex items-center space-x-3">
                              <img
                                src={item.image}
                                alt=""
                                className="w-12 h-14 object-cover rounded-xl shrink-0"
                              />
                              <div>
                                <h4 className="font-bold text-gray-900">{item.name}</h4>
                                <p className="text-[11px] text-gray-500">
                                  Color: {item.selectedColor} | Size: {item.selectedSize} | Qty: {item.quantity}
                                </p>
                              </div>
                            </div>
                            <span className="font-bold text-gray-900">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          Payment: <strong>{order.paymentMethod}</strong> ({order.paymentStatus})
                        </span>
                        <div className="text-sm font-bold text-gray-900">
                          Total: <span className="text-blue-700">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Saved Wishlist</h2>
                <p className="text-xs text-gray-500">Your favorite styles saved for later.</p>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-bold text-gray-700">Your wishlist is empty</p>
                  <button
                    onClick={() => navigate('/shop')}
                    className="px-5 py-2 bg-blue-600 text-white rounded-full text-xs font-semibold"
                  >
                    Browse Collections
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {wishlistProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Addresses */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Saved Delivery Addresses</h2>
                  <p className="text-xs text-gray-500">Fast checkout for future Indian orders.</p>
                </div>
                <button
                  onClick={() => setIsAddAddressOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedAddresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-gray-200 bg-gray-50/50 flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-900">{addr.fullName}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {addr.houseNo}, {addr.street}
                        {addr.landmark ? `, ${addr.landmark}` : ''}
                        <br />
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Phone: {addr.phone}</p>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-gray-200">
                      <button
                        onClick={() => deleteAddress(idx)}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Address Modal */}
              {isAddAddressOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
                  <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-blue-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-gray-900">Add New Address</h3>
                      <button
                        onClick={() => setIsAddAddressOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        ✕
                      </button>
                    </div>

                    <form onSubmit={handleCreateAddress} className="space-y-3 text-xs">
                      <div>
                        <label className="font-semibold block mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newAddr.fullName}
                          onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Mobile Number</label>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">House / Flat No.</label>
                        <input
                          type="text"
                          required
                          value={newAddr.houseNo}
                          onChange={(e) => setNewAddr({ ...newAddr, houseNo: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="font-semibold block mb-1">Street / Area</label>
                        <input
                          type="text"
                          required
                          value={newAddr.street}
                          onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="font-semibold block mb-1">City</label>
                          <input
                            type="text"
                            required
                            value={newAddr.city}
                            onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="font-semibold block mb-1">State</label>
                          <select
                            value={newAddr.state}
                            onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-2 py-2"
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
                        <label className="font-semibold block mb-1">PIN Code (6 Digits)</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={newAddr.pincode}
                          onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                        />
                      </div>

                      <div className="pt-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddAddressOpen(false)}
                          className="flex-1 py-2.5 bg-gray-100 rounded-xl font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                  <p className="text-xs text-gray-500">Live order milestones & exclusive announcements.</p>
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={clearAllNotifications}
                    className="text-xs text-blue-600 hover:underline font-semibold"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {notifications.length === 0 ? (
                <div className="py-12 text-center text-xs text-gray-500">
                  No notifications at the moment.
                </div>
              ) : (
                <div className="space-y-3">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => markNotificationRead(notif.id)}
                      className={`p-4 rounded-2xl border transition cursor-pointer ${
                        notif.read
                          ? 'border-gray-100 bg-white text-gray-600'
                          : 'border-blue-200 bg-blue-50/50 text-gray-900 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-gray-900">{notif.title}</h4>
                        <span className="text-[10px] text-gray-400">{notif.timestamp}</span>
                      </div>
                      <p className="text-xs mt-1 text-gray-600">{notif.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Profile Settings */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-md">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                <p className="text-xs text-gray-500">Update your contact information.</p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={user.name}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    disabled
                    value={user.phone}
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-700"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-800">
                🔒 Security Note: Contact details are verified with your Indian mobile carrier and OTP.
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
