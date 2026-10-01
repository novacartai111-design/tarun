import React, { useState } from 'react';
import { X, Sparkles, User, Mail, Lock, Phone, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, register } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      login(email || 'customer@novacart.ai');
    } else {
      register(name || 'NovaCart Shopper', email || 'customer@novacart.ai', phone || '+91 9876543210');
    }
  };

  const handleQuickCustomer = () => {
    login('priya.sharma@example.in', 'customer');
  };

  const handleQuickAdmin = () => {
    login('admin@novacart.ai', 'admin');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={() => setIsLoginModalOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl z-10 border border-blue-100">
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600 text-white mb-3 shadow-md shadow-blue-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">
            {mode === 'login' ? 'Welcome to NovaCart Ai' : 'Create Your NovaCart Account'}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {mode === 'login'
              ? 'Log in to track orders, save wishlist & get AI style picks'
              : 'Sign up for exclusive student discounts and instant tracking'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              mode === 'login' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
              mode === 'register' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Email or Mobile Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="priya.sharma@example.in or 9876543210"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                WhatsApp / Phone (for order updates)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-blue-600 focus:bg-white"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-md shadow-blue-500/20"
          >
            {mode === 'login' ? 'Sign In to NovaCart' : 'Create NovaCart Account'}
          </button>
        </form>

        {/* Quick Demo Logins for instant evaluation */}
        <div className="mt-5 pt-4 border-t border-gray-100 text-center">
          <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-2.5">
            Quick 1-Click Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickCustomer}
              className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold transition"
            >
              Demo Shopper (Priya)
            </button>
            <button
              onClick={handleQuickAdmin}
              className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition"
            >
              Demo Admin Portal
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-1.5 text-[10px] text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-green-600" />
          <span>Your data is encrypted & protected by NovaCart Ai</span>
        </div>
      </div>
    </div>
  );
};
