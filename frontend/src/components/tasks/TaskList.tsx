import React, { useState } from 'react';
import { Task, TaskCategory, TaskPriority, useTask } from '@/contexts/TaskContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import { Plus, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

const TaskList: React.FC = () => {
  const { addTask, updateTask, filteredTasks, moveTask } = useTask();
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | undefined>(undefined);
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | undefined>(undefined);
  const [showCompleted, setShowCompleted] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  
  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsTaskFormOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };
  
  const handleSaveTask = (task: Omit<Task, 'id' | 'userId' | 'createdAt' | 'order'>) => {
    if (editingTask) {
      updateTask(editingTask.id, task);
    } else {
      addTask(task);
    }
    setIsTaskFormOpen(false);
  };
  
  const handleDragStart = (e: React.DragEvent, taskId: string, index: number) => {
    setDraggedTaskId(taskId);
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
    
    // Add dragging class with small delay for better UX
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.classList.add('dragging');
      }
    }, 0);
  };
  
  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDraggedIndex(null);
    
    // Remove dragging class from all elements
    document.querySelectorAll('.dragging').forEach(el => {
      el.classList.remove('dragging');
    });
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null) return;
    
    moveTask(draggedIndex, targetIndex);
    setDraggedTaskId(null);
    setDraggedIndex(null);
  };
  
  const clearFilters = () => {
    setCategoryFilter(undefined);
    setPriorityFilter(undefined);
    setShowCompleted(true);
  };
  
  // Helper functions to handle Select value changes
  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value === "all" ? undefined : value as TaskCategory);
  };
  
  const handlePriorityChange = (value: string) => {
    setPriorityFilter(value === "all" ? undefined : value as TaskPriority);
  };
  
  // Apply filters and search
  let tasks = filteredTasks(categoryFilter, priorityFilter, showCompleted);
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    tasks = tasks.filter(task => 
      task.title.toLowerCase().includes(query) || 
      task.description.toLowerCase().includes(query)
    );
  }
  
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row items-start sm:items-center justify-between">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Filter Tasks</h4>
                  <p className="text-sm text-muted-foreground">
                    Filter tasks by category, priority, and status.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={categoryFilter ? categoryFilter : "all"}
                    onValueChange={handleCategoryChange}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Work">Work</SelectItem>
                      <SelectItem value="Personal">Personal</SelectItem>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={priorityFilter ? priorityFilter : "all"}
                    onValueChange={handlePriorityChange}
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="All Priorities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priorities</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="showCompleted" 
                    checked={showCompleted}
                    onCheckedChange={(checked) => setShowCompleted(!!checked)}
                  />
                  <Label 
                    htmlFor="showCompleted" 
                    className="text-sm font-medium leading-none cursor-pointer"
                  >
                    Show completed tasks
                  </Label>
                </div>
                
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button onClick={handleAddTask} size="sm" className="gap-1">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
        </div>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center py-12 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No tasks found. Create a new task to get started!</p>
          <Button onClick={handleAddTask} variant="outline" className="mt-4">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Task
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              onEditTask={handleEditTask}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              index={index}
              isDragging={draggedTaskId === task.id}
            />
          ))}
        </div>
      )}
      
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => setIsTaskFormOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
        isEditing={!!editingTask}
      />
    </>
  );
};

export default TaskList;
