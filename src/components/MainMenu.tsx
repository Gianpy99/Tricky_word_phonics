import { Play, Settings, BarChart3, Trophy, Star, Volume2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import type { Screen } from '../App';

interface MainMenuProps {
  onNavigate: (screen: Screen) => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  const { totalScore, gamesPlayed, bestStreak } = useGameStore();

  const menuItems = [
    {
      icon: Play,
      label: 'Start Game',
      color: 'from-green-400 to-blue-500',
      action: () => onNavigate('game'),
      size: 'large'
    },
    {
      icon: BarChart3,
      label: 'Stats',
      color: 'from-purple-400 to-pink-500',
      action: () => onNavigate('stats'),
      size: 'medium'
    },
    {
      icon: Settings,
      label: 'Settings',
      color: 'from-orange-400 to-red-500',
      action: () => onNavigate('settings'),
      size: 'medium'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* Title */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-6xl font-bold text-white mb-4 font-kid">
          Tricky Words
        </h1>
        <div className="flex items-center justify-center gap-2 text-2xl text-white/90">
          <Volume2 className="w-8 h-8" />
          <span className="font-comic">Reading Adventure</span>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div 
        className="grid grid-cols-3 gap-4 mb-8 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
          <Trophy className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
          <div className="text-white text-lg font-bold">{totalScore}</div>
          <div className="text-white/80 text-sm">Total Score</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
          <Star className="w-8 h-8 text-purple-300 mx-auto mb-2" />
          <div className="text-white text-lg font-bold">{bestStreak}</div>
          <div className="text-white/80 text-sm">Best Streak</div>
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center">
          <Play className="w-8 h-8 text-blue-300 mx-auto mb-2" />
          <div className="text-white text-lg font-bold">{gamesPlayed}</div>
          <div className="text-white/80 text-sm">Games Played</div>
        </div>
      </motion.div>

      {/* Menu Buttons */}
      <div className="space-y-4 w-full max-w-sm">
        {menuItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <motion.button
              key={item.label}
              onClick={item.action}
              className={`
                w-full bg-gradient-to-r ${item.color} text-white font-bold 
                ${item.size === 'large' ? 'py-6 px-8 text-2xl' : 'py-4 px-6 text-xl'} 
                rounded-2xl shadow-lg transform transition-all duration-200 
                hover:scale-105 hover:shadow-xl active:scale-95
                flex items-center justify-center gap-3
              `}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconComponent className={item.size === 'large' ? 'w-8 h-8' : 'w-6 h-6'} />
              {item.label}
            </motion.button>
          );
        })}
      </div>

      {/* Footer */}
      <motion.div 
        className="mt-12 text-center text-white/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p className="text-sm">Have fun learning tricky words! 🌟</p>
      </motion.div>
    </div>
  );
};

export default MainMenu;
