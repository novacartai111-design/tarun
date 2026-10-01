import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const { navigate } = useRouter();
  const [isAdded, setIsAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const isFavorite = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;

    const res = addToCart(product, 1, product.colors[0], product.sizes[0]);
    if (res.success) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="group relative bg-white border border-gray-100 hover:border-blue-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition duration-300 flex flex-col cursor-pointer"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden">
        {/* Shimmer skeleton */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
        )}
        <img
          src={product.images[0]}
          alt={product.name}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Discount Badge */}
        {product.discount > 0 && !isOutOfStock && (
          <span className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-xs">
            {product.discount}% OFF
          </span>
        )}

        {/* Out of Stock Overlay / Badge */}
        {isOutOfStock && (
          <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
            Out of Stock
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition shadow-xs ${
            isFavorite
              ? 'bg-red-50 text-red-500 hover:bg-red-100'
              : 'bg-white/90 text-gray-600 hover:text-red-500 hover:bg-white'
          }`}
          aria-label="Save to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Category Pill Tag */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="bg-black/40 backdrop-blur-xs text-white text-[10px] uppercase font-semibold px-2 py-0.5 rounded tracking-wide">
            {product.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1.5 mb-1.5">
            <div className="flex items-center space-x-0.5 bg-green-50 px-1.5 py-0.5 rounded text-[11px] font-bold text-green-700">
              <Star className="w-3 h-3 fill-green-600 text-green-600" />
              <span>{product.rating}</span>
            </div>
            <span className="text-[11px] text-gray-400">({product.reviewsCount})</span>
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition">
            {product.name}
          </h3>

          {/* Color swatches preview */}
          <div className="flex items-center space-x-1 mt-1 text-[11px] text-gray-500">
            <span>{product.colors.length} {product.colors.length === 1 ? 'color' : 'colors'}</span>
            <span>•</span>
            <span className="truncate max-w-[120px]">{product.colors[0]}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-bold text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            {product.stock <= 5 && product.stock > 0 && (
              <span className="text-[10px] text-amber-600 font-semibold">
                Only {product.stock} left!
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`p-2 rounded-xl transition flex items-center justify-center ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isAdded
                ? 'bg-green-600 text-white'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white'
            }`}
            title={isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
          >
            {isAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
