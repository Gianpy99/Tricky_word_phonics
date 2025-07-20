import { motion } from 'framer-motion';
import { Home, Volume2, VolumeX, Music, MusicOff, Settings2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import type { Screen } from '../App';

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate }) => {
  const { 
    difficulty, 
    voiceEnabled, 
    musicEnabled, 
    setDifficulty, 
    toggleVoice, 
    toggleMusic 
  } = useGameStore();

  const difficultyOptions = [
    { 
      value: 'easy' as const, 
      label: 'Easy', 
      description: 'Simple 3-4 letter words',
      color: 'from-green-400 to-green-600'
    },
    { 
      value: 'medium' as const, 
      label: 'Medium', 
      description: 'Common tricky words',
      color: 'from-yellow-400 to-orange-500'
    },
    { 
      value: 'hard' as const, 
      label: 'Hard', 
      description: 'Challenging words',
      color: 'from-red-400 to-red-600'
    }
  ];

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
          <Settings2 className="w-10 h-10" />
          Settings
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
        {/* Difficulty Settings */}
        <motion.div 
          className="game-card w-full mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            🎯 Difficulty Level
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {difficultyOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setDifficulty(option.value)}
                className={`
                  p-4 rounded-xl border-2 transition-all duration-200 transform hover:scale-105
                  ${difficulty === option.value 
                    ? `bg-gradient-to-r ${option.color} text-white border-transparent shadow-lg` 
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="font-bold text-lg mb-1">{option.label}</div>
                <div className={`text-sm ${difficulty === option.value ? 'text-white/90' : 'text-gray-500'}`}>
                  {option.description}
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Audio Settings */}
        <motion.div 
          className="game-card w-full mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            🔊 Audio Settings
          </h2>
          
          <div className="space-y-4">
            {/* Voice Settings */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {voiceEnabled ? <Volume2 className="w-6 h-6 text-blue-500" /> : <VolumeX className="w-6 h-6 text-gray-400" />}
                <div>
                  <div className="font-semibold text-gray-800">Voice Pronunciation</div>
                  <div className="text-sm text-gray-500">Hear word pronunciations</div>
                </div>
              </div>
              <button
                onClick={toggleVoice}
                className={`
                  relative w-14 h-8 rounded-full transition-colors duration-200
                  ${voiceEnabled ? 'bg-blue-500' : 'bg-gray-300'}
                `}
              >
                <div className={`
                  absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200
                  ${voiceEnabled ? 'translate-x-7' : 'translate-x-1'}
                `} />
              </button>
            </div>

            {/* Music Settings */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {musicEnabled ? <Music className="w-6 h-6 text-purple-500" /> : <MusicOff className="w-6 h-6 text-gray-400" />}
                <div>
                  <div className="font-semibold text-gray-800">Background Music</div>
                  <div className="text-sm text-gray-500">Play background sounds</div>
                </div>
              </div>
              <button
                onClick={toggleMusic}
                className={`
                  relative w-14 h-8 rounded-full transition-colors duration-200
                  ${musicEnabled ? 'bg-purple-500' : 'bg-gray-300'}
                `}
              >
                <div className={`
                  absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform duration-200
                  ${musicEnabled ? 'translate-x-7' : 'translate-x-1'}
                `} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Info Section */}
        <motion.div 
          className="game-card w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            ℹ️ About
          </h2>
          <div className="text-gray-600 space-y-2">
            <p>
              <strong>Tricky Words Phonics</strong> helps children practice reading challenging words 
              through voice recognition and AI-powered pronunciation assessment.
            </p>
            <p>
              <strong>How to play:</strong> Listen to the word, then speak it clearly into your microphone. 
              The AI will evaluate your pronunciation and give you feedback!
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Make sure your microphone is enabled for the best experience.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsScreen;
