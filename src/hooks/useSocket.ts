import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch, useAppSelector } from './redux';
import { addNotification } from '@/store/slices/notificationSlice';
import { updateTaskFromSocket, addTaskFromSocket, removeTaskFromSocket } from '@/store/slices/tasksSlice';
import { Task } from '@/types';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useAppDispatch();
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && token && typeof window !== 'undefined') {
      // Initialize socket connection
      socketRef.current = io(process.env.NODE_ENV === 'production' 
        ? process.env.NEXTAUTH_URL || 'https://your-domain.com'
        : 'http://localhost:3000', {
        path: '/api/socket',
        auth: {
          token,
        },
      });

      const socket = socketRef.current;

      // Connection events
      socket.on('connect', () => {
        console.log('Connected to server');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      // Task events
      socket.on('task_created', (data) => {
        dispatch(addNotification({
          type: data.type,
          title: data.title,
          message: data.message,
        }));
        dispatch(addTaskFromSocket(data.task));
      });

      socket.on('task_updated', (data) => {
        dispatch(addNotification({
          type: data.type,
          title: data.title,
          message: data.message,
        }));
        dispatch(updateTaskFromSocket(data.task));
      });

      socket.on('task_deleted', (data) => {
        dispatch(addNotification({
          type: data.type,
          title: data.title,
          message: data.message,
        }));
        dispatch(removeTaskFromSocket(data.taskId));
      });

      // Error handling
      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        dispatch(addNotification({
          type: 'error',
          title: 'Connection Error',
          message: 'Failed to connect to real-time updates',
        }));
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, token, dispatch]);

  const emitTaskCreated = (task: Task) => {
    if (socketRef.current) {
      socketRef.current.emit('task_created', task);
    }
  };

  const emitTaskUpdated = (task: Task) => {
    if (socketRef.current) {
      socketRef.current.emit('task_updated', task);
    }
  };

  const emitTaskDeleted = (taskId: string, taskTitle: string) => {
    if (socketRef.current) {
      socketRef.current.emit('task_deleted', taskId, taskTitle);
    }
  };

  return {
    socket: socketRef.current,
    emitTaskCreated,
    emitTaskUpdated,
    emitTaskDeleted,
  };
};
