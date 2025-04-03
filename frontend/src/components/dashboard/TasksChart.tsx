
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTask } from '@/contexts/TaskContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const TasksChart: React.FC = () => {
  const { tasks } = useTask();
  
  // Prepare data for the chart
  const getCategoryCounts = () => {
    const categoryCounts = {
      Work: { name: 'Work', completed: 0, pending: 0 },
      Personal: { name: 'Personal', completed: 0, pending: 0 },
      Urgent: { name: 'Urgent', completed: 0, pending: 0 }
    };
    
    tasks.forEach(task => {
      if (task.completed) {
        categoryCounts[task.category].completed += 1;
      } else {
        categoryCounts[task.category].pending += 1;
      }
    });
    
    return Object.values(categoryCounts);
  };
  
  const chartData = getCategoryCounts();
  
  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border p-2 shadow-md rounded-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-green-500">
            Completed: {payload[0].value}
          </p>
          <p className="text-sm text-blue-500">
            Pending: {payload[1].value}
          </p>
        </div>
      );
    }
    return null;
  };
  
  const colors = {
    completed: '#22c55e', // green-500
    pending: '#3b82f6'    // blue-500
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              barGap={4}
            >
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                allowDecimals={false} 
                tick={{ fontSize: 12 }} 
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="completed" stackId="a" fill={colors.completed} radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" stackId="a" fill={colors.pending} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TasksChart;
