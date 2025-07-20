import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Home, RefreshCw, Volume2, Timer, Star, Trophy } from 'lucide-react';
import { useGameStore } from '../store/gameStore';
import { speechRecognition, speechEvaluation } from '../services/speechService';
import type { Screen } from '../App';

interface GameScreenProps {
  onNavigate: (screen: Screen) => void;
}

const GameScreen: React.FC<GameScreenProps> = ({ onNavigate }) => {
  const {
    currentWord,
    score,
    streak,
    isListening,
    feedback,
    startGame,
    nextWord,
    setScore,
    setStreak,
    setFeedback,
    setListening,
    endGame,
    voiceEnabled
  } = useGameStore();

  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameActive, setIsGameActive] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState<{
    isCorrect: boolean;
    score: number;
    feedback: string;
  } | null>(null);

  // Initialize game on component mount
  useEffect(() => {
    startGame();
    setIsGameActive(true);
    setTimeLeft(10);
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isGameActive || !currentWord) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameActive, currentWord]);

  // Text-to-speech for word pronunciation
  const speakWord = () => {
    if (!voiceEnabled || !currentWord) return;
    
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    utterance.volume = 0.8;
    speechSynthesis.speak(utterance);
  };

  const handleTimeUp = () => {
    setCurrentResult({
      isCorrect: false,
      score: 0,
      feedback: "Time's up! Try to be faster next time! ⏰"
    });
    setShowResult(true);
    setIsGameActive(false);
  };

  const handleListening = () => {
    if (!speechRecognition.isRecognitionSupported()) {
      setFeedback("Speech recognition is not supported in your browser 😞");
      return;
    }

    if (isListening) {
      speechRecognition.stopListening();
      setListening(false);
      return;
    }

    setListening(true);
    setFeedback("Listening... Say the word! 👂");

    speechRecognition.startListening(
      (transcript) => {
        handleSpeechResult(transcript);
      },
      (error) => {
        setFeedback(`Error: ${error} 😕`);
        setListening(false);
      },
      () => {
        // onStart
      },
      () => {
        setListening(false);
      }
    );
  };

  const handleSpeechResult = (transcript: string) => {
    if (!currentWord) return;

    const evaluation = speechEvaluation.evaluatePronunciation(
      currentWord.word,
      transcript
    );

    setCurrentResult(evaluation);
    setShowResult(true);
    setIsGameActive(false);
    setListening(false);

    if (evaluation.isCorrect) {
      const newScore = score + Math.max(1, Math.round(evaluation.score / 10));
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
    } else {
      setStreak(0);
    }
  };

  const handleNextWord = () => {
    setShowResult(false);
    setCurrentResult(null);
    setTimeLeft(10);
    setIsGameActive(true);
    setFeedback('');
    nextWord();
  };

  const handlePlayAgain = () => {
    startGame();
    setIsGameActive(true);
    setTimeLeft(10);
    setShowResult(false);
    setCurrentResult(null);
    setFeedback('');
  };

  if (!currentWord) {
    // Game finished
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div 
          className="game-card text-center max-w-md"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-purple-600 mb-4 font-kid">
            Game Complete!
          </h2>
          <div className="text-2xl text-gray-700 mb-6">
            Final Score: <span className="font-bold text-purple-600">{score}</span>
          </div>
          <div className="space-y-3">
            <button
              onClick={handlePlayAgain}
              className="button-success w-full"
            >
              <RefreshCw className="w-6 h-6 mr-2" />
              Play Again
            </button>
            <button
              onClick={() => onNavigate('menu')}
              className="button-primary w-full"
            >
              <Home className="w-6 h-6 mr-2" />
              Main Menu
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => onNavigate('menu')}
          className="bg-white/20 backdrop-blur-sm text-white p-3 rounded-xl hover:bg-white/30 transition-colors"
        >
          <Home className="w-6 h-6" />
        </button>

        <div className="flex gap-4">
          <div className="score-display flex items-center gap-2">
            <Star className="w-6 h-6" />
            {score}
          </div>
          <div className="score-display flex items-center gap-2">
            <Trophy className="w-6 h-6" />
            {streak}
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-2 text-white text-xl mb-2">
          <Timer className="w-6 h-6" />
          <span>{timeLeft}s</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${(timeLeft / 10) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <AnimatePresence mode="wait">
          {!showResult ? (
            <motion.div 
              key="game"
              className="game-card text-center max-w-lg w-full"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
            >
              <h2 className="text-2xl text-gray-600 mb-4">Read this word:</h2>
              
              <div className="word-display mb-8">
                {currentWord.word}
              </div>

              <div className="flex gap-4 justify-center mb-6">
                <button
                  onClick={speakWord}
                  className="bg-blue-500 text-white p-4 rounded-full hover:bg-blue-600 transition-colors"
                  title="Hear pronunciation"
                >
                  <Volume2 className="w-8 h-8" />
                </button>

                <button
                  onClick={handleListening}
                  disabled={!speechRecognition.isRecognitionSupported()}
                  className={`
                    p-4 rounded-full transition-all duration-200 transform
                    ${isListening 
                      ? 'bg-red-500 hover:bg-red-600 pulse-animation' 
                      : 'bg-green-500 hover:bg-green-600 hover:scale-110'
                    }
                    text-white disabled:bg-gray-400 disabled:cursor-not-allowed
                  `}
                  title={isListening ? "Stop listening" : "Start speaking"}
                >
                  {isListening ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                </button>
              </div>

              {feedback && (
                <motion.div 
                  className="text-lg text-gray-600 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {feedback}
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="result"
              className={`game-card text-center max-w-lg w-full ${currentResult?.isCorrect ? 'celebration' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <div className={`text-8xl mb-4`}>
                {currentResult?.isCorrect ? '🎉' : '😅'}
              </div>
              
              <h3 className={`text-3xl font-bold mb-4 ${
                currentResult?.isCorrect ? 'text-green-600' : 'text-orange-600'
              }`}>
                {currentResult?.isCorrect ? 'Correct!' : 'Try Again!'}
              </h3>
              
              <p className="text-xl text-gray-700 mb-6">
                {currentResult?.feedback}
              </p>

              {currentResult?.isCorrect && (
                <div className="text-lg text-purple-600 mb-6">
                  {speechEvaluation.generateEncouragement(streak)}
                </div>
              )}

              <button
                onClick={handleNextWord}
                className={`${currentResult?.isCorrect ? 'button-success' : 'button-warning'} w-full`}
              >
                {currentWord ? 'Next Word' : 'Finish Game'} →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GameScreen;
