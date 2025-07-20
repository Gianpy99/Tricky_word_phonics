import React from "react";
import type { Screen } from "../App";

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
}

const SimpleSettingsScreen: React.FC<SettingsScreenProps> = ({
  onNavigate,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">
          ⚙️ Impostazioni
        </h1>

        <div className="space-y-6 text-left">
          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Audio</h3>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                className="w-5 h-5 text-blue-500"
                defaultChecked
              />
              <span className="text-gray-600">
                Abilita riconoscimento vocale
              </span>
            </label>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Difficoltà
            </h3>
            <select className="w-full p-3 border rounded-lg">
              <option>Facile</option>
              <option>Medio</option>
              <option>Difficile</option>
            </select>
          </div>

          <div className="border-b pb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              Tempo per parola
            </h3>
            <select className="w-full p-3 border rounded-lg">
              <option>5 secondi</option>
              <option>10 secondi</option>
              <option>15 secondi</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => onNavigate("menu")}
          className="w-full mt-8 bg-gradient-to-r from-gray-400 to-gray-600 text-white font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          ← Torna al Menu
        </button>
      </div>
    </div>
  );
};

export default SimpleSettingsScreen;
