import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as ServerIO, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  userId: string;
  user: { userId: string; email: string; name: string };
}

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export const SocketHandler = (req: NextApiResponseServerIO, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new ServerIO(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NODE_ENV === 'production' 
          ? 'https://todo-six-zeta-11.vercel.app'
          : 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Authentication middleware for Socket.IO
    io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; name: string };
        (socket as AuthenticatedSocket).userId = decoded.userId;
        (socket as AuthenticatedSocket).user = decoded;
        next();
      } catch {
        next(new Error('Authentication error'));
      }
    });

    io.on('connection', (socket) => {
      const authSocket = socket as AuthenticatedSocket;
      console.log(`User ${authSocket.userId} connected`);

      // Join user to their personal room
      socket.join(`user_${authSocket.userId}`);

      // Handle task events
      socket.on('task_created', (task) => {
        // Broadcast to all users (for now, can be made more specific)
        io.emit('task_created', {
          type: 'success',
          title: 'New Task Created',
          message: `Task "${task.title}" has been created`,
          task,
        });
      });

      socket.on('task_updated', (task) => {
        io.emit('task_updated', {
          type: 'info',
          title: 'Task Updated',
          message: `Task "${task.title}" has been updated`,
          task,
        });
      });

      socket.on('task_deleted', (taskId, taskTitle) => {
        io.emit('task_deleted', {
          type: 'warning',
          title: 'Task Deleted',
          message: `Task "${taskTitle}" has been deleted`,
          taskId,
        });
      });

      socket.on('disconnect', () => {
        console.log(`User ${authSocket.userId} disconnected`);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

// Client-side socket connection
export const getSocket = () => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { io } = require('socket.io-client');
    return io(process.env.NODE_ENV === 'production' 
      ? process.env.NEXTAUTH_URL 
      : 'http://localhost:3000', {
      path: '/api/socket',
      auth: {
        token: localStorage.getItem('token'),
      },
    });
  }
  return null;
};
