
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import { Button } from '@/components/ui/button';
import { MoonStar, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const Auth: React.FC = () => {
  const [showLogin, setShowLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 flex justify-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? (
            <Sun className="h-[1.2rem] w-[1.2rem]" />
          ) : (
            <MoonStar className="h-[1.2rem] w-[1.2rem]" />
          )}
        </Button>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Task Manager</h1>
            <p className="text-muted-foreground">
              Stay organized and manage your tasks efficiently
            </p>
          </div>
          
          {showLogin ? (
            <LoginForm onToggleForm={() => setShowLogin(false)} />
          ) : (
            <SignupForm onToggleForm={() => setShowLogin(true)} />
          )}
          
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>
              Demo credentials: <code>demo@example.com</code> / <code>password</code>
            </p>
          </div>
        </div>
      </main>
      
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>Task Manager &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Auth;
