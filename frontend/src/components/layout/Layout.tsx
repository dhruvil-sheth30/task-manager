
import React from 'react';
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {isAuthenticated && <Header />}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
