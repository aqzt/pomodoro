import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

const categoryColors: Record<string, string> = {
  study: 'bg-blue-500',
  work: 'bg-orange-500',
  read: 'bg-green-500',
  other: 'bg-purple-500',
};

const categoryLabels: Record<string, string> = {
  study: '学习',
  work: '工作',
  read: '阅读',
  other: '其他',
};

type TaskItemProps = {
  task: {
    id: string;
    name: string;
    category: string;
    completed: boolean;
  };
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
};

export function TaskItem({ task, onEdit, onDelete, onToggleComplete }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    setIsDeleting(true);
    setTimeout(onDelete, 300);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: isDeleting ? 100 : -100 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow',
        task.completed && 'opacity-70'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleComplete}
            className={cn(
              'w-5 h-5 rounded border flex items-center justify-center',
              task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'
            )}
          >
            {task.completed && (
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
          
          <div>
            <p className={cn('font-medium', task.completed && 'line-through text-gray-500')}>
              {task.name}
            </p>
            <span className={cn(
              'text-xs px-2 py-1 rounded-full text-white',
              categoryColors[task.category] || 'bg-gray-500'
            )}>
              {categoryLabels[task.category] || '其他'}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="text-gray-500 hover:text-orange-500 transition"
          >
            编辑
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-500 hover:text-red-500 transition"
          >
            删除
          </button>
        </div>
      </div>
    </motion.div>
  );
}
