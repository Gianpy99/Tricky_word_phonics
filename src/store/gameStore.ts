import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TrickyWord {
  id: string;
  word: string;
  difficulty: 'easy' | 'medium' | 'hard';
  pronunciation?: string; // phonetic pronunciation guide
}

export interface GameSession {
  id: string;
  date: Date;
  score: number;
  wordsAttempted: number;
  wordsCorrect: number;
  averageTime: number; // in seconds
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface GameState {
  // Current game
  currentWord: TrickyWord | null;
  currentIndex: number;
  wordList: TrickyWord[];
  score: number;
  streak: number;
  maxStreak: number;
  timeStarted: Date | null;
  isListening: boolean;
  feedback: string;
  
  // Settings
  difficulty: 'easy' | 'medium' | 'hard';
  voiceEnabled: boolean;
  musicEnabled: boolean;
  
  // Stats and history
  totalScore: number;
  gamesPlayed: number;
  bestStreak: number;
  sessions: GameSession[];
  
  // Actions
  startGame: () => void;
  nextWord: () => void;
  setScore: (score: number) => void;
  setStreak: (streak: number) => void;
  setFeedback: (feedback: string) => void;
  setListening: (listening: boolean) => void;
  setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  toggleVoice: () => void;
  toggleMusic: () => void;
  endGame: () => void;
  reset: () => void;
}

// Default tricky words categorized by difficulty
const defaultWords: TrickyWord[] = [
  // Easy words
  { id: '1', word: 'the', difficulty: 'easy' },
  { id: '2', word: 'was', difficulty: 'easy' },
  { id: '3', word: 'you', difficulty: 'easy' },
  { id: '4', word: 'they', difficulty: 'easy' },
  { id: '5', word: 'said', difficulty: 'easy' },
  { id: '6', word: 'have', difficulty: 'easy' },
  { id: '7', word: 'like', difficulty: 'easy' },
  { id: '8', word: 'so', difficulty: 'easy' },
  { id: '9', word: 'do', difficulty: 'easy' },
  { id: '10', word: 'some', difficulty: 'easy' },
  
  // Medium words
  { id: '11', word: 'come', difficulty: 'medium' },
  { id: '12', word: 'were', difficulty: 'medium' },
  { id: '13', word: 'there', difficulty: 'medium' },
  { id: '14', word: 'little', difficulty: 'medium' },
  { id: '15', word: 'one', difficulty: 'medium' },
  { id: '16', word: 'when', difficulty: 'medium' },
  { id: '17', word: 'out', difficulty: 'medium' },
  { id: '18', word: 'what', difficulty: 'medium' },
  { id: '19', word: 'water', difficulty: 'medium' },
  { id: '20', word: 'who', difficulty: 'medium' },
  
  // Hard words
  { id: '21', word: 'school', difficulty: 'hard' },
  { id: '22', word: 'called', difficulty: 'hard' },
  { id: '23', word: 'looked', difficulty: 'hard' },
  { id: '24', word: 'asked', difficulty: 'hard' },
  { id: '25', word: 'could', difficulty: 'hard' },
  { id: '26', word: 'people', difficulty: 'hard' },
  { id: '27', word: 'your', difficulty: 'hard' },
  { id: '28', word: 'right', difficulty: 'hard' },
  { id: '29', word: 'know', difficulty: 'hard' },
  { id: '30', word: 'thought', difficulty: 'hard' },
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentWord: null,
      currentIndex: 0,
      wordList: [],
      score: 0,
      streak: 0,
      maxStreak: 0,
      timeStarted: null,
      isListening: false,
      feedback: '',
      
      // Settings
      difficulty: 'easy',
      voiceEnabled: true,
      musicEnabled: true,
      
      // Stats
      totalScore: 0,
      gamesPlayed: 0,
      bestStreak: 0,
      sessions: [],
      
      // Actions
      startGame: () => {
        const state = get();
        const filteredWords = defaultWords.filter(w => w.difficulty === state.difficulty);
        const shuffledWords = [...filteredWords].sort(() => Math.random() - 0.5);
        
        set({
          wordList: shuffledWords,
          currentIndex: 0,
          currentWord: shuffledWords[0] || null,
          score: 0,
          streak: 0,
          timeStarted: new Date(),
          feedback: ''
        });
      },
      
      nextWord: () => {
        const state = get();
        const nextIndex = state.currentIndex + 1;
        
        if (nextIndex < state.wordList.length) {
          set({
            currentIndex: nextIndex,
            currentWord: state.wordList[nextIndex],
            feedback: ''
          });
        } else {
          // Game complete
          get().endGame();
        }
      },
      
      setScore: (score: number) => set({ score }),
      
      setStreak: (streak: number) => {
        const state = get();
        set({ 
          streak,
          maxStreak: Math.max(streak, state.maxStreak),
          bestStreak: Math.max(streak, state.bestStreak)
        });
      },
      
      setFeedback: (feedback: string) => set({ feedback }),
      
      setListening: (isListening: boolean) => set({ isListening }),
      
      setDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => set({ difficulty }),
      
      toggleVoice: () => set(state => ({ voiceEnabled: !state.voiceEnabled })),
      
      toggleMusic: () => set(state => ({ musicEnabled: !state.musicEnabled })),
      
      endGame: () => {
        const state = get();
        if (!state.timeStarted) return;
        
        const timePlayed = (new Date().getTime() - state.timeStarted.getTime()) / 1000;
        const averageTime = state.wordList.length > 0 ? timePlayed / state.wordList.length : 0;
        
        const session: GameSession = {
          id: Date.now().toString(),
          date: new Date(),
          score: state.score,
          wordsAttempted: state.wordList.length,
          wordsCorrect: state.score, // Assuming score equals correct words
          averageTime,
          difficulty: state.difficulty
        };
        
        set(prevState => ({
          sessions: [...prevState.sessions, session],
          totalScore: prevState.totalScore + state.score,
          gamesPlayed: prevState.gamesPlayed + 1,
          currentWord: null,
          timeStarted: null
        }));
      },
      
      reset: () => set({
        currentWord: null,
        currentIndex: 0,
        wordList: [],
        score: 0,
        streak: 0,
        timeStarted: null,
        feedback: ''
      })
    }),
    {
      name: 'tricky-words-game',
      // Only persist certain fields
      partialize: (state) => ({
        difficulty: state.difficulty,
        voiceEnabled: state.voiceEnabled,
        musicEnabled: state.musicEnabled,
        totalScore: state.totalScore,
        gamesPlayed: state.gamesPlayed,
        bestStreak: state.bestStreak,
        sessions: state.sessions
      })
    }
  )
);

// Provider component for React context
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
