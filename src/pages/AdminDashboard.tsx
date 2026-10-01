import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Package,
  ShoppingBag,
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  Tag,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { Product, OrderStatus, CategoryType, PromoCoupon } from '../types';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    toggleCoupon,
    user,
    login,
  } = useStore();
  const { navigate } = useRouter();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'coupons'>('products');

  // Modal states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New product form state
  const [prodForm, setProdForm] = useState({
    name: '',
    sku: '',
    category: 'dresses' as CategoryType,
    price: 999,
    originalPrice: 1999,
    discount: 50,
    stock: 20,
    colors: 'Blue, White',
    sizes: 'S, M, L',
    images: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    description: '',
    tags: 'fashion, trendy, college',
  });

  // New coupon form state
  const [isAddCouponOpen, setIsAddCouponOpen] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(15);
  const [newCouponMin, setNewCouponMin] = useState(999);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = orders.length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    const productPayload = {
      name: prodForm.name,
      sku: prodForm.sku || `NC-${Math.floor(100 + Math.random() * 900)}`,
      category: prodForm.category,
      price: Number(prodForm.price),
      originalPrice: Number(prodForm.originalPrice),
      discount: Math.round(
        ((Number(prodForm.originalPrice) - Number(prodForm.price)) / Number(prodForm.originalPrice)) * 100
      ),
      stock: Number(prodForm.stock),
      colors: prodForm.colors.split(',').map((c) => c.trim()),
      sizes: prodForm.sizes.split(',').map((s) => s.trim()),
      images: [prodForm.images.trim()],
      rating: 4.8,
      reviewsCount: 1,
      description: prodForm.description || 'Premium Indian fashion item.',
      tags: prodForm.tags.split(',').map((t) => t.trim()),
      specifications: {
        Material: 'High Quality Fabric',
        CountryOfOrigin: 'India',
      },
    };

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...productPayload,
      });
      setEditingProduct(null);
    } else {
      addProduct(productPayload);
    }

    setIsAddProductOpen(false);
    setProdForm({
      name: '',
      sku: '',
      category: 'dresses',
      price: 999,
      originalPrice: 1999,
      discount: 50,
      stock: 20,
      colors: 'Blue, White',
      sizes: 'S, M, L',
      images: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
      description: '',
      tags: 'fashion, trendy, college',
    });
  };

  const handleEditClick = (p: Product) => {
    setEditingProduct(p);
    setProdForm({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      originalPrice: p.originalPrice,
      discount: p.discount,
      stock: p.stock,
      colors: p.colors.join(', '),
      sizes: p.sizes.join(', '),
      images: p.images[0] || '',
      description: p.description,
      tags: p.tags.join(', '),
    });
    setIsAddProductOpen(true);
  };

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountPercentage: Number(newCouponPercent),
      minOrderValue: Number(newCouponMin),
      description: newCouponDesc || `${newCouponPercent}% OFF on orders above ₹${newCouponMin}`,
      isActive: true,
    });

    setIsAddCouponOpen(false);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <SlidersHorizontal className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-gray-900">NovaCart Admin Management</h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Store inventory, customer orders, stock alerts, and promotional campaigns.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigate('/shop')}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl"
          >
            Go to Store
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs">
          <span className="text-xs text-gray-500 font-semibold">Total Revenue</span>
          <div className="text-xl sm:text-2xl font-extrabold text-blue-700 mt-1">
            ₹{totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-green-600 font-semibold">Live order total</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs">
          <span className="text-xs text-gray-500 font-semibold">Total Orders</span>
          <div className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
            {totalOrders}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold">Pan-India shipments</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs">
          <span className="text-xs text-gray-500 font-semibold">Live Catalog Items</span>
          <div className="text-xl sm:text-2xl font-extrabold text-gray-900 mt-1">
            {products.length}
          </div>
          <span className="text-[11px] text-gray-500">Across 4 categories</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs">
          <span className="text-xs text-gray-500 font-semibold">Stock Alerts</span>
          <div className="text-xl sm:text-2xl font-extrabold text-amber-600 mt-1">
            {outOfStockCount}
          </div>
          <span className="text-[11px] text-amber-700 font-semibold">
            {outOfStockCount > 0 ? 'Out of stock items' : 'All items in stock'}
          </span>
        </div>
      </div>

      {/* Management Navigation Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: 'products', label: `Products (${products.length})`, icon: Package },
          { id: 'orders', label: `Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'coupons', label: `Promotions & Coupons (${coupons.length})`, icon: Tag },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-3 px-5 border-b-2 text-xs sm:text-sm font-bold transition ${
                isActive
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Products Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Store Catalog & Inventory</h2>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsAddProductOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-700 uppercase font-semibold border-b border-gray-200">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">SKU</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-blue-50/30 transition">
                      <td className="p-3.5 flex items-center space-x-3">
                        <img
                          src={prod.images[0]}
                          alt=""
                          className="w-10 h-12 object-cover rounded-lg shrink-0"
                        />
                        <div className="font-semibold text-gray-900 line-clamp-1 max-w-xs">
                          {prod.name}
                        </div>
                      </td>
                      <td className="p-3.5 capitalize font-medium">{prod.category}</td>
                      <td className="p-3.5 font-mono text-[11px] text-gray-500">{prod.sku}</td>
                      <td className="p-3.5 font-bold text-gray-900">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`font-bold ${
                            prod.stock <= 0
                              ? 'text-red-600'
                              : prod.stock <= 5
                              ? 'text-amber-600'
                              : 'text-green-700'
                          }`}
                        >
                          {prod.stock} units
                        </span>
                      </td>
                      <td className="p-3.5">
                        {prod.stock <= 0 ? (
                          <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(prod)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Orders Management */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Manage Customer Orders</h2>
            <p className="text-xs text-gray-500">
              Update shipment statuses which update customer tracking instantly.
            </p>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4 shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
                  <div>
                    <span className="font-mono font-bold text-xs text-blue-700">
                      Order #{order.id}
                    </span>
                    <h3 className="font-bold text-sm text-gray-900 mt-1">
                      Customer: {order.customerName} ({order.customerPhone})
                    </h3>
                    <p className="text-xs text-gray-500">
                      {order.shippingAddress.houseNo}, {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                    </p>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-semibold text-gray-600">Status:</span>
                    <select
                      value={order.orderStatus}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className="bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold rounded-xl px-3 py-1.5 focus:outline-none"
                    >
                      <option value="Order Placed">Order Placed</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-gray-600">Items:</span>
                    <div className="space-y-1.5 mt-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-gray-800">
                          <span>
                            {item.name} ({item.selectedColor}, {item.selectedSize}) x {item.quantity}
                          </span>
                          <span className="font-semibold">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1 sm:text-right">
                    <div>
                      Payment: <strong className="text-gray-900">{order.paymentMethod}</strong> ({order.paymentStatus})
                    </div>
                    <div>
                      Total Amount: <strong className="text-base text-blue-700">₹{order.total.toLocaleString('en-IN')}</strong>
                    </div>
                    <div className="text-gray-500 text-[11px]">
                      Courier Partner: {order.courierPartner} (AWB: {order.trackingNumber})
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Promotions & Coupons */}
      {activeTab === 'coupons' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">Promotional Discounts & Coupons</h2>
            <button
              onClick={() => setIsAddCouponOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create Coupon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map((coupon) => (
              <div
                key={coupon.code}
                className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => toggleCoupon(coupon.code)}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        coupon.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {coupon.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">{coupon.description}</p>
                  <p className="text-[11px] text-gray-400 mt-1">
                    Min Cart Value: ₹{coupon.minOrderValue}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-between text-xs">
                  <span className="text-gray-500">
                    {coupon.discountPercentage ? `${coupon.discountPercentage}% Discount` : `₹${coupon.discountAmount} Flat OFF`}
                  </span>
                  <button
                    onClick={() => toggleCoupon(coupon.code)}
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    {coupon.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="font-bold text-base text-gray-900">
                {editingProduct ? 'Edit Product' : 'Add New Fashion Product'}
              </h3>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chikankari Embroidered Anarkali"
                  value={prodForm.name}
                  onChange={(e) => setProdForm({ ...prodForm, name: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={prodForm.category}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, category: e.target.value as CategoryType })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                  >
                    <option value="dresses">Dresses</option>
                    <option value="handbags">Handbags</option>
                    <option value="jewellery">Jewellery</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">SKU</label>
                  <input
                    type="text"
                    placeholder="NC-DRS-101"
                    value={prodForm.sku}
                    onChange={(e) => setProdForm({ ...prodForm, sku: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={prodForm.price}
                    onChange={(e) => setProdForm({ ...prodForm, price: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">MRP Original (₹) *</label>
                  <input
                    type="number"
                    required
                    value={prodForm.originalPrice}
                    onChange={(e) =>
                      setProdForm({ ...prodForm, originalPrice: Number(e.target.value) })
                    }
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={prodForm.stock}
                    onChange={(e) => setProdForm({ ...prodForm, stock: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Colors (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Sky Blue, Pastel Pink"
                    value={prodForm.colors}
                    onChange={(e) => setProdForm({ ...prodForm, colors: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Sizes (comma separated)</label>
                  <input
                    type="text"
                    placeholder="S, M, L, XL"
                    value={prodForm.sizes}
                    onChange={(e) => setProdForm({ ...prodForm, sizes: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Image URL (High-res photo)</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={prodForm.images}
                  onChange={(e) => setProdForm({ ...prodForm, images: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Product Description</label>
                <textarea
                  rows={3}
                  value={prodForm.description}
                  onChange={(e) => setProdForm({ ...prodForm, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                  placeholder="Crafted with pure mulmul cotton..."
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Coupon Modal */}
      {isAddCouponOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-bold text-base text-gray-900">Create Promo Coupon</h3>
            <form onSubmit={handleAddCouponSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Coupon Code (e.g. FLASH25)</label>
                <input
                  type="text"
                  required
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 uppercase font-mono"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Discount Percentage (%)</label>
                <input
                  type="number"
                  required
                  value={newCouponPercent}
                  onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Min Order Value (₹)</label>
                <input
                  type="number"
                  required
                  value={newCouponMin}
                  onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddCouponOpen(false)}
                  className="flex-1 py-2 bg-gray-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
