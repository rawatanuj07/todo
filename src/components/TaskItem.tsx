import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Edit, Trash2, CheckCircle, Circle, Play } from 'lucide-react';
import { Task } from '@/types';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return <Circle className="h-4 w-4" />;
      case 'in-progress':
        return <Play className="h-4 w-4" />;
      case 'done':
        return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'text-gray-500 bg-gray-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'done':
        return 'text-green-600 bg-green-100';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <motion.div
      className="group relative rounded-xl bg-white/90 backdrop-blur-sm border border-gray-200/50 p-5 shadow-sm hover:shadow-md transition-all duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, y: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <motion.div
          className={cn(
            'flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium',
            getStatusColor(task.status)
          )}
          whileHover={{ scale: 1.05 }}
        >
          {getStatusIcon(task.status)}
          <span className="capitalize">{task.status.replace('-', ' ')}</span>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <motion.button
            onClick={() => onEdit(task)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Edit size={16} />
          </motion.button>
          <motion.button
            onClick={() => onDelete(task._id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 size={16} />
          </motion.button>
        </div>
      </div>

      {/* Task Content */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {task.title}
        </h3>
        
        {task.description && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {task.description}
          </p>
        )}

        {/* Due Date */}
        {task.dueDate && (
          <div className={cn(
            'flex items-center gap-2 text-sm',
            isOverdue ? 'text-red-600' : 'text-gray-500'
          )}>
            <Calendar size={14} />
            <span>Due {formatDate(task.dueDate)}</span>
            {isOverdue && <span className="text-xs font-medium">(Overdue)</span>}
          </div>
        )}

        {/* Created Date */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock size={12} />
          <span>Created {formatDate(task.createdAt)}</span>
        </div>
      </div>

      {/* Status Change Buttons */}
      <div className="flex gap-1 mt-4 pt-3 border-t border-gray-100">
        {(['todo', 'in-progress', 'done'] as const).map((status) => (
          <motion.button
            key={status}
            onClick={() => onStatusChange(task._id, status)}
            className={cn(
              'flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition-colors',
              task.status === status
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {status.replace('-', ' ')}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export { TaskItem };
