import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Mail,
  MapPin,
  Heart,
} from 'lucide-react';
import { useRouter } from '../context/RouterContext';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 lg:pb-12 border-t border-slate-800">
      {/* Trust & Guarantee Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Fast Pan-India Delivery</h4>
              <p className="text-[11px] text-slate-400">Free delivery on orders above ₹999</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-green-600/20 text-green-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Easy 7-Day Returns</h4>
              <p className="text-[11px] text-slate-400">Hassle-free doorstep pickup & exchange</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Genuine Quality</h4>
              <p className="text-[11px] text-slate-400">Hand-curated fashion fabrics & materials</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">24/7 Dedicated Support</h4>
              <p className="text-[11px] text-slate-400">Assistance via WhatsApp & email</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">NovaCart Ai</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              “Your Style. Your Choice. Powered by AI.” Discover fashion dresses, college tote bags, jewellery, and trendy accessories curated for India’s fashion-forward youth.
            </p>
            <div className="pt-2 text-xs space-y-1.5 text-slate-400">
              <p className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>NovaCart Digital Commerce, Bengaluru, Karnataka, India</span>
              </p>
              <p className="flex items-center space-x-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>support@novacart.ai | novaworld.digital</span>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Explore Collections
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/category/dresses')} className="hover:text-blue-400 transition">
                  Fashion Dresses & Kurtis
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/category/handbags')} className="hover:text-blue-400 transition">
                  Handbags & College Totes
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/category/jewellery')} className="hover:text-blue-400 transition">
                  Kundan & Boho Jewellery
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/category/accessories')} className="hover:text-blue-400 transition">
                  Trendy Sunglasses & Belts
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shop?filter=new')} className="hover:text-blue-400 transition">
                  New Arrivals
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/orders')} className="hover:text-blue-400 transition">
                  Track Your Order
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/faq')} className="hover:text-blue-400 transition">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/shipping')} className="hover:text-blue-400 transition">
                  Shipping & Delivery Times
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/returns')} className="hover:text-blue-400 transition">
                  Return & Refund Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-blue-400 transition">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Portal */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-blue-400 transition">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-blue-400 transition">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-blue-400 transition">
                  About NovaCart Ai
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/admin')} className="text-blue-400 hover:text-blue-300 font-semibold transition">
                  Admin Control Panel
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Payments & Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
        <div>
          © {new Date().getFullYear()} NovaCart Ai (novaworld.digital). All rights reserved.
        </div>

        {/* Indian Payment Methods Badge */}
        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-slate-400">Accepted Payments:</span>
          <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-mono font-bold">UPI</span>
          <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-medium">RuPay</span>
          <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-medium">Visa</span>
          <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-medium">MasterCard</span>
          <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-medium">NetBanking</span>
          <span className="bg-slate-800 text-emerald-400 px-2 py-0.5 rounded font-medium">Cash on Delivery</span>
        </div>
      </div>
    </footer>
  );
};
