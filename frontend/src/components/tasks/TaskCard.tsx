
import React, { useRef } from 'react';
import { Task, useTask } from '@/contexts/TaskContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MoreVertical, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEditTask: (task: Task) => void;
  onDragStart: (e: React.DragEvent, taskId: string, index: number) => void;
  onDragEnd: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, targetIndex: number) => void;
  index: number;
  isDragging: boolean;
}

const getCategoryColor = (category: string): string => {
  switch (category) {
    case 'Work':
      return 'bg-category-work text-white';
    case 'Personal':
      return 'bg-category-personal text-white';
    case 'Urgent':
      return 'bg-category-urgent text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const getPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'Low':
      return 'bg-priority-low text-black';
    case 'Medium':
      return 'bg-priority-medium text-black';
    case 'High':
      return 'bg-priority-high text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEditTask,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  index,
  isDragging
}) => {
  const { toggleTaskCompletion, deleteTask } = useTask();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const dueDateObj = new Date(task.dueDate);
  const isOverdue = !task.completed && dueDateObj < new Date();
  
  return (
    <Card
      ref={cardRef}
      className={cn(
        "task-card relative",
        task.completed && "opacity-70",
        isDragging && "dragging",
        isOverdue && !task.completed && "border-destructive"
      )}
      draggable
      onDragStart={(e) => onDragStart(e, task.id, index)}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
    >
      <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between space-y-0">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTaskCompletion(task.id)}
            className="mt-0.5"
          />
          <h3 className={cn(
            "font-medium line-clamp-1",
            task.completed && "line-through text-muted-foreground"
          )}>
            {task.title}
          </h3>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEditTask(task)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit task
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => deleteTask(task.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="p-4 pt-2">
        <p className={cn(
          "text-sm text-muted-foreground mb-3 line-clamp-2",
          task.completed && "line-through"
        )}>
          {task.description}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={getCategoryColor(task.category)}>
            {task.category}
          </Badge>
          <Badge variant="outline" className={getPriorityColor(task.priority)}>
            {task.priority} Priority
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center">
          <Calendar className="mr-1 h-3 w-3" />
          <span className={cn(isOverdue && !task.completed && "text-destructive font-medium")}>
            {format(dueDateObj, 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          <span>{format(dueDateObj, 'h:mm a')}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
