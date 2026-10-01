import React, { useState } from 'react';
import {
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ChevronDown,
  ShieldCheck,
  Package,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';

export const Header: React.FC = () => {
  const {
    cart,
    wishlist,
    user,
    setIsCartOpen,
    setIsLoginModalOpen,
    setIsAIAssistantOpen,
    searchQuery,
    setSearchQuery,
    logout,
  } = useStore();
  const { currentPath, navigate } = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/shop');
      setIsSearchFocused(false);
    }
  };

  const handleQuickTagClick = (tag: string) => {
    setSearchQuery(tag);
    navigate('/shop');
    setIsSearchFocused(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop All', path: '/shop' },
    {
      name: 'Categories',
      isDropdown: true,
      subItems: [
        { label: '👗 Fashion Dresses', path: '/category/dresses' },
        { label: '👜 Handbags & Totes', path: '/category/handbags' },
        { label: '✨ Elegant Jewellery', path: '/category/jewellery' },
        { label: '🕶️ Trendy Accessories', path: '/category/accessories' },
      ],
    },
    { name: 'New Arrivals', path: '/shop?filter=new' },
    { name: 'Offers', path: '/shop?filter=offers' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-xs">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="bg-blue-800/80 text-blue-200 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase">
              Exclusive
            </span>
            <span className="font-medium text-blue-50">
              Style More, Save More! Flat ₹200 OFF with code <strong className="text-white underline">FIRSTFASHION</strong> | Free Pan-India Delivery over ₹999
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-blue-100 text-xs shrink-0">
            <button
              onClick={() => navigate('/orders')}
              className="hover:text-white transition flex items-center space-x-1"
            >
              <Package className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>
            <span>|</span>
            <button
              onClick={() => navigate('/contact')}
              className="hover:text-white transition"
            >
              Help & Support
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-left group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition transform">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-1">
                  <span className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 group-hover:text-blue-700 transition">
                    NovaCart
                  </span>
                  <span className="bg-blue-600 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    AI
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 hidden sm:block font-medium -mt-1 tracking-tight">
                  Your Style. Your Choice.
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg relative mx-2">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <input
                type="text"
                placeholder="Search dresses, handbags, jewellery, sunglasses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition shadow-inner"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>

            {/* Quick Search Dropdown suggestions */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-blue-100 p-4 z-50">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Trending Fashion Searches
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {[
                    'Floral Midi Dress',
                    'College Tote Bag',
                    'Kundan Choker',
                    'Boho Jhumka',
                    'Cat-Eye Sunglasses',
                    'Satin Dress',
                  ].map((item) => (
                    <button
                      key={item}
                      onMouseDown={() => handleQuickTagClick(item)}
                      className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs rounded-full transition font-medium"
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-2 flex items-center justify-between text-xs text-gray-500">
                  <span>💡 Ask Nova AI for personalized outfit matching</span>
                  <button
                    onMouseDown={() => setIsAIAssistantOpen(true)}
                    className="text-blue-600 font-semibold hover:underline flex items-center space-x-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Try Nova AI</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Ask Nova AI Button */}
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="hidden sm:flex items-center space-x-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3.5 py-2 rounded-full text-xs font-semibold shadow-sm shadow-blue-500/25 transition transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask Nova AI</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigate('/wishlist')}
              className="p-2 sm:p-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full relative transition"
              title="Wishlist"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 sm:p-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-full relative transition"
              title="Shopping Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Account / Profile */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-blue-50 border border-transparent hover:border-blue-200 transition"
                  >
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs">
                      {user.name.charAt(0)}
                    </div>
                    <span className="hidden xl:inline text-xs font-semibold text-gray-800">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-blue-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs font-semibold text-gray-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                        {user.role === 'admin' && (
                          <span className="inline-block mt-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                            Store Admin
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/account');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-2"
                      >
                        <UserIcon className="w-4 h-4" />
                        <span>My Account & Orders</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/orders');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-2"
                      >
                        <Package className="w-4 h-4" />
                        <span>Track Orders</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('/admin');
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-2 font-medium"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                        <span>Admin Dashboard</span>
                      </button>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full border border-blue-200 transition"
                >
                  <UserIcon className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search dresses, bags, jewellery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:bg-white"
            />
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-gray-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center justify-between border-t border-gray-100 py-2.5 text-sm font-medium">
          <div className="flex items-center space-x-7">
            {navLinks.map((link) => {
              if (link.isDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setIsCategoryDropdownOpen(true)}
                    onMouseLeave={() => setIsCategoryDropdownOpen(false)}
                  >
                    <button
                      className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 py-1 font-medium transition"
                    >
                      <span>{link.name}</span>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>

                    {isCategoryDropdownOpen && (
                      <div className="absolute top-full left-0 w-60 bg-white rounded-2xl shadow-xl border border-blue-100 py-2 z-50">
                        {link.subItems?.map((item) => (
                          <button
                            key={item.label}
                            onClick={() => {
                              setIsCategoryDropdownOpen(false);
                              navigate(item.path);
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 flex items-center transition"
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              const isActive = link.path ? currentPath === link.path : false;
              return (
                <button
                  key={link.name}
                  onClick={() => link.path && navigate(link.path)}
                  className={`py-1 transition relative ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center space-x-5 text-xs text-gray-500 font-medium">
            <span className="flex items-center text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              100% Genuine Quality
            </span>
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-400 hover:text-blue-600 transition"
              title="Admin Portal"
            >
              Admin Dashboard
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex">
          <div className="w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-lg text-gray-900">NovaCart Ai</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsAIAssistantOpen(true);
                  }}
                  className="w-full flex items-center space-x-2 p-3 bg-blue-50 text-blue-700 font-semibold rounded-xl text-sm mb-3"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Ask Nova AI Stylist</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/');
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 rounded-lg"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/shop');
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm font-medium text-gray-800 hover:bg-blue-50 rounded-lg"
                >
                  Shop All Products
                </button>

                <div className="pt-2 pb-1 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Categories
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/category/dresses');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600"
                >
                  👗 Dresses & Ethnic Wear
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/category/handbags');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600"
                >
                  👜 Handbags & Totes
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/category/jewellery');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600"
                >
                  ✨ Elegant Jewellery
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/category/accessories');
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-blue-600"
                >
                  🕶️ Trendy Accessories
                </button>

                <div className="pt-2 pb-1 px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  My Store
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/account');
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg"
                >
                  My Account
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/orders');
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg"
                >
                  My Orders & Tracking
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/wishlist');
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-lg"
                >
                  Wishlist ({wishlistCount})
                </button>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigate('/admin');
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-blue-700 font-semibold hover:bg-blue-50 rounded-lg"
                >
                  Admin Dashboard
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 text-xs text-gray-500">
              <p className="font-medium text-gray-700">NovaCart Ai</p>
              <p>novaworld.digital</p>
            </div>
          </div>
          <div
            className="flex-1"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
      )}
    </header>
  );
};
