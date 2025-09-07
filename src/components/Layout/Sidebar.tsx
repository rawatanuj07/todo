import React from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  MessageSquare, 
  TrendingUp, 
  ShoppingBag, 
  Store,
  Plus,
  Filter,
  Circle,
  Play,
  CheckCircle
} from 'lucide-react';
import { useAppSelector } from '@/hooks/redux';
import { Button } from '@/components/ui/Button';

interface SidebarProps {
  onAddTask: () => void;
  onFilterChange: (filter: string) => void;
  activeFilter: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddTask, onFilterChange, activeFilter }) => {
  const { tasks } = useAppSelector((state) => state.tasks);

  const menuItems = [
    { id: 'all', label: 'All Tasks', icon: LayoutDashboard, count: tasks.length },
    { id: 'todo', label: 'To Do', icon: Circle, count: tasks.filter(t => t.status === 'todo').length },
    { id: 'in-progress', label: 'In Progress', icon: Play, count: tasks.filter(t => t.status === 'in-progress').length },
    { id: 'done', label: 'Done', icon: CheckCircle, count: tasks.filter(t => t.status === 'done').length },
  ];

  const placeholderItems = [
    { id: 'chatbot', label: 'Chatbot', icon: MessageSquare, comingSoon: true },
    { id: 'profit', label: 'Profit Tracker', icon: TrendingUp, comingSoon: true },
    { id: 'amazon', label: 'Amazon Tools', icon: ShoppingBag, comingSoon: true },
    { id: 'shopify', label: 'Shopify Tools', icon: Store, comingSoon: true },
  ];

  return (
    <motion.aside
      className="w-64 bg-white/60 backdrop-blur-md border-r border-white/20 h-full p-4 overflow-y-auto"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="p-6 space-y-6">
        {/* Add Task Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onAddTask}
            variant="primary"
            className="w-full p-2 m-2 flex items-center gap-2"
          >
            <Plus size={20} />
            Add New Task
          </Button>
        </motion.div>

        {/* Task Filters */}
        <div className="space-y-6">
          <div className="flex items-center p-4 m-2 gap-2 text-sm font-medium text-gray-700 mb-3">
            <Filter size={16} />
            Task Filters
          </div>
          
          {menuItems.map((item: {
            id: string;
            label: string;
            icon: React.ElementType;
            count: number;
          }, index: number) => (
            <motion.button
              key={item.id}
              onClick={() => onFilterChange(item.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                activeFilter === item.id
                  ? 'bg-blue-100 text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span className="font-medium">{item.label}</span>
              </div>
              <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                {item.count}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200/50 pt-6">
          <div className="text-sm font-medium text-gray-500 mb-3">Coming Soon</div>
          
          {placeholderItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-xl text-gray-400 cursor-not-allowed opacity-60"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.6, x: 0 }}
              transition={{ delay: (index + 4) * 0.1 }}
            >
              <item.icon size={18} />
              <span className="font-medium">{item.label}</span>
              <span className="text-xs bg-gray-200 text-gray-400 px-2 py-1 rounded-full ml-auto">
                Soon
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.aside>
  );
};

export { Sidebar };
