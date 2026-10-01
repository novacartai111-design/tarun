import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  currentPath: string;
  navigate: (path: string) => void;
  params: Record<string, string>;
  categoryParam?: string;
  productIdParam?: string;
  orderIdParam?: string;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getHashPath = () => {
    const hash = window.location.hash.slice(1);
    return hash.startsWith('/') ? hash : '/' + hash;
  };

  const [currentPath, setCurrentPath] = useState<string>(() => {
    const p = getHashPath();
    return p === '/' || !p ? '/' : p;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const p = getHashPath();
      setCurrentPath(p === '/' || !p ? '/' : p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    window.location.hash = cleanPath;
    setCurrentPath(cleanPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parse route parameters
  let categoryParam: string | undefined;
  let productIdParam: string | undefined;
  let orderIdParam: string | undefined;
  const params: Record<string, string> = {};

  if (currentPath.startsWith('/category/')) {
    categoryParam = currentPath.replace('/category/', '').split('?')[0];
    params.category = categoryParam;
  } else if (currentPath.startsWith('/product/')) {
    productIdParam = currentPath.replace('/product/', '').split('?')[0];
    params.productId = productIdParam;
  } else if (currentPath.startsWith('/order-confirmation/')) {
    orderIdParam = currentPath.replace('/order-confirmation/', '').split('?')[0];
    params.orderId = orderIdParam;
  } else if (currentPath.startsWith('/track/')) {
    orderIdParam = currentPath.replace('/track/', '').split('?')[0];
    params.orderId = orderIdParam;
  }

  return (
    <RouterContext.Provider
      value={{
        currentPath,
        navigate,
        params,
        categoryParam,
        productIdParam,
        orderIdParam,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
