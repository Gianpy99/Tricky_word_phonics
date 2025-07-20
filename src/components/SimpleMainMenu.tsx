import React from "react";
import type { Screen } from "../App";
import { getCurrentProfile } from "../utils/profileManager";
import { getSelectedWordList } from "../utils/wordListManager";

interface MainMenuProps {
  onNavigate: (screen: Screen) => void;
}

const SimpleMainMenu: React.FC<MainMenuProps> = ({ onNavigate }) => {
  console.log("SimpleMainMenu is rendering");

  const currentProfile = getCurrentProfile();
  const selectedWordList = getSelectedWordList();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          🎯 Tricky Words
        </h1>
        <h2 className="text-2xl font-semibold text-purple-600 mb-4">
          Phonics Game
        </h2>

        {/* Informazioni profilo e lista correnti */}
        <div className="mb-6 p-3 bg-gray-100 rounded-lg text-sm">
          {currentProfile ? (
            <p className="text-gray-700">
              👤 <strong>{currentProfile.name}</strong> {currentProfile.avatar}
            </p>
          ) : (
            <p className="text-red-600">⚠️ Nessun profilo selezionato</p>
          )}

          {selectedWordList ? (
            <p className="text-gray-700 mt-1">
              📚 <strong>{selectedWordList.name}</strong> (
              {selectedWordList.words.length} parole)
            </p>
          ) : (
            <p className="text-red-600 mt-1">
              ⚠️ Nessuna lista di parole selezionata
            </p>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onNavigate("profiles")}
            className="w-full bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            👥 Gestisci Profili
          </button>

          <button
            onClick={() => onNavigate("game")}
            disabled={!currentProfile}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            🎮 Inizia Gioco (UK English)
          </button>

          <button
            onClick={() => onNavigate("wordlists")}
            className="w-full bg-gradient-to-r from-indigo-400 to-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            📚 Liste di Parole
          </button>

          <button
            onClick={() => onNavigate("stats")}
            disabled={!currentProfile}
            className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
          >
            📊 Statistiche
          </button>

          <button
            onClick={() => onNavigate("settings")}
            className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ⚙️ Impostazioni
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-600">
          <p>🇬🇧 Migliora la lettura con UK English!</p>
          <p>🎤 Ascolto automatico e pronuncia britannica</p>
        </div>
      </div>
    </div>
  );
};

export default SimpleMainMenu;
