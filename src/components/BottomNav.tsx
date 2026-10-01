import React from 'react';
import { Home, Grid, Search, Heart, ShoppingBag, User } from 'lucide-react';
import { useRouter } from '../context/RouterContext';
import { useStore } from '../context/StoreContext';

export const BottomNav: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const { cart, wishlist, setIsCartOpen, setIsLoginModalOpen, user } = useStore();

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const navItems = [
    { label: 'Home', icon: Home, path: '/', action: () => navigate('/') },
    { label: 'Shop', icon: Grid, path: '/shop', action: () => navigate('/shop') },
    {
      label: 'Wishlist',
      icon: Heart,
      path: '/wishlist',
      badge: wishlistCount,
      action: () => navigate('/wishlist'),
    },
    {
      label: 'Cart',
      icon: ShoppingBag,
      path: '/cart',
      badge: cartCount,
      action: () => setIsCartOpen(true),
    },
    {
      label: 'Account',
      icon: User,
      path: '/account',
      action: () => {
        if (!user) {
          setIsLoginModalOpen(true);
        } else {
          navigate('/account');
        }
      },
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-blue-100 shadow-lg px-2 py-1.5 safe-area-pb">
      <div className="grid grid-cols-5 items-center justify-around">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={item.action}
              className={`flex flex-col items-center justify-center py-1 transition relative ${
                isActive ? 'text-blue-600 font-semibold' : 'text-gray-500 hover:text-blue-600'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
