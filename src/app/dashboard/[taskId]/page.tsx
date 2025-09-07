'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Edit, Trash2, CheckCircle, Circle, Play } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchTaskById, updateTask, deleteTask } from '@/store/slices/tasksSlice';
import { addNotification } from '@/store/slices/notificationSlice';
import { Navbar } from '@/components/Layout/Navbar';
import { Button } from '@/components/ui/Button';
import { TaskForm } from '@/components/TaskForm';
import { cn } from '@/lib/utils';

export default function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedTask, loading } = useAppSelector((state) => state.tasks);

  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const taskId = params?.taskId as string;

  useEffect(() => {
    if (taskId) {
      dispatch(fetchTaskById(taskId));
    }
  }, [dispatch, taskId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Circle className="h-5 w-5" />;
      case 'in-progress':
        return <Play className="h-5 w-5" />;
      case 'done':
        return <CheckCircle className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleStatusChange = async (status: 'todo' | 'in-progress' | 'done') => {
    try {
      await dispatch(updateTask({ id: taskId, status })).unwrap();
      dispatch(addNotification({
        type: 'success',
        title: 'Status Updated',
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

  const handleDelete = async () => {
    if (selectedTask && window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await dispatch(deleteTask(taskId)).unwrap();
        dispatch(addNotification({
          type: 'success',
          title: 'Task Deleted',
          message: 'Task has been deleted successfully',
        }));
        router.push('/dashboard');
      } catch {
        dispatch(addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete task',
        }));
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleTaskUpdate = async (taskData: {
    title: string;
    description?: string;
    dueDate?: string;
  }) => {
    try {
      await dispatch(updateTask({
        id: taskId,
        ...taskData,
      })).unwrap();
      dispatch(addNotification({
        type: 'success',
        title: 'Task Updated',
        message: 'Task has been updated successfully',
      }));
      setIsEditFormOpen(false);
    } catch {
      dispatch(addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update task',
      }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!selectedTask) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Navbar />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h1>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isOverdue = selectedTask.dueDate && new Date(selectedTask.dueDate) < new Date() && selectedTask.status !== 'done';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6">
        {/* Back Button */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Task Details Card */}
        <motion.div
          className="glass rounded-3xl p-8 shadow-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {selectedTask.title}
              </h1>
              
              {/* Status Badge */}
              <div className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
                getStatusColor(selectedTask.status)
              )}>
                {getStatusIcon(selectedTask.status)}
                <span className="capitalize">{selectedTask.status.replace('-', ' ')}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                onClick={() => setIsEditFormOpen(true)}
                className="flex items-center gap-2"
              >
                <Edit size={16} />
                Edit
              </Button>
              <Button
                variant="danger"
                onClick={handleDelete}
                loading={isDeleting}
                className="flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </div>
          </div>

          {/* Description */}
          {selectedTask.description && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <div className="bg-gray-50 rounded-xl p-4 text-gray-700">
                {selectedTask.description}
              </div>
            </div>
          )}

          {/* Task Info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Created Date */}
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="font-medium text-gray-900">
                  {formatDate(selectedTask.createdAt)} at {formatTime(selectedTask.createdAt)}
                </p>
              </div>
            </div>

            {/* Due Date */}
            {selectedTask.dueDate && (
              <div className="flex items-center gap-3">
                <div className={cn(
                  'p-3 rounded-xl',
                  isOverdue ? 'bg-red-100' : 'bg-green-100'
                )}>
                  <Calendar className={cn(
                    'h-5 w-5',
                    isOverdue ? 'text-red-600' : 'text-green-600'
                  )} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className={cn(
                    'font-medium',
                    isOverdue ? 'text-red-600' : 'text-gray-900'
                  )}>
                    {formatDate(selectedTask.dueDate)}
                    {isOverdue && <span className="text-xs ml-2">(Overdue)</span>}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Status Change Buttons */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Status</h3>
            <div className="flex gap-3">
              {(['todo', 'in-progress', 'done'] as const).map((status) => (
                <Button
                  key={status}
                  variant={selectedTask.status === status ? 'primary' : 'ghost'}
                  onClick={() => handleStatusChange(status)}
                  className="flex items-center gap-2"
                >
                  {getStatusIcon(status)}
                  {status.replace('-', ' ')}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Edit Form Modal */}
      <TaskForm
        isOpen={isEditFormOpen}
        onClose={() => setIsEditFormOpen(false)}
        onSubmit={handleTaskUpdate}
        task={selectedTask}
        loading={false}
      />
    </div>
  );
}
