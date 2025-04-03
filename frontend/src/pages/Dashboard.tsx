
import React from 'react';
import Layout from '@/components/layout/Layout';
import TaskList from '@/components/tasks/TaskList';
import { useAuth } from '@/contexts/AuthContext';
import { useTask } from '@/contexts/TaskContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, Clock, AlertTriangle, ListTodo } from 'lucide-react';
import { motion } from 'framer-motion';
import TasksChart from '@/components/dashboard/TasksChart';

const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { taskStats, loading } = useTask();
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }
  
  const stats = taskStats();
  const completionPercentage = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;
  
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">
            Manage your tasks efficiently
          </p>
        </motion.div>
        
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <motion.div variants={item}>
            <Card className="bg-card">
              <CardContent className="p-6 flex items-center">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <ListTodo className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
                  <h3 className="text-2xl font-bold">{loading ? '...' : stats.total}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="bg-card">
              <CardContent className="p-6 flex items-center">
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mr-4">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <h3 className="text-2xl font-bold">{loading ? '...' : stats.completed}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="bg-card">
              <CardContent className="p-6 flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <h3 className="text-2xl font-bold">{loading ? '...' : stats.pending}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={item}>
            <Card className="bg-card">
              <CardContent className="p-6 flex items-center">
                <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center mr-4">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overdue</p>
                  <h3 className="text-2xl font-bold">{loading ? '...' : stats.overdue}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <h3 className="text-lg font-medium mb-1">Task Completion</h3>
                  <p className="text-muted-foreground text-sm">
                    {completionPercentage}% of tasks completed
                  </p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {stats.completed} of {stats.total} tasks
                </p>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <TasksChart />
        </motion.div>
        
        <TaskList />
      </div>
    </Layout>
  );
};

export default Dashboard;
