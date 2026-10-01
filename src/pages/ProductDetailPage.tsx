import React, { useState } from 'react';
import {
  Heart,
  Star,
  ShoppingBag,
  Zap,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  ChevronRight,
  ZoomIn,
  Ruler,
  HelpCircle,
  Share2,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { ProductCard } from '../components/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { productIdParam, navigate } = useRouter();
  const { products, addToCart, toggleWishlist, isInWishlist, setIsCartOpen } = useStore();

  const product = products.find((p) => p.id === productIdParam) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0] || 'Standard');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0] || 'Free Size');
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('');
  const [pincodeMessage, setPincodeMessage] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCopiedLink, setIsCopiedLink] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-900">Product not found</h2>
        <button
          onClick={() => navigate('/shop')}
          className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-full text-xs font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const res = addToCart(product, quantity, selectedColor, selectedSize);
    if (res.success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
      setIsCartOpen(true);
    }
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate('/checkout');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      setPincodeMessage('Please enter a valid 6-digit Indian PIN code (e.g. 560038, 110001).');
      return;
    }
    const days = pincode.startsWith('5') || pincode.startsWith('4') || pincode.startsWith('1') ? 2 : 4;
    const deliveryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString(
      'en-IN',
      { weekday: 'short', day: 'numeric', month: 'short' }
    );
    setPincodeMessage(`✅ Delivery by ${deliveryDate} | Cash on Delivery available.`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopiedLink(true);
    setTimeout(() => setIsCopiedLink(false), 2000);
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs text-gray-500 overflow-x-auto whitespace-nowrap">
        <button onClick={() => navigate('/')} className="hover:text-blue-600 transition">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button onClick={() => navigate('/shop')} className="hover:text-blue-600 transition">
          Shop
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <button
          onClick={() => navigate(`/category/${product.category}`)}
          className="hover:text-blue-600 capitalize transition"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-gray-900 font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 pb-2 md:pb-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                    activeImageIndex === idx ? 'border-blue-600 shadow-md' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Primary View Area with Zoom Trigger */}
          <div className="flex-1 relative aspect-[3/4] bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 group shadow-xs">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover object-center cursor-zoom-in group-hover:scale-105 transition duration-500"
              onClick={() => setIsZoomModalOpen(true)}
            />

            {/* Discount Pill */}
            {product.discount > 0 && !isOutOfStock && (
              <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                {product.discount}% OFF
              </span>
            )}

            {isOutOfStock && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                Out of Stock
              </span>
            )}

            {/* Zoom Action hint */}
            <button
              onClick={() => setIsZoomModalOpen(true)}
              className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md p-2 rounded-xl text-gray-700 hover:text-blue-600 shadow-md flex items-center space-x-1 text-xs font-medium"
            >
              <ZoomIn className="w-4 h-4" />
              <span className="hidden sm:inline">Zoom</span>
            </button>
          </div>
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-blue-600">
                {product.category} • SKU: {product.sku}
              </span>
              <button
                onClick={handleShare}
                className="text-xs text-gray-500 hover:text-blue-600 flex items-center space-x-1"
                title="Share product link"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isCopiedLink ? 'Copied!' : 'Share'}</span>
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Reviews */}
            <div className="flex items-center space-x-2 mt-2">
              <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-0.5 rounded-lg text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-green-600 text-green-600" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewsCount} verified customer ratings)
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
            <div className="flex items-baseline space-x-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
                  Save {product.discount}%
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Inclusive of all taxes. Free shipping on orders above ₹999.
            </p>
          </div>

          {/* Color Selector */}
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
              Color: <span className="font-semibold text-blue-700">{selectedColor}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                    selectedColor === color
                      ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                      : 'border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                Select Size: <span className="font-semibold text-blue-700">{selectedSize}</span>
              </label>
              {product.category === 'dresses' && (
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-blue-600 hover:underline flex items-center space-x-1 font-semibold"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Size Chart</span>
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition ${
                    selectedSize === size
                      ? 'border-blue-600 bg-blue-600 text-white font-bold shadow-xs'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock Availability indicator */}
          <div>
            {isOutOfStock ? (
              <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-bold border border-red-200 flex items-center space-x-2">
                <span>⚠️ Currently Out of Stock. Join waitlist or ask Nova AI for similar picks.</span>
              </div>
            ) : product.stock <= 5 ? (
              <div className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 inline-block">
                ⚡ Hurry! Only {product.stock} items left in stock.
              </div>
            ) : (
              <div className="text-xs font-semibold text-green-700 flex items-center space-x-1">
                <Check className="w-4 h-4 text-green-600" />
                <span>In Stock ({product.stock} units ready to ship)</span>
              </div>
            )}
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50 h-12">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-200 font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  disabled={quantity >= product.stock}
                  className="px-3 py-2 text-gray-600 hover:bg-gray-200 font-bold disabled:opacity-30"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 transition shadow-md shadow-blue-500/20 ${
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isAdded
                    ? 'bg-green-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition shrink-0 ${
                  isFavorite
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'border-gray-200 text-gray-600 hover:text-red-500 hover:bg-gray-50'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>
            </div>

            {/* Buy Now direct CTA */}
            {!isOutOfStock && (
              <button
                onClick={handleBuyNow}
                className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold rounded-xl text-sm flex items-center justify-center space-x-2 transition shadow-md shadow-amber-500/20 active:scale-[0.99]"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Buy Now with 1-Click</span>
              </button>
            )}
          </div>

          {/* Pincode Delivery Checker */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Truck className="w-4 h-4 text-blue-600" />
              <span>Delivery & Availability</span>
            </h4>
            <form onSubmit={handlePincodeCheck} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit PIN code (e.g. 560038)"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-semibold"
              >
                Check
              </button>
            </form>
            {pincodeMessage && (
              <p className="text-xs text-blue-700 font-medium mt-2 bg-blue-50 p-2.5 rounded-lg">
                {pincodeMessage}
              </p>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-600">
            <div className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-xl">
              <RotateCcw className="w-4 h-4 text-blue-600 shrink-0" />
              <span>7-Day Doorstep Returns</span>
            </div>
            <div className="flex items-center space-x-2 bg-gray-50 p-2.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-green-600 shrink-0" />
              <span>100% Genuine Quality</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description & Specifications */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-xs space-y-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Product Description</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Specifications & Fabric Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {Object.entries(product.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                <span className="font-semibold text-gray-500">{key}</span>
                <span className="font-medium text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">You May Also Like</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Zoom Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs cursor-pointer"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative max-w-2xl max-h-[90vh]">
            <img
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.name}
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-center text-xs text-white/80 mt-2">Click anywhere to close zoom</p>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-gray-900">Indian Women's Size Guide (Inches)</h3>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-blue-50 text-blue-900">
                    <th className="p-2.5 font-bold">Size</th>
                    <th className="p-2.5 font-bold">Bust</th>
                    <th className="p-2.5 font-bold">Waist</th>
                    <th className="p-2.5 font-bold">Hip</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-2.5 font-bold">XS</td>
                    <td className="p-2.5">32</td>
                    <td className="p-2.5">26</td>
                    <td className="p-2.5">35</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">S</td>
                    <td className="p-2.5">34</td>
                    <td className="p-2.5">28</td>
                    <td className="p-2.5">37</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">M</td>
                    <td className="p-2.5">36</td>
                    <td className="p-2.5">30</td>
                    <td className="p-2.5">39</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">L</td>
                    <td className="p-2.5">38</td>
                    <td className="p-2.5">32</td>
                    <td className="p-2.5">41</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">XL</td>
                    <td className="p-2.5">40</td>
                    <td className="p-2.5">34</td>
                    <td className="p-2.5">43</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-gray-500 mt-4">
              Tip: If you fall between two sizes, we recommend sizing up for regular comfort.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
