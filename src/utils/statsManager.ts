// Sistema di gestione delle statistiche reali
export interface GameStats {
  totalWordsAttempted: number;
  totalWordsCorrect: number;
  bestStreak: number;
  averageTime: number;
  gamesPlayed: number;
  wordStats: { [word: string]: { attempts: number; correct: number } };
  lastPlayed: string;
}

const STATS_KEY = "tricky_words_stats";

// Inizializza statistiche vuote
const getEmptyStats = (): GameStats => ({
  totalWordsAttempted: 0,
  totalWordsCorrect: 0,
  bestStreak: 0,
  averageTime: 0,
  gamesPlayed: 0,
  wordStats: {},
  lastPlayed: "",
});

// Carica statistiche dal localStorage
export const loadStats = (): GameStats => {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Errore nel caricamento delle statistiche:", error);
  }
  return getEmptyStats();
};

// Salva statistiche nel localStorage
export const saveStats = (stats: GameStats): void => {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Errore nel salvataggio delle statistiche:", error);
  }
};

// Aggiorna statistiche con il risultato di una parola
export const updateWordResult = (
  word: string,
  isCorrect: boolean,
  timeSpent: number
): void => {
  const stats = loadStats();

  // Aggiorna statistiche generali
  stats.totalWordsAttempted++;
  if (isCorrect) {
    stats.totalWordsCorrect++;
  }

  // Aggiorna tempo medio
  const totalTime =
    stats.averageTime * (stats.totalWordsAttempted - 1) + timeSpent;
  stats.averageTime = totalTime / stats.totalWordsAttempted;

  // Aggiorna statistiche per parola specifica
  if (!stats.wordStats[word]) {
    stats.wordStats[word] = { attempts: 0, correct: 0 };
  }
  stats.wordStats[word].attempts++;
  if (isCorrect) {
    stats.wordStats[word].correct++;
  }

  stats.lastPlayed = new Date().toISOString();
  saveStats(stats);
};

// Aggiorna miglior serie
export const updateBestStreak = (streak: number): void => {
  const stats = loadStats();
  if (streak > stats.bestStreak) {
    stats.bestStreak = streak;
    saveStats(stats);
  }
};

// Incrementa numero di giochi completati
export const incrementGamesPlayed = (): void => {
  const stats = loadStats();
  stats.gamesPlayed++;
  saveStats(stats);
};

// Calcola precisione percentuale
export const getAccuracy = (): number => {
  const stats = loadStats();
  if (stats.totalWordsAttempted === 0) return 0;
  return Math.round(
    (stats.totalWordsCorrect / stats.totalWordsAttempted) * 100
  );
};

// Ottieni le 3 parole più difficili
export const getMostDifficultWords = (): Array<{
  word: string;
  accuracy: number;
}> => {
  const stats = loadStats();
  const wordAccuracies = Object.entries(stats.wordStats)
    .filter(([, data]) => data.attempts >= 2) // Solo parole tentate almeno 2 volte
    .map(([word, data]) => ({
      word,
      accuracy: Math.round((data.correct / data.attempts) * 100),
    }))
    .sort((a, b) => a.accuracy - b.accuracy) // Ordina per precisione crescente
    .slice(0, 3); // Prendi le prime 3

  return wordAccuracies;
};

// Reset delle statistiche
export const resetStats = (): void => {
  localStorage.removeItem(STATS_KEY);
};
