// Configuration for Tricky Words Phonics app
export interface AppConfig {
  // Backend settings
  backend: {
    url: string;
    timeout: number;
    retryAttempts: number;
  };
  
  // TPU settings
  tpu: {
    enabled: boolean;
    fallbackMode: 'web-speech' | 'basic-analysis';
    healthCheckInterval: number;
  };
  
  // Audio settings
  audio: {
    sampleRate: number;
    channels: number;
    maxRecordingTime: number;
    silenceThreshold: number;
  };
  
  // Game settings
  game: {
    defaultDifficulty: 'easy' | 'medium' | 'hard';
    timePerWord: number;
    minAccuracyThreshold: {
      easy: number;
      medium: number;
      hard: number;
    };
  };
  
  // UI settings
  ui: {
    theme: 'light' | 'dark' | 'auto';
    animations: boolean;
    soundEffects: boolean;
    hapticFeedback: boolean;
  };
}

const defaultConfig: AppConfig = {
  backend: {
    url: 'http://localhost:5000',
    timeout: 10000, // 10 seconds
    retryAttempts: 3
  },
  
  tpu: {
    enabled: true,
    fallbackMode: 'web-speech',
    healthCheckInterval: 30000 // 30 seconds
  },
  
  audio: {
    sampleRate: 16000,
    channels: 1,
    maxRecordingTime: 5000, // 5 seconds
    silenceThreshold: 0.01
  },
  
  game: {
    defaultDifficulty: 'easy',
    timePerWord: 10000, // 10 seconds
    minAccuracyThreshold: {
      easy: 70,
      medium: 75,
      hard: 80
    }
  },
  
  ui: {
    theme: 'auto',
    animations: true,
    soundEffects: true,
    hapticFeedback: true
  }
};

// Configuration manager class
export class ConfigManager {
  private config: AppConfig;
  private readonly STORAGE_KEY = 'tricky-words-config';

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultConfig, ...parsed };
      }
    } catch (error) {
      console.warn('Failed to load config from localStorage:', error);
    }
    return { ...defaultConfig };
  }

  public saveConfig(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
    } catch (error) {
      console.error('Failed to save config to localStorage:', error);
    }
  }

  public get(): AppConfig {
    return { ...this.config };
  }

  public update(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  public reset(): void {
    this.config = { ...defaultConfig };
    this.saveConfig();
  }

  // Specific getters for common settings
  public getBackendUrl(): string {
    return this.config.backend.url;
  }

  public isTPUEnabled(): boolean {
    return this.config.tpu.enabled;
  }

  public getAudioSettings() {
    return this.config.audio;
  }

  public getGameSettings() {
    return this.config.game;
  }

  public getUISettings() {
    return this.config.ui;
  }

  // Environment detection
  public static detectEnvironment(): {
    hasNodeJS: boolean;
    hasPython: boolean;
    hasTPU: boolean;
    browserSupportsWebSpeech: boolean;
    browserSupportsMediaRecorder: boolean;
  } {
    return {
      hasNodeJS: typeof process !== 'undefined' && process.versions?.node !== undefined,
      hasPython: false, // Will be updated by backend health check
      hasTPU: false,    // Will be updated by backend health check
      browserSupportsWebSpeech: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
      browserSupportsMediaRecorder: 'MediaRecorder' in window
    };
  }
}

// Singleton instance
export const configManager = new ConfigManager();

// Environment info
export const environment = ConfigManager.detectEnvironment();

// Export default config for reference
export { defaultConfig };
