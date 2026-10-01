import React, { useState, useMemo } from 'react';
import {
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  ShoppingBag,
  Search,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { ProductCard } from '../components/ProductCard';
import { CategoryType } from '../types';

export const ShopPage: React.FC = () => {
  const { products, searchQuery, setSearchQuery, setIsAIAssistantOpen } = useStore();
  const { currentPath, categoryParam } = useRouter();

  // Mobile filter drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filter States
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    if (categoryParam) return [categoryParam];
    return [];
  });

  const [priceRange, setPriceRange] = useState<string>('all');
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Extract all available colors and sizes from catalog
  const allColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.colors.forEach((c) => set.add(c)));
    return Array.from(set).slice(0, 10);
  }, [products]);

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'Free Size'];

  // Handle category toggle
  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange('all');
    setSelectedColors([]);
    setSelectedSizes([]);
    setInStockOnly(false);
    setSearchQuery('');
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Query search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchCat = p.category.toLowerCase().includes(q);
          const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
          const matchDesc = p.description.toLowerCase().includes(q);
          if (!matchName && !matchCat && !matchTag && !matchDesc) return false;
        }

        // Category
        if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
          return false;
        }

        // In Stock
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        // Price
        if (priceRange === 'under500' && p.price >= 500) return false;
        if (priceRange === '500to999' && (p.price < 500 || p.price > 999)) return false;
        if (priceRange === '1000to1999' && (p.price < 1000 || p.price > 1999)) return false;
        if (priceRange === '2000plus' && p.price < 2000) return false;

        // Color
        if (selectedColors.length > 0 && !p.colors.some((c) => selectedColors.includes(c))) {
          return false;
        }

        // Size
        if (selectedSizes.length > 0 && !p.sizes.some((s) => selectedSizes.includes(s))) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      });
  }, [
    products,
    searchQuery,
    selectedCategories,
    inStockOnly,
    priceRange,
    selectedColors,
    selectedSizes,
    sortBy,
  ]);

  const activeFilterCount =
    selectedCategories.length +
    (priceRange !== 'all' ? 1 : 0) +
    selectedColors.length +
    selectedSizes.length +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Banner / Breadcrumb & Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          {categoryParam
            ? `Shop ${categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1)}`
            : searchQuery
            ? `Search Results for "${searchQuery}"`
            : 'All Fashion Collections'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Showing {filteredProducts.length} authentic products in NovaCart store.
        </p>
      </div>

      {/* Control Bar: Filter toggle & Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-xs mb-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-1.5 px-3.5 py-2 bg-blue-50 text-blue-700 text-xs font-semibold rounded-xl"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters ({activeFilterCount})</span>
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1"
            >
              Clear All Filters
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center space-x-2 ml-auto">
          <label className="text-xs font-medium text-gray-500 hidden sm:inline">Sort By:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-xs font-medium rounded-xl px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
          >
            <option value="featured">Featured / Trending</option>
            <option value="newest">New Arrivals</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-white p-5 rounded-2xl border border-blue-100 shadow-xs h-fit sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center space-x-1.5">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filter Catalog</span>
            </h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-blue-600 hover:underline font-semibold"
              >
                Reset
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
              Category
            </h4>
            <div className="space-y-1.5 text-xs text-gray-700">
              {[
                { id: 'dresses', label: 'Fashion Dresses & Kurtis' },
                { id: 'handbags', label: 'Handbags & Totes' },
                { id: 'jewellery', label: 'Jewellery & Sets' },
                { id: 'accessories', label: 'Trendy Accessories' },
              ].map((cat) => (
                <label key={cat.id} className="flex items-center space-x-2 cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCategory(cat.id)}
                    className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>{cat.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
              Price Range
            </h4>
            <div className="space-y-1.5 text-xs text-gray-700">
              {[
                { id: 'all', label: 'All Prices' },
                { id: 'under500', label: 'Under ₹500' },
                { id: '500to999', label: '₹500 to ₹999' },
                { id: '1000to1999', label: '₹1,000 to ₹1,999' },
                { id: '2000plus', label: '₹2,000 and above' },
              ].map((p) => (
                <label key={p.id} className="flex items-center space-x-2 cursor-pointer py-0.5">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === p.id}
                    onChange={() => setPriceRange(p.id)}
                    className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
              Availability
            </h4>
            <label className="flex items-center space-x-2 text-xs text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Sizes */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
              Size
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {allSizes.map((size) => {
                const isSelected = selectedSizes.includes(size);
                return (
                  <button
                    key={size}
                    onClick={() => toggleSize(size)}
                    className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5">
              Colors
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {allColors.map((color) => {
                const isSelected = selectedColors.includes(color);
                return (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`px-2.5 py-1 text-xs rounded-full font-medium transition ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {color}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ask Nova AI Widget */}
          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-center space-y-2">
            <Sparkles className="w-5 h-5 text-blue-600 mx-auto" />
            <h5 className="text-xs font-bold text-blue-900">Need Style Advice?</h5>
            <p className="text-[11px] text-blue-700">
              Let Nova AI recommend outfits based on your body type, event, and budget!
            </p>
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-1.5 rounded-lg text-xs font-semibold shadow-xs"
            >
              Ask Nova AI
            </button>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No matching products found</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try loosening your filters or search keywords, or ask Nova AI to find alternative styles!
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition"
                >
                  Clear All Filters
                </button>
                <button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition flex items-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask Nova AI</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-base font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Category
                </h4>
                <div className="space-y-1.5 text-xs text-gray-700">
                  {['dresses', 'handbags', 'jewellery', 'accessories'].map((cat) => (
                    <label key={cat} className="flex items-center space-x-2 py-0.5">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                        className="rounded text-blue-600 w-4 h-4"
                      />
                      <span className="capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">
                  Price
                </h4>
                <div className="space-y-1.5 text-xs text-gray-700">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'under500', label: 'Under ₹500' },
                    { id: '500to999', label: '₹500 to ₹999' },
                    { id: '1000to1999', label: '₹1,000 to ₹1,999' },
                    { id: '2000plus', label: '₹2,000+' },
                  ].map((p) => (
                    <label key={p.id} className="flex items-center space-x-2 py-0.5">
                      <input
                        type="radio"
                        name="mobPrice"
                        checked={priceRange === p.id}
                        onChange={() => setPriceRange(p.id)}
                        className="text-blue-600 w-4 h-4"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* In stock */}
              <div>
                <label className="flex items-center space-x-2 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 text-xs font-semibold bg-gray-100 text-gray-700 rounded-xl"
              >
                Clear
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 text-xs font-semibold bg-blue-600 text-white rounded-xl shadow-xs"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
