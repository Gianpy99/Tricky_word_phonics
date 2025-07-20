export class SpeechRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isSupported: boolean = false;

  constructor() {
    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.isSupported = true;
      this.setupRecognition();
    }
  }

  private setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.lang = 'en-US'; // You can change this to 'it-IT' for Italian
    this.recognition.maxAlternatives = 1;
  }

  public isRecognitionSupported(): boolean {
    return this.isSupported;
  }

  public startListening(
    onResult: (transcript: string) => void,
    onError?: (error: string) => void,
    onStart?: () => void,
    onEnd?: () => void
  ): void {
    if (!this.recognition || !this.isSupported) {
      onError?.('Speech recognition not supported');
      return;
    }

    this.recognition.onstart = () => {
      onStart?.();
    };

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      onResult(transcript);
    };

    this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      onError?.(`Speech recognition error: ${event.error}`);
    };

    this.recognition.onend = () => {
      onEnd?.();
    };

    try {
      this.recognition.start();
    } catch (error) {
      onError?.('Failed to start speech recognition');
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  public abort(): void {
    if (this.recognition) {
      this.recognition.abort();
    }
  }
}

// Speech evaluation service with Coral TPU integration
export class SpeechEvaluationService {
  private useCoralTPU: boolean = true;
  private backendUrl: string = 'http://localhost:5000';
  private isBackendAvailable: boolean = false;

  constructor() {
    this.checkBackendAvailability();
  }

  private async checkBackendAvailability(): Promise<void> {
    try {
      const response = await fetch(`${this.backendUrl}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (response.ok) {
        const data = await response.json();
        this.isBackendAvailable = true;
        console.log('🤖 Coral TPU Backend available:', data.coral_tpu);
      }
    } catch (error) {
      console.log('⚠️ Coral TPU Backend not available, using fallback');
      this.isBackendAvailable = false;
    }
  }

  public async evaluatePronunciationWithTPU(
    expectedWord: string,
    audioData: string,
    difficulty: string = 'medium'
  ): Promise<{
    isCorrect: boolean;
    score: number;
    feedback: string;
    similarity: number;
    tpuAnalysis?: any;
  }> {
    if (!this.isBackendAvailable || !this.useCoralTPU) {
      return this.fallbackEvaluation(expectedWord, expectedWord);
    }

    try {
      const response = await fetch(`${this.backendUrl}/analyze-speech`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_word: expectedWord,
          audio_data: audioData,
          difficulty: difficulty
        })
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        const analysis = result.analysis;
        return {
          isCorrect: analysis.is_correct,
          score: analysis.accuracy_score,
          feedback: analysis.feedback,
          similarity: analysis.confidence,
          tpuAnalysis: {
            phoneticAnalysis: analysis.phonetic_analysis,
            improvementTips: analysis.improvement_tips,
            audioQuality: analysis.audio_quality,
            processingMethod: analysis.processing_method
          }
        };
      } else {
        throw new Error('Backend analysis failed');
      }
    } catch (error) {
      console.error('🔥 TPU Analysis failed:', error);
      return this.fallbackEvaluation(expectedWord, expectedWord);
    }
  }

  public evaluatePronunciation(
    expectedWord: string, 
    spokenWord: string
  ): { 
    isCorrect: boolean; 
    score: number; 
    feedback: string;
    similarity: number;
  } {
    return this.fallbackEvaluation(expectedWord, spokenWord);
  }

  private fallbackEvaluation(expectedWord: string, spokenWord: string) {
    const expected = expectedWord.toLowerCase().trim();
    const spoken = spokenWord.toLowerCase().trim();

    // Direct match
    if (expected === spoken) {
      return {
        isCorrect: true,
        score: 100,
        feedback: "Perfect! Excellent pronunciation! 🌟",
        similarity: 1.0
      };
    }

    // Calculate similarity using Levenshtein distance
    const similarity = this.calculateSimilarity(expected, spoken);
    
    // Score based on similarity
    const score = Math.round(similarity * 100);
    
    // Determine if it's correct enough (threshold of 0.7)
    const isCorrect = similarity >= 0.7;
    
    let feedback: string;
    if (similarity >= 0.9) {
      feedback = "Almost perfect! Great job! 🎉";
    } else if (similarity >= 0.7) {
      feedback = "Good try! Very close! 👍";
    } else if (similarity >= 0.5) {
      feedback = "Not quite right, but keep trying! 💪";
    } else {
      feedback = "Try again! Listen carefully and repeat. 🔄";
    }

    return {
      isCorrect,
      score,
      feedback,
      similarity
    };
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // insertion
          matrix[j - 1][i] + 1, // deletion
          matrix[j - 1][i - 1] + substitutionCost // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  public generateEncouragement(streak: number): string {
    if (streak === 0) return "Let's get started! 🚀";
    if (streak < 3) return "You're doing great! Keep going! 💪";
    if (streak < 5) return "Fantastic streak! You're on fire! 🔥";
    if (streak < 8) return "Amazing! You're a reading superstar! ⭐";
    if (streak < 10) return "Incredible! Nothing can stop you now! 🏆";
    return "LEGENDARY! You're absolutely amazing! 👑🎉";
  }
}

// Create singleton instances
export const speechRecognition = new SpeechRecognitionService();
export const speechEvaluation = new SpeechEvaluationService();
