import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import { IUser } from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
}

export const generateToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: String(user._id),
    email: user.email,
    name: user.name,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyToken = (token: string): JWTPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
};

export const getTokenFromRequest = (req: NextRequest): string | null => {
  // Try to get token from Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Try to get token from cookies
  const token = req.cookies.get('token')?.value;
  if (token) {
    return token;
  }

  return null;
};

export const setTokenCookie = (token: string): string => {
  return `token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict; ${
    process.env.NODE_ENV === 'production' ? 'Secure;' : ''
  }`;
};

export const clearTokenCookie = (): string => {
  return 'token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict;';
};
