import React, { useState, useEffect } from "react";
import type { Screen } from "../App";
import {
  loadStats,
  getAccuracy,
  getMostDifficultWords,
  resetStats,
} from "../utils/statsManager";

interface StatsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SimpleStatsScreen: React.FC<StatsScreenProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState(() => loadStats());
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Ricarica le statistiche quando il componente viene montato
  useEffect(() => {
    setStats(loadStats());
  }, []);

  const accuracy = getAccuracy();
  const difficultWords = getMostDifficultWords();

  const handleReset = () => {
    resetStats();
    setStats(loadStats());
    setShowConfirmReset(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          📊 Statistiche Reali
        </h1>

        {stats.totalWordsAttempted === 0 ? (
          <div className="text-gray-600 mb-8">
            <p className="text-xl mb-4">🎮 Nessun dato disponibile</p>
            <p>Gioca almeno una partita per vedere le tue statistiche!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-xl">
                <div className="text-3xl font-bold mb-2">
                  {stats.totalWordsAttempted}
                </div>
                <div className="text-sm opacity-90">Parole Tentate</div>
              </div>

              <div className="bg-gradient-to-br from-green-400 to-green-600 text-white p-6 rounded-xl">
                <div className="text-3xl font-bold mb-2">{accuracy}%</div>
                <div className="text-sm opacity-90">Precisione</div>
              </div>

              <div className="bg-gradient-to-br from-purple-400 to-purple-600 text-white p-6 rounded-xl">
                <div className="text-3xl font-bold mb-2">
                  {stats.bestStreak}
                </div>
                <div className="text-sm opacity-90">Miglior Serie</div>
              </div>

              <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white p-6 rounded-xl">
                <div className="text-3xl font-bold mb-2">
                  {stats.averageTime.toFixed(1)}s
                </div>
                <div className="text-sm opacity-90">Tempo Medio</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-gradient-to-br from-teal-400 to-teal-600 text-white p-6 rounded-xl">
                <div className="text-3xl font-bold mb-2">
                  {stats.gamesPlayed}
                </div>
                <div className="text-sm opacity-90">Giochi Completati</div>
              </div>

              <div className="bg-gradient-to-br from-pink-400 to-pink-600 text-white p-6 rounded-xl">
                <div className="text-3xl font-bold mb-2">
                  {stats.totalWordsCorrect}
                </div>
                <div className="text-sm opacity-90">Parole Corrette</div>
              </div>
            </div>

            {difficultWords.length > 0 && (
              <div className="text-left space-y-4 mb-8">
                <h3 className="text-xl font-semibold text-gray-700">
                  Parole più Difficili
                </h3>
                <div className="space-y-2">
                  {difficultWords.map(
                    ({ word, accuracy: wordAccuracy }, index) => (
                      <div
                        key={word}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-gray-700">
                          {index + 1}. {word}
                        </span>
                        <span
                          className={`font-semibold ${
                            wordAccuracy < 50
                              ? "text-red-600"
                              : wordAccuracy < 75
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {wordAccuracy}%
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            {stats.lastPlayed && (
              <div className="text-sm text-gray-500 mb-6">
                Ultimo gioco:{" "}
                {new Date(stats.lastPlayed).toLocaleDateString("it-IT")}
              </div>
            )}
          </>
        )}

        <div className="space-y-4">
          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              className="w-full bg-gradient-to-r from-red-400 to-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              🗑️ Resetta Statistiche
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-red-600 font-semibold">
                Sei sicuro? Questa azione non può essere annullata!
              </p>
              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-full font-bold hover:bg-red-600 transition-colors"
                >
                  Sì, Resetta
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-600 transition-colors"
                >
                  Annulla
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => onNavigate("menu")}
            className="w-full bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ← Torna al Menu
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleStatsScreen;
