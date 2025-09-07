'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppSelector } from '@/hooks/redux';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="space-y-6">
            <motion.h1
              className="text-6xl md:text-8xl font-bold gradient-text"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              TaskForge
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Beautiful task management with real-time updates, glassmorphic design, and seamless collaboration.
            </motion.p>
          </div>

          {/* Features */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {[
              {
                title: 'Real-time Updates',
                description: 'Stay synchronized with live notifications and instant updates across all devices.',
                icon: '⚡',
              },
              {
                title: 'Beautiful Design',
                description: 'Glassmorphic UI with smooth animations and modern aesthetics.',
                icon: '✨',
              },
              {
                title: 'Secure & Fast',
                description: 'JWT authentication, MongoDB, and optimized performance.',
                icon: '🔒',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="glass rounded-2xl p-6 text-white"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/80">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Button
              variant="primary"
              size="lg"
              onClick={() => router.push('/register')}
              className="px-8 py-4 text-lg"
            >
              Get Started
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.push('/login')}
              className="px-8 py-4 text-lg"
            >
              Sign In
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}