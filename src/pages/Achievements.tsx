import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BadgeCheck, Clock, Zap } from 'lucide-react';

type Badge = {
  id: string;
  name: string;
  icon: string;
  earned: boolean;
};

type StatsData = {
  pomodoros: number;
  totalTime: number;
  weeklyData: Array<{
    date: string;
    count: number;
  }>;
};

// Mock data
const badges: Badge[] = [
  { id: '1', name: '初学乍练', icon: 'beginner', earned: true },
  { id: '2', name: '小有成就', icon: 'achiever', earned: true },
  { id: '3', name: '持之以恒', icon: 'consistent', earned: false },
  { id: '4', name: '番茄大师', icon: 'master', earned: false },
  { id: '5', name: '专注达人', icon: 'focused', earned: true },
  { id: '6', name: '学习狂人', icon: 'learner', earned: false },
];

const stats: StatsData = {
  pomodoros: 42,
  totalTime: 1050, // in minutes
  weeklyData: [
    { date: '周一', count: 5 },
    { date: '周二', count: 8 },
    { date: '周三', count: 6 },
    { date: '周四', count: 7 },
    { date: '周五', count: 4 },
    { date: '周六', count: 3 },
    { date: '周日', count: 2 },
  ],
};

function BadgeItem({ badge }: { badge: Badge }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'w-24 h-24 rounded-full flex flex-col items-center justify-center p-4 shadow transition-all',
        badge.earned ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'
      )}
    >
      <div className="text-3xl mb-1">
        {badge.earned ? (
          <BadgeCheck className="w-8 h-8" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gray-300" />
        )}
      </div>
      <span className="text-sm text-center">{badge.name}</span>
      {isHovered && badge.earned && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute mt-32 p-2 bg-white rounded shadow-lg text-xs text-gray-700"
        >
          获得于2025-05-10
        </motion.div>
      )}
    </motion.div>
  );
}

function StatsChart({ data }: { data: StatsData }) {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data.weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#FF7043"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function AchievementsPage() {
  const navigate = useNavigate();
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">番茄钟</h1>
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              计时器
            </button>
            <button 
              onClick={() => navigate('/tasks')}
              className="text-gray-600 hover:text-gray-900"
            >
              任务
            </button>
            <button 
              onClick={() => navigate('/achievements')}
              className="text-orange-500 hover:text-orange-600"
            >
              成就
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">学习统计</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Zap className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">完成的番茄钟</p>
                <p className="text-2xl font-bold">{stats.pomodoros}</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">总学习时长</p>
                <p className="text-2xl font-bold">{Math.floor(stats.totalTime / 60)}小时{stats.totalTime % 60}分钟</p>
              </div>
            </div>
          </div>
          <StatsChart data={stats} />
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">徽章墙</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {badges.map(badge => (
              <BadgeItem key={badge.id} badge={badge} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 text-center text-gray-600">
        <p>© 2025 番茄钟应用 - 提升你的学习效率</p>
      </footer>
    </div>
  );
}
