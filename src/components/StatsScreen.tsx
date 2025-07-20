import { motion } from 'framer-motion';
import { Home, Trophy, Star, Clock, Target, TrendingUp, Calendar } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { Screen } from '../App';

interface StatsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const StatsScreen: React.FC<StatsScreenProps> = ({ onNavigate }) => {
  const { 
    totalScore, 
    gamesPlayed, 
    bestStreak, 
    sessions 
  } = useGameStore();

  // Calculate additional stats
  const averageScore = gamesPlayed > 0 ? Math.round(totalScore / gamesPlayed) : 0;
  const totalWordsAttempted = sessions.reduce((sum, session) => sum + session.wordsAttempted, 0);
  const totalWordsCorrect = sessions.reduce((sum, session) => sum + session.wordsCorrect, 0);
  const accuracy = totalWordsAttempted > 0 ? Math.round((totalWordsCorrect / totalWordsAttempted) * 100) : 0;
  
  // Recent sessions (last 5)
  const recentSessions = sessions.slice(-5).reverse();

  const statCards = [
    {
      icon: Trophy,
      label: 'Total Score',
      value: totalScore,
      color: 'from-yellow-400 to-orange-500',
      textColor: 'text-white'
    },
    {
      icon: Star,
      label: 'Best Streak',
      value: bestStreak,
      color: 'from-purple-400 to-purple-600',
      textColor: 'text-white'
    },
    {
      icon: Target,
      label: 'Accuracy',
      value: `${accuracy}%`,
      color: 'from-green-400 to-green-600',
      textColor: 'text-white'
    },
    {
      icon: TrendingUp,
      label: 'Avg Score',
      value: averageScore,
      color: 'from-blue-400 to-blue-600',
      textColor: 'text-white'
    }
  ];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex items-center mb-8">
        <button
          onClick={() => onNavigate('menu')}
          className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-white/30 transition-colors mr-4"
        >
          <Home className="w-6 h-6" />
        </button>
        <h1 className="text-4xl font-bold text-white font-kid flex items-center gap-3">
          <Trophy className="w-10 h-10" />
          Your Stats
        </h1>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full">
        {/* Overview Stats */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className={`bg-gradient-to-r ${stat.color} rounded-2xl p-6 text-center shadow-lg`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <IconComponent className={`w-8 h-8 mx-auto mb-2 ${stat.textColor}`} />
                <div className={`text-3xl font-bold mb-1 ${stat.textColor}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${stat.textColor} opacity-90`}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Games Played Overview */}
        <motion.div 
          className="game-card mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📊 Overview
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-purple-600">{gamesPlayed}</div>
              <div className="text-gray-600">Games Played</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">{totalWordsAttempted}</div>
              <div className="text-gray-600">Words Attempted</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{totalWordsCorrect}</div>
              <div className="text-gray-600">Words Correct</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600">
                {sessions.length > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.averageTime, 0) / sessions.length) : 0}s
              </div>
              <div className="text-gray-600">Avg Time/Word</div>
            </div>
          </div>
        </motion.div>

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <motion.div 
            className="game-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Recent Games
            </h2>
            
            <div className="space-y-4">
              {recentSessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {formatDate(session.date)}
                      </span>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(session.difficulty)}`}>
                      {session.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{session.score}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-green-500" />
                      <span>{session.wordsCorrect}/{session.wordsAttempted}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>{Math.round(session.averageTime)}s</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* No Stats Message */}
        {gamesPlayed === 0 && (
          <motion.div 
            className="game-card text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-6xl mb-4">📊</div>
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No Games Yet!</h2>
            <p className="text-gray-500 mb-6">
              Start playing to see your amazing progress here!
            </p>
            <button
              onClick={() => onNavigate('game')}
              className="button-primary"
            >
              <Star className="w-6 h-6 mr-2" />
              Start Your First Game
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StatsScreen;
