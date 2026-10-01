import React from 'react';
import { StoreProvider } from './context/StoreContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { CartDrawer } from './components/CartDrawer';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { LoginModal } from './components/LoginModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { AccountPage } from './pages/AccountPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FAQPage, ShippingPage, ReturnsPage, PrivacyTermsPage } from './pages/PolicyPages';

const MainRouter: React.FC = () => {
  const { currentPath } = useRouter();

  const renderCurrentView = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage />;
    }
    if (currentPath.startsWith('/shop') || currentPath.startsWith('/category/')) {
      return <ShopPage />;
    }
    if (currentPath.startsWith('/product/')) {
      return <ProductDetailPage />;
    }
    if (currentPath === '/cart') {
      return <CartPage />;
    }
    if (currentPath === '/checkout') {
      return <CheckoutPage />;
    }
    if (currentPath.startsWith('/order-confirmation/')) {
      return <OrderConfirmationPage />;
    }
    if (currentPath.startsWith('/track/') || currentPath === '/orders') {
      return <OrderTrackingPage />;
    }
    if (currentPath === '/wishlist' || currentPath === '/account') {
      return <AccountPage />;
    }
    if (currentPath === '/admin') {
      return <AdminDashboard />;
    }
    if (currentPath === '/about') {
      return <AboutPage />;
    }
    if (currentPath === '/contact') {
      return <ContactPage />;
    }
    if (currentPath === '/faq') {
      return <FAQPage />;
    }
    if (currentPath === '/shipping') {
      return <ShippingPage />;
    }
    if (currentPath === '/returns') {
      return <ReturnsPage />;
    }
    if (currentPath === '/privacy') {
      return <PrivacyTermsPage type="privacy" />;
    }
    if (currentPath === '/terms') {
      return <PrivacyTermsPage type="terms" />;
    }

    // Default fallback
    return <HomePage />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      <Header />
      <main className="flex-1">{renderCurrentView()}</main>
      <Footer />
      <BottomNav />
      <CartDrawer />
      <AIAssistantDrawer />
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <RouterProvider>
        <MainRouter />
      </RouterProvider>
    </StoreProvider>
  );
}
