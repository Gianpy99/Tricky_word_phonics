import React from "react";
import type { Screen } from "../App";

interface GameScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SimpleGameScreen: React.FC<GameScreenProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          🎮 Game Screen
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Qui inizierà il gioco di lettura delle parole difficili!
        </p>

        <div className="space-y-4">
          <button className="w-full bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            🎯 Inizia Lettura
          </button>

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

export default SimpleGameScreen;
