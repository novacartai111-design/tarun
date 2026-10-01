import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  OrderStatus,
  PaymentMethod,
  ShippingAddress,
  PromoCoupon,
  User,
  NotificationItem,
} from '../types';
import { initialProducts } from '../data/initialCatalog';
import { initialCoupons } from '../data/initialOffers';

interface StoreContextType {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  savedAddresses: ShippingAddress[];
  orders: Order[];
  coupons: PromoCoupon[];
  activeCoupon: PromoCoupon | null;
  notifications: NotificationItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Cart calculations
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  finalTotal: number;

  // Actions
  addToCart: (product: Product, quantity?: number, selectedColor?: string, selectedSize?: string) => { success: boolean; message: string };
  updateCartQuantity: (productId: string, selectedColor: string, selectedSize: string, delta: number) => void;
  removeFromCart: (productId: string, selectedColor: string, selectedSize: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  createOrder: (address: ShippingAddress, paymentMethod: PaymentMethod) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  // Admin actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addCoupon: (coupon: PromoCoupon) => void;
  toggleCoupon: (code: string) => void;

  // Auth & Addresses
  login: (email: string, role?: 'customer' | 'admin') => void;
  register: (name: string, email: string, phone: string) => void;
  logout: () => void;
  addAddress: (address: ShippingAddress) => void;
  updateAddress: (index: number, address: ShippingAddress) => void;
  deleteAddress: (index: number) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'novacart_products_v1',
  CART: 'novacart_cart_v1',
  WISHLIST: 'novacart_wishlist_v1',
  USER: 'novacart_user_v1',
  ADDRESSES: 'novacart_addresses_v1',
  ORDERS: 'novacart_orders_v1',
  COUPONS: 'novacart_coupons_v1',
  NOTIFICATIONS: 'novacart_notifications_v1',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from localStorage or use initialCatalog
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : initialProducts;
    } catch {
      return initialProducts;
    }
  });

  // Load Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Load Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : ['prod-drs-1', 'prod-bag-1'];
    } catch {
      return ['prod-drs-1', 'prod-bag-1'];
    }
  });

  // Load User (Default demo user for seamless Indian shopping experience)
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER);
      if (saved) return JSON.parse(saved);
      return {
        id: 'usr-demo-1',
        name: 'Priya Sharma',
        email: 'priya.sharma@example.in',
        phone: '+91 98765 43210',
        role: 'customer',
      };
    } catch {
      return null;
    }
  });

  // Saved Addresses
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ADDRESSES);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'addr-1',
          fullName: 'Priya Sharma',
          phone: '9876543210',
          email: 'priya.sharma@example.in',
          houseNo: 'Flat 402, Sunshine Residency',
          street: '100 Feet Road, Indiranagar',
          landmark: 'Near Metro Station Pillar 12',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
          isDefault: true,
        },
      ];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
      // Sample realistic initial order
      return [
        {
          id: 'NC-2026-4819',
          userId: 'usr-demo-1',
          customerName: 'Priya Sharma',
          customerEmail: 'priya.sharma@example.in',
          customerPhone: '9876543210',
          items: [
            {
              productId: 'prod-drs-1',
              name: 'Floral Chiffon Tiered A-Line Midi Dress',
              price: 1299,
              quantity: 1,
              selectedColor: 'Sky Blue',
              selectedSize: 'M',
              image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=400&q=80',
            },
          ],
          subtotal: 1299,
          shipping: 0,
          discount: 130,
          total: 1169,
          couponCode: 'NOVA10',
          paymentMethod: 'UPI',
          paymentStatus: 'Paid',
          orderStatus: 'Shipped',
          shippingAddress: {
            fullName: 'Priya Sharma',
            phone: '9876543210',
            email: 'priya.sharma@example.in',
            houseNo: 'Flat 402, Sunshine Residency',
            street: '100 Feet Road, Indiranagar',
            landmark: 'Near Metro Station Pillar 12',
            city: 'Bengaluru',
            state: 'Karnataka',
            pincode: '560038',
          },
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          estimatedDeliveryDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          trackingNumber: 'DEL-92817462',
          courierPartner: 'Delhivery Express',
          trackingUpdates: [
            {
              status: 'Order Placed',
              timestamp: '2 days ago, 10:30 AM',
              description: 'Order placed successfully and confirmed.',
            },
            {
              status: 'Packed',
              timestamp: 'Yesterday, 02:15 PM',
              description: 'Packed at NovaCart Fulfillment Center, Bhiwandi.',
            },
            {
              status: 'Shipped',
              timestamp: 'Today, 06:40 AM',
              description: 'In transit with Delhivery Express. Destination: Bengaluru Hub.',
            },
          ],
        },
      ];
    } catch {
      return [];
    }
  });

  // Coupons
  const [coupons, setCoupons] = useState<PromoCoupon[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUPONS);
      return saved ? JSON.parse(saved) : initialCoupons;
    } catch {
      return initialCoupons;
    }
  });

  const [activeCoupon, setActiveCoupon] = useState<PromoCoupon | null>(null);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'notif-1',
          title: 'Order Shipped! 🚚',
          message: 'Your order NC-2026-4819 has been dispatched via Delhivery Express.',
          timestamp: '2 hours ago',
          read: false,
          orderId: 'NC-2026-4819',
          type: 'order',
        },
        {
          id: 'notif-2',
          title: 'Welcome to NovaCart Ai ✨',
          message: 'Use code FIRSTFASHION to get ₹200 off your first purchase above ₹999.',
          timestamp: '1 day ago',
          read: true,
          type: 'promo',
        },
      ];
    } catch {
      return [];
    }
  });

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(savedAddresses));
    } catch (e) {
      console.error(e);
    }
  }, [savedAddresses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    } catch (e) {
      console.error(e);
    }
  }, [coupons]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.error(e);
    }
  }, [notifications]);

  // Cart calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 999 || subtotal === 0 ? 0 : 99; // Free above ₹999

  let discountAmount = 0;
  if (activeCoupon && activeCoupon.isActive && subtotal >= activeCoupon.minOrderValue) {
    if (activeCoupon.discountPercentage) {
      discountAmount = Math.round((subtotal * activeCoupon.discountPercentage) / 100);
    } else if (activeCoupon.discountAmount) {
      discountAmount = Math.min(activeCoupon.discountAmount, subtotal);
    }
  }

  const finalTotal = Math.max(0, subtotal + shippingFee - discountAmount);

  // Cart Actions
  const addToCart = (
    product: Product,
    quantity: number = 1,
    selectedColor?: string,
    selectedSize?: string
  ): { success: boolean; message: string } => {
    if (product.stock <= 0) {
      return { success: false, message: 'Sorry, this product is currently out of stock.' };
    }

    const color = selectedColor || product.colors[0] || 'Default';
    const size = selectedSize || product.sizes[0] || 'Free Size';

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedColor === color &&
          item.selectedSize === size
      );

      if (existingIndex > -1) {
        const currentQty = prevCart[existingIndex].quantity;
        if (currentQty + quantity > product.stock) {
          return prevCart;
        }
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: currentQty + quantity,
        };
        return updated;
      } else {
        return [...prevCart, { product, quantity, selectedColor: color, selectedSize: size }];
      }
    });

    return { success: true, message: `Added ${product.name} to cart!` };
  };

  const updateCartQuantity = (
    productId: string,
    selectedColor: string,
    selectedSize: string,
    delta: number
  ) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          ) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stock) return item; // Cannot exceed stock
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string, selectedColor: string, selectedSize: string) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(
            item.product.id === productId &&
            item.selectedColor === selectedColor &&
            item.selectedSize === selectedSize
          )
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setActiveCoupon(null);
  };

  // Wishlist Actions
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Promo Coupon Actions
  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.isActive);

    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }

    if (subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `This coupon requires a minimum cart value of ₹${found.minOrderValue}.`,
      };
    }

    setActiveCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  // Create Order (Decrements inventory stock accordingly)
  const createOrder = async (
    address: ShippingAddress,
    paymentMethod: PaymentMethod
  ): Promise<Order> => {
    const orderId = `NC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      selectedColor: item.selectedColor,
      selectedSize: item.selectedSize,
      image: item.product.images[0] || '',
    }));

    // Calculate delivery date (3-4 days ahead)
    const deliveryDate = new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(
      'en-IN',
      { day: 'numeric', month: 'short', year: 'numeric' }
    );

    const newOrder: Order = {
      id: orderId,
      userId: user?.id,
      customerName: address.fullName,
      customerEmail: address.email,
      customerPhone: address.phone,
      items: orderItems,
      subtotal,
      shipping: shippingFee,
      discount: discountAmount,
      total: finalTotal,
      couponCode: activeCoupon?.code,
      paymentMethod,
      paymentStatus: paymentMethod === 'CashOnDelivery' ? 'COD' : 'Paid',
      orderStatus: 'Order Placed',
      shippingAddress: address,
      createdAt: new Date().toISOString(),
      estimatedDeliveryDate: deliveryDate,
      trackingNumber: `NC${Math.floor(10000000 + Math.random() * 90000000)}`,
      courierPartner: 'Delhivery Surface / Express',
      trackingUpdates: [
        {
          status: 'Order Placed',
          timestamp: 'Just now',
          description: `Order received with ${paymentMethod === 'CashOnDelivery' ? 'Cash on Delivery' : 'Prepaid Online Payment'}.`,
        },
      ],
    };

    // Automatically decrement product stock in store
    setProducts((prev) =>
      prev.map((prod) => {
        const itemInCart = cart.find((c) => c.product.id === prod.id);
        if (itemInCart) {
          const remainingStock = Math.max(0, prod.stock - itemInCart.quantity);
          return { ...prod, stock: remainingStock };
        }
        return prod;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Order Confirmed! 🎉',
      message: `Your order #${orderId} of ₹${finalTotal} has been placed successfully.`,
      timestamp: 'Just now',
      read: false,
      orderId: orderId,
      type: 'order',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Clear cart
    clearCart();

    return newOrder;
  };

  // Update order status (Admin function)
  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const updatedHistory = [
            ...order.trackingUpdates,
            {
              status,
              timestamp: 'Just now',
              description: `Status updated to ${status}.`,
            },
          ];
          return {
            ...order,
            orderStatus: status,
            trackingUpdates: updatedHistory,
          };
        }
        return order;
      })
    );

    // Notification for customer
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Order Status: ${status} 📦`,
      message: `Order #${orderId} is now marked as "${status}".`,
      timestamp: 'Just now',
      read: false,
      orderId,
      type: 'order',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Admin Product Actions
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  const deleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // Coupon Actions
  const addCoupon = (coupon: PromoCoupon) => {
    setCoupons((prev) => [...prev, coupon]);
  };

  const toggleCoupon = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  // Authentication
  const login = (email: string, role: 'customer' | 'admin' = 'customer') => {
    const isSpecialAdmin = email.toLowerCase().includes('admin') || role === 'admin';
    setUser({
      id: `usr-${Date.now()}`,
      name: isSpecialAdmin ? 'NovaCart Admin' : email.split('@')[0] || 'Fashion Shopper',
      email,
      phone: '+91 98765 00000',
      role: isSpecialAdmin ? 'admin' : 'customer',
    });
    setIsLoginModalOpen(false);
  };

  const register = (name: string, email: string, phone: string) => {
    setUser({
      id: `usr-${Date.now()}`,
      name,
      email,
      phone,
      role: 'customer',
    });
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
  };

  // Address Actions
  const addAddress = (address: ShippingAddress) => {
    setSavedAddresses((prev) => [...prev, { ...address, id: `addr-${Date.now()}` }]);
  };

  const updateAddress = (index: number, address: ShippingAddress) => {
    setSavedAddresses((prev) => {
      const updated = [...prev];
      updated[index] = address;
      return updated;
    });
  };

  const deleteAddress = (index: number) => {
    setSavedAddresses((prev) => prev.filter((_, i) => i !== index));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        wishlist,
        user,
        savedAddresses,
        orders,
        coupons,
        activeCoupon,
        notifications,
        isCartOpen,
        setIsCartOpen,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        isLoginModalOpen,
        setIsLoginModalOpen,
        searchQuery,
        setSearchQuery,
        subtotal,
        shippingFee,
        discountAmount,
        finalTotal,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        createOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        addCoupon,
        toggleCoupon,
        login,
        register,
        logout,
        addAddress,
        updateAddress,
        deleteAddress,
        markNotificationRead,
        clearAllNotifications,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
