import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Copy,
  Check,
  Star,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useRouter } from '../context/RouterContext';
import { ProductCard } from '../components/ProductCard';

export const HomePage: React.FC = () => {
  const { products, coupons, setIsAIAssistantOpen, applyCoupon } = useStore();
  const { navigate } = useRouter();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Trending & New Arrivals
  const featuredProducts = products.filter((p) => p.featured).slice(0, 4);
  const newArrivalProducts = products.filter((p) => p.isNewArrival).slice(0, 4);

  const categories = [
    {
      id: 'dresses',
      title: 'Fashion Dresses',
      subtitle: 'Chikankari kurtas, floral tiered midis & satin evening dresses.',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      tag: 'From ₹899',
    },
    {
      id: 'handbags',
      title: 'Handbags & Totes',
      subtitle: 'Vegan leather college totes, crossbody slings & pearl clutches.',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      tag: 'From ₹799',
    },
    {
      id: 'jewellery',
      title: 'Elegant Jewellery',
      subtitle: 'Kundan choker sets, boho jhumkas & anti-tarnish gold chains.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      tag: 'From ₹499',
    },
    {
      id: 'accessories',
      title: 'Trendy Accessories',
      subtitle: 'UV400 retro sunglasses, satin hair scarves & statement belts.',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
      tag: 'From ₹399',
    },
  ];

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    applyCoupon(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-blue-50/50 pt-8 sm:pt-14 pb-14 sm:pb-20 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 bg-blue-100/80 text-blue-800 text-xs font-bold px-3.5 py-1.5 rounded-full border border-blue-200 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Next-Gen Indian Fashion Commerce</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                Discover Your Style with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
                  NovaCart Ai
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Shop fashion, handbags, jewellery and accessories — all in one place. Powered by AI to match your occasion, budget, and individuality.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => navigate('/shop')}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full text-sm sm:text-base shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition transform active:scale-95"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('categories-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-white hover:bg-blue-50 text-gray-800 hover:text-blue-700 border border-gray-200 hover:border-blue-300 font-semibold px-7 py-3.5 rounded-full text-sm sm:text-base transition shadow-xs"
                >
                  Explore Collections
                </button>

                <button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-50 to-blue-50 hover:bg-blue-100 text-blue-700 font-semibold px-5 py-3.5 rounded-full text-xs sm:text-sm border border-blue-200 flex items-center justify-center space-x-1.5 transition"
                >
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Ask Nova AI</span>
                </button>
              </div>

              {/* Value metrics */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-blue-100/80 max-w-md mx-auto lg:mx-0 text-center lg:text-left">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-[11px] text-gray-500 font-medium">Genuine Fabrics</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">7 Days</div>
                  <div className="text-[11px] text-gray-500 font-medium">Doorstep Returns</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">Pan-India</div>
                  <div className="text-[11px] text-gray-500 font-medium">Free Delivery ₹999+</div>
                </div>
              </div>
            </div>

            {/* Right Fashion Collage Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background glow */}
                <div className="absolute -top-6 -right-6 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-50 -z-10" />
                <div className="absolute -bottom-6 -left-6 w-60 h-60 bg-indigo-200 rounded-full filter blur-2xl opacity-40 -z-10" />

                {/* Primary Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
                    alt="Indian modern fashion"
                    className="w-full h-[400px] sm:h-[460px] object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/70 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs uppercase font-bold tracking-widest text-blue-300">
                      Festive & College Edit 2026
                    </span>
                    <h3 className="text-xl font-bold mt-1 text-white">
                      Curated Indian Style, Modern Fit
                    </h3>
                    <p className="text-xs text-blue-100 mt-1">
                      Designed for college students, young professionals, and trendsetters.
                    </p>
                  </div>
                </div>

                {/* Floating Micro-Badge */}
                <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-blue-100 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Sparkles className="w-5 h-5 text-amber-300" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">Ask Nova AI</div>
                    <div className="text-[10px] text-gray-500">“Need an outfit under ₹2000”</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Handcrafted for every Indian lifestyle, college campus, and celebrations.
            </p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigate(`/category/${cat.id}`)}
              className="group relative bg-white border border-gray-100 hover:border-blue-300 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-gray-900 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                  {cat.tag}
                </span>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-gray-200 mt-1 line-clamp-2">
                    {cat.subtitle}
                  </p>
                  <div className="mt-3 inline-flex items-center text-xs font-bold text-white bg-blue-600/90 group-hover:bg-blue-600 px-3.5 py-1.5 rounded-full transition shadow-xs">
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Now / Featured Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Most Loved
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              Trending Now
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Top picks chosen by thousands of fashion-conscious Indian shoppers.
            </p>
          </div>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Style More. Save More. Offers Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-6 sm:p-10 shadow-xl">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-3">
              <span className="inline-block bg-blue-500/30 text-blue-200 border border-blue-400/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Store Promotions
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Style More. Save More.
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 max-w-lg leading-relaxed">
                Enjoy transparent and verified instant discounts. Apply authentic promo codes directly at checkout on clothing, bags & jewellery!
              </p>
            </div>

            {/* Coupons Grid */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-2.5">
              {coupons.map((coupon) => (
                <div
                  key={coupon.code}
                  className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3.5 flex items-center justify-between gap-3 hover:bg-white/15 transition"
                >
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-sm bg-white text-blue-900 px-2.5 py-0.5 rounded-lg shadow-xs">
                        {coupon.code}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-300">
                        Active Offer
                      </span>
                    </div>
                    <p className="text-xs text-blue-100 mt-1 truncate">
                      {coupon.description}
                    </p>
                  </div>

                  <button
                    onClick={() => handleCopyCoupon(coupon.code)}
                    className="shrink-0 bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold px-3 py-2 rounded-xl transition flex items-center space-x-1"
                  >
                    {copiedCode === coupon.code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white" />
                        <span>Applied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Fresh Drops
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mt-1">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Recently added designs in fashion dresses, bags, earrings & accessories.
            </p>
          </div>
          <button
            onClick={() => navigate('/shop?filter=new')}
            className="text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>View All New Arrivals</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {newArrivalProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Nova AI Interactive Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white rounded-3xl p-6 sm:p-12 border border-blue-100 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Fashion Assistant</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Can’t decide what to wear for college or party?
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Ask Nova AI! Tell us your occasion, budget, or preferred color, and our AI stylist will recommend authentic matching items available right here in the store catalog.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 justify-center lg:justify-start">
              {[
                'Handbag for college',
                'Gold necklace under ₹1000',
                'Party dress for Saturday',
                'Retro cat-eye sunglasses',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 text-xs px-3 py-1.5 rounded-full font-medium transition shadow-xs"
                >
                  “{q}”
                </button>
              ))}
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold px-8 py-4 rounded-full text-sm sm:text-base shadow-xl shadow-blue-500/30 flex items-center space-x-3 transition transform"
            >
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Chat with Nova AI</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
