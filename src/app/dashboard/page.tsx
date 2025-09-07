'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchTasks, updateTask, deleteTask, createTask, clearTasks } from '@/store/slices/tasksSlice';
import { addNotification, removeNotification } from '@/store/slices/notificationSlice';
import { useSocket } from '@/hooks/useSocket';
import { Navbar } from '@/components/Layout/Navbar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { TaskItem } from '@/components/TaskItem';
import { TaskForm } from '@/components/TaskForm';
import { ToastContainer } from '@/components/ui/Toast';
import { TaskAnalytics } from '@/components/Charts/TaskAnalytics';
import { Button } from '@/components/ui/Button';
import { Task } from '@/types';

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { tasks, loading } = useAppSelector((state) => state.tasks);
  const { notifications } = useAppSelector((state) => state.notifications);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isCreating, setIsCreating] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const { emitTaskCreated, emitTaskUpdated, emitTaskDeleted } = useSocket();

  // Fetch tasks on component mount
  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  // Clear tasks when user logs out
  useEffect(() => {
    if (!isAuthenticated) {
      // Clear tasks when user is not authenticated
      dispatch(clearTasks());
    }
  }, [isAuthenticated, dispatch]);

  // Filter tasks based on active filter
  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'all') return true;
    return task.status === activeFilter;
  });

  const handleAddTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    const task = tasks.find(t => t._id === taskId);
    if (task && window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();
        dispatch(addNotification({
          type: 'success',
          title: 'Task Deleted',
          message: `Task "${task.title}" has been deleted successfully`,
        }));
      } catch {
        dispatch(addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete task',
        }));
      }
    }
  };

  const handleStatusChange = async (taskId: string, status: Task['status']) => {
    try {
      await dispatch(updateTask({ id: taskId, status })).unwrap();
      dispatch(addNotification({
        type: 'info',
        title: 'Task Updated',
        message: `Task status changed to ${status.replace('-', ' ')}`,
      }));
    } catch {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update task status',
      }));
    }
  };

  const handleTaskSubmit = async (taskData: {
    title: string;
    description?: string;
    dueDate?: string;
  }) => {
    setIsCreating(true);
    try {
      if (editingTask) {
        // Update existing task
        const updatedTask = await dispatch(updateTask({
          id: editingTask._id,
          ...taskData,
        })).unwrap();
        dispatch(addNotification({
          type: 'success',
          title: 'Task Updated',
          message: `Task "${updatedTask.title}" has been updated successfully`,
        }));
      } else {
        // Create new task
        const newTask = await dispatch(createTask(taskData)).unwrap();
        dispatch(addNotification({
          type: 'success',
          title: 'Task Created',
          message: `Task "${newTask.title}" has been created successfully`,
        }));
      }
      setIsTaskFormOpen(false);
      setEditingTask(null);
    } catch {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: editingTask ? 'Failed to update task' : 'Failed to create task',
      }));
    } finally {
      setIsCreating(false);
    }
  };

  const handleRemoveNotification = (id: string) => {
    dispatch(removeNotification(id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <div className="flex h-[calc(100vh-4rem)]">
        <div className="hidden lg:block">
          <Sidebar
            onAddTask={handleAddTask}
            onFilterChange={setActiveFilter}
            activeFilter={activeFilter}
          />
        </div>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {/* Header */}
            <motion.div
              className="mb-6 sm:mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
                    Welcome back, {user?.name}!
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Manage your tasks and stay productive
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    variant="primary"
                    onClick={handleAddTask}
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    + Add Task
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    className="flex items-center gap-2 w-full sm:w-auto"
                  >
                    {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              {[
                { label: 'Total Tasks', value: tasks.length, color: 'blue', icon: '📋' },
                { label: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: 'gray', icon: '⏳' },
                { label: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: 'blue', icon: '🔄' },
                { label: 'Completed', value: tasks.filter(t => t.status === 'done').length, color: 'green', icon: '✅' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  className="bg-white/70 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 shadow-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className={`text-2xl font-bold text-${stat.color}-600 mb-1`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Analytics Section */}
            {showAnalytics && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <TaskAnalytics tasks={tasks} />
              </motion.div>
            )}

            {/* Tasks Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredTasks.length === 0 ? (
              <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="glass rounded-2xl p-12 max-w-md mx-auto">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {activeFilter === 'all' ? 'No tasks yet' : `No ${activeFilter.replace('-', ' ')} tasks`}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {activeFilter === 'all' 
                      ? 'Create your first task to get started!'
                      : `You don't have any ${activeFilter.replace('-', ' ')} tasks yet.`
                    }
                  </p>
                  <button
                    onClick={handleAddTask}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Create Task
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <motion.div
                  className="flex items-center justify-between mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                >
                  <h2 className="text-xl font-semibold text-gray-900">
                    {activeFilter === 'all' ? 'All Tasks' : `${activeFilter.replace('-', ' ')} Tasks`}
                  </h2>
                  <span className="text-sm text-gray-500">
                    {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </motion.div>
                
                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  {filteredTasks.map((task, index) => (
                    <motion.div
                      key={task._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                    >
                      <TaskItem
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                        onStatusChange={handleStatusChange}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={() => {
          setIsTaskFormOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        loading={isCreating}
      />

      {/* Toast Notifications */}
      <ToastContainer
        toasts={notifications}
        onRemove={handleRemoveNotification}
      />
    </div>
  );
}
