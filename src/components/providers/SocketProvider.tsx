'use client';

import React from 'react';
import { useSocket } from '@/hooks/useSocket';

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  // Initialize socket connection when user is authenticated
  useSocket();

  return <>{children}</>;
};
