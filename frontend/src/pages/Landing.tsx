import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, CheckCircle } from 'lucide-react';

const Landing: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  
  const features = [
    'User authentication with secure login and signup',
    'Create, edit, and delete tasks',
    'Categorize tasks as Work, Personal, or Urgent',
    'Set priority levels and due dates',
    'Drag and drop to reorder tasks',
    'Filter tasks by category and priority',
    'Toggle between light and dark mode',
    'Mark tasks as completed',
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 border-b">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Task Manager</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              )}
            </Button>
            
            <Button asChild variant="outline">
              <a href="/auth">Login</a>
            </Button>
            
            <Button asChild>
              <a href="/auth">Get Started</a>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Manage Your Tasks with Ease
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              A simple, intuitive task management application to help you stay organized
              and boost your productivity.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <Button asChild size="lg">
                <a href="/auth">Get Started for Free</a>
              </Button>
            </div>
            
            <div className="mt-20 border p-8 rounded-lg shadow-lg max-w-5xl mx-auto bg-card">
              <h2 className="text-2xl font-bold mb-8">Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Task Manager. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
