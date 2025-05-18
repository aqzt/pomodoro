import { useState } from 'react';
import { cn } from '@/lib/utils';

const categories = [
  { value: 'study', label: '学习', color: 'bg-blue-500' },
  { value: 'work', label: '工作', color: 'bg-orange-500' },
  { value: 'read', label: '阅读', color: 'bg-green-500' },
  { value: 'other', label: '其他', color: 'bg-purple-500' },
];

type Task = {
  id: string;
  name: string;
  category: string;
  completed: boolean;
};

type TaskFormProps = {
  task?: Task;
  onSave: (task: Omit<Task, 'id' | 'completed'>) => void;
  onCancel: () => void;
};

export function TaskForm({ task, onSave, onCancel }: TaskFormProps) {
  const [name, setName] = useState(task?.name || '');
  const [category, setCategory] = useState(task?.category || 'study');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, category });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          任务名称
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="输入任务名称"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          分类
        </label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setCategory(cat.value)}
              className={cn(
                'p-2 rounded text-white',
                cat.color,
                category === cat.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="flex-1 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          保存
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
        >
          取消
        </button>
      </div>
    </form>
  );
}
