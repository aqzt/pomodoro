import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

type TimerState = {
  isRunning: boolean;
  isWorkTime: boolean;
  timeLeft: number;
};

type Settings = {
  workDuration: number;
  breakDuration: number;
};

function SettingsForm({ 
  settings, 
  onChange 
}: { 
  settings: Settings; 
  onChange: (settings: Settings) => void 
}) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSettings.workDuration > 0 && localSettings.breakDuration > 0) {
      onChange(localSettings);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          工作时间 (分钟)
        </label>
        <input
          type="number"
          min="1"
          value={localSettings.workDuration}
          onChange={(e) => 
            setLocalSettings(prev => ({
              ...prev,
              workDuration: parseInt(e.target.value) || 25
            }))
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          休息时间 (分钟)
        </label>
        <input
          type="number"
          min="1"
          value={localSettings.breakDuration}
          onChange={(e) => 
            setLocalSettings(prev => ({
              ...prev,
              breakDuration: parseInt(e.target.value) || 5
            }))
          }
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
      >
        保存设置
      </button>
    </form>
  );
}

export default function TimerPage() {
  const navigate = useNavigate();
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    isWorkTime: true,
    timeLeft: 25 * 60,
  });
  
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    return savedSettings 
      ? JSON.parse(savedSettings) 
      : { workDuration: 25, breakDuration: 5 };
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('pomodoroSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
      setTimer(prev => ({
        ...prev,
        timeLeft: JSON.parse(savedSettings).workDuration * 60
      }));
    }
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    
    if (timer.isRunning && timer.timeLeft > 0) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (timer.timeLeft === 0) {
      setTimer(prev => ({
        isRunning: false,
        isWorkTime: !prev.isWorkTime,
        timeLeft: prev.isWorkTime 
          ? settings.breakDuration * 60 
          : settings.workDuration * 60
      }));
    }

    return () => clearInterval(interval);
  }, [timer.isRunning, timer.timeLeft, settings]);

  const toggleTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    setTimer({
      isRunning: false,
      isWorkTime: true,
      timeLeft: settings.workDuration * 60
    });
  };

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
    localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
    resetTimer();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">番茄钟</h1>
          <div className="flex space-x-4">
            <button 
              onClick={() => navigate('/tasks')}
              className="text-gray-600 hover:text-gray-900"
            >
              任务
            </button>
            <button 
              onClick={() => navigate('/achievements')}
              className="text-gray-600 hover:text-gray-900"
            >
              成就
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4 flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Timer Circle */}
        <div className="flex flex-col items-center">
          <div 
            className={cn(
              "w-64 h-64 rounded-full flex items-center justify-center shadow-lg transition-colors duration-300",
              timer.isWorkTime ? "bg-orange-500" : "bg-green-500"
            )}
          >
            <span className="text-white text-5xl font-bold">
              {formatTime(timer.timeLeft)}
            </span>
          </div>
          
          {/* Controls */}
          <div className="mt-8 flex space-x-4">
            <button
              onClick={toggleTimer}
              className="px-6 py-2 bg-white rounded-md shadow hover:bg-gray-50 transition"
            >
              {timer.isRunning ? '暂停' : '开始'}
            </button>
            <button
              onClick={resetTimer}
              className="px-6 py-2 bg-white rounded-md shadow hover:bg-gray-50 transition"
            >
              重置
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">时间设置</h2>
          <SettingsForm 
            settings={settings} 
            onChange={handleSettingsChange} 
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 p-4 text-center text-gray-600">
        <p>© 2025 番茄钟应用 - 提升你的学习效率</p>
      </footer>
    </div>
  );
}