import { useState } from 'react';
import { GameProvider } from './store/gameStore';
import MainMenu from './components/MainMenu';
import GameScreen from './components/GameScreen';
import SettingsScreen from './components/SettingsScreen';
import StatsScreen from './components/StatsScreen';

export type Screen = 'menu' | 'game' | 'settings' | 'stats';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');

  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white opacity-5 rounded-full"></div>
        </div>
        
        <div className="relative z-10">
          {currentScreen === 'menu' && <MainMenu onNavigate={setCurrentScreen} />}
          {currentScreen === 'game' && <GameScreen onNavigate={setCurrentScreen} />}
          {currentScreen === 'settings' && <SettingsScreen onNavigate={setCurrentScreen} />}
          {currentScreen === 'stats' && <StatsScreen onNavigate={setCurrentScreen} />}
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
