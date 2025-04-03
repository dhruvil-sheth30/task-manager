import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from "sonner";
import axios from 'axios';

// API base URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

export type TaskCategory = 'Work' | 'Personal' | 'Urgent';
export type TaskPriority = 'Low' | 'Medium' | 'High';

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  dueDate: string; // ISO string
  createdAt: string; // ISO string
  order: number;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  addTask: (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'order'>) => void;
  updateTask: (id: string, task: Partial<Omit<Task, 'id' | 'userId'>>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  reorderTasks: (taskId: string, newOrder: number) => void;
  moveTask: (fromIndex: number, toIndex: number) => void;
  filteredTasks: (category?: TaskCategory, priority?: TaskPriority, showCompleted?: boolean) => Task[];
  taskStats: () => {
    total: number;
    completed: number;
    pending: number;
    overdue: number;
  };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const { user, isAuthenticated, token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create axios instance with auth header
  const api = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Add auth token to requests when available
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Load tasks when authenticated
  useEffect(() => {
    if (isAuthenticated && user && token) {
      fetchTasks();
    } else {
      setTasks([]);
      setLoading(false);
    }
  }, [isAuthenticated, user, token]);

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      
      // Transform data to match our Task interface
      const formattedTasks: Task[] = response.data.map((task: {
        _id: string;
        userId: string;
        title: string;
        description?: string;
        category: TaskCategory;
        priority: TaskPriority;
        completed: boolean;
        dueDate: string;
        createdAt: string;
        order?: number;
      }) => ({
        id: task._id,
        userId: task.userId,
        title: task.title,
        description: task.description || '',
        category: task.category,
        priority: task.priority,
        completed: task.completed,
        dueDate: task.dueDate,
        createdAt: task.createdAt,
        order: task.order || 0
      }));
      
      setTasks(formattedTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
      toast.error('Failed to load tasks');
      
      // If API fails, load from localStorage as fallback
      loadTasksFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  // Fallback: Load tasks from localStorage
  const loadTasksFromLocalStorage = () => {
    try {
      const storedTasks = localStorage.getItem(`tasks_${user?.id}`);
      if (storedTasks) {
        setTasks(JSON.parse(storedTasks));
      } else {
        // Add demo tasks for first-time users
        const demoTasks: Task[] = [
          {
            id: '1',
            userId: user?.id || '',
            title: 'Complete project proposal',
            description: 'Finish the proposal document for the client meeting',
            category: 'Work',
            priority: 'High',
            completed: false,
            dueDate: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
            createdAt: new Date().toISOString(),
            order: 0
          },
          {
            id: '2',
            userId: user?.id || '',
            title: 'Grocery shopping',
            description: 'Buy milk, eggs, bread, and vegetables',
            category: 'Personal',
            priority: 'Medium',
            completed: false,
            dueDate: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
            createdAt: new Date().toISOString(),
            order: 1
          },
          {
            id: '3',
            userId: user?.id || '',
            title: 'Pay utility bills',
            description: 'Pay electricity and water bills',
            category: 'Urgent',
            priority: 'High',
            completed: false,
            dueDate: new Date().toISOString(), // Today
            createdAt: new Date().toISOString(),
            order: 2
          }
        ];
        setTasks(demoTasks);
        localStorage.setItem(`tasks_${user?.id}`, JSON.stringify(demoTasks));
      }
    } catch (err) {
      setError('Failed to load tasks');
      console.error(err);
    }
  };

  // Save tasks to localStorage as backup
  useEffect(() => {
    if (user && tasks.length > 0) {
      localStorage.setItem(`tasks_${user.id}`, JSON.stringify(tasks));
    }
  }, [tasks, user]);

  const addTask = async (taskData: Omit<Task, 'id' | 'userId' | 'createdAt' | 'order'>) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await api.post('/tasks', taskData);
      
      const newTask: Task = {
        id: response.data._id,
        userId: response.data.userId,
        title: response.data.title,
        description: response.data.description,
        category: response.data.category as TaskCategory,
        priority: response.data.priority as TaskPriority,
        completed: response.data.completed,
        dueDate: response.data.dueDate,
        createdAt: response.data.createdAt,
        order: response.data.order
      };
      
      setTasks(prevTasks => [...prevTasks, newTask]);
      toast.success('Task added');
    } catch (err) {
      console.error('Error adding task:', err);
      toast.error('Failed to add task');
      
      // Fallback: Add task locally if API fails
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        userId: user.id,
        createdAt: new Date().toISOString(),
        order: tasks.length // Add to the end
      };
      
      setTasks(prevTasks => [...prevTasks, newTask]);
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, updates: Partial<Omit<Task, 'id' | 'userId'>>) => {
    try {
      setLoading(true);
      await api.put(`/tasks/${id}`, updates);
      
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        )
      );
      toast.success('Task updated');
    } catch (err) {
      console.error('Error updating task:', err);
      toast.error('Failed to update task');
      
      // Fallback: Update task locally if API fails
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, ...updates } : task
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setLoading(true);
      await api.delete(`/tasks/${id}`);
      
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      toast.success('Task deleted');
    } catch (err) {
      console.error('Error deleting task:', err);
      toast.error('Failed to delete task');
      
      // Fallback: Delete task locally if API fails
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = (id: string) => {
    const task = tasks.find(task => task.id === id);
    if (task) {
      updateTask(id, { completed: !task.completed });
    }
  };

  const reorderTasks = async (taskId: string, newOrder: number) => {
    const tasksCopy = [...tasks];
    const taskIndex = tasksCopy.findIndex(t => t.id === taskId);
    
    if (taskIndex === -1) return;
    
    const task = tasksCopy[taskIndex];
    
    // Remove the task from the array
    tasksCopy.splice(taskIndex, 1);
    
    // Insert it at the new position
    tasksCopy.splice(newOrder, 0, task);
    
    // Update order properties
    const updatedTasks = tasksCopy.map((t, index) => ({
      ...t,
      order: index
    }));
    
    setTasks(updatedTasks);
    
    try {
      // Send the updated order to the API
      await api.post('/tasks/reorder', {
        tasks: updatedTasks.map(t => ({ id: t.id, order: t.order }))
      });
    } catch (err) {
      console.error('Error reordering tasks:', err);
      toast.error('Failed to save task order');
    }
  };

  const moveTask = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    
    const tasksCopy = [...tasks];
    const [movedTask] = tasksCopy.splice(fromIndex, 1);
    tasksCopy.splice(toIndex, 0, movedTask);
    
    // Update order properties
    const updatedTasks = tasksCopy.map((task, index) => ({
      ...task,
      order: index
    }));
    
    setTasks(updatedTasks);
    
    try {
      // Send the updated order to the API
      api.post('/tasks/reorder', {
        tasks: updatedTasks.map(t => ({ id: t.id, order: t.order }))
      });
    } catch (err) {
      console.error('Error reordering tasks:', err);
      toast.error('Failed to save task order');
    }
  };

  const filteredTasks = (
    category?: TaskCategory,
    priority?: TaskPriority,
    showCompleted: boolean = true
  ): Task[] => {
    return tasks
      .filter(task => !category || task.category === category)
      .filter(task => !priority || task.priority === priority)
      .filter(task => showCompleted || !task.completed)
      .sort((a, b) => a.order - b.order);
  };

  // Calculate task statistics
  const taskStats = () => {
    const now = new Date();
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;
    const overdue = tasks.filter(task => 
      !task.completed && new Date(task.dueDate) < now
    ).length;
    
    return { total, completed, pending, overdue };
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        reorderTasks,
        moveTask,
        filteredTasks,
        taskStats
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};
