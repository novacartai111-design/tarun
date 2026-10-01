import React from 'react';
import { Sparkles, ShieldCheck, Heart, Users, Target, ArrowRight } from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const AboutPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Brand Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>About NovaCart Ai</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Redefining Everyday Indian Fashion with Intelligence
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          NovaCart Ai (novaworld.digital) is a modern fashion shopping platform designed to make discovering fashion and accessories simple, convenient, and enjoyable for teenagers, college students, and young professionals.
        </p>
      </div>

      {/* Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="font-bold text-base text-gray-900">Your Style. Your Choice.</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            We believe style is personal. From hand-embroidered Chikankari kurtas to sleek vegan leather totes, every item is curated with an eye for everyday Indian wearability.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="font-bold text-base text-gray-900">Powered by AI</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Nova AI is our virtual stylist. Ask what to wear to a campus fest or a family reception, and get real catalog recommendations that match your exact budget and preference.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="font-bold text-base text-gray-900">Fair & Transparent</h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            No inflated markups or hidden fees. Transparent Indian pricing, clear shipping costs (free above ₹999), and a smooth 7-day doorstep return policy.
          </p>
        </div>
      </div>

      {/* Target Audience & Categories */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-3xl p-8 border border-blue-100 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Curated Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-gray-800">
          <div className="bg-white p-4 rounded-2xl shadow-xs text-center">
            👗 Fashion Dresses & Kurtis
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-xs text-center">
            👜 Handbags & College Totes
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-xs text-center">
            ✨ Kundan & Boho Jewellery
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-xs text-center">
            🕶️ Trendy Sunglasses & Belts
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => navigate('/shop')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-full text-sm shadow-md transition"
        >
          Explore Catalog Now
        </button>
      </div>
    </div>
  );
};
