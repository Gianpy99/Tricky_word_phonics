import { useState } from "react";
import SimpleMainMenu from "./components/SimpleMainMenu";
import GameScreen from "./components/GameScreen";
import SimpleSettingsScreen from "./components/SimpleSettingsScreen";
import SimpleStatsScreen from "./components/SimpleStatsScreen";
import ProfileScreen from "./components/ProfileScreen";
import WordListScreen from "./components/WordListScreen";

export type Screen =
  | "menu"
  | "game"
  | "settings"
  | "stats"
  | "profiles"
  | "wordlists";

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("menu");

  console.log("App is rendering, currentScreen:", currentScreen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-5 rounded-full"></div>
      </div>

      <div className="relative z-10">
        {currentScreen === "menu" && (
          <SimpleMainMenu onNavigate={setCurrentScreen} />
        )}
        {currentScreen === "game" && (
          <GameScreen onNavigate={setCurrentScreen} />
        )}
        {currentScreen === "settings" && (
          <SimpleSettingsScreen onNavigate={setCurrentScreen} />
        )}
        {currentScreen === "stats" && (
          <SimpleStatsScreen onNavigate={setCurrentScreen} />
        )}
        {currentScreen === "profiles" && (
          <ProfileScreen onNavigate={setCurrentScreen} />
        )}
        {currentScreen === "wordlists" && (
          <WordListScreen onNavigate={setCurrentScreen} />
        )}
      </div>
    </div>
  );
}

export default App;
