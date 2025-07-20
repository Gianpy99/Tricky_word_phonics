import { SpeechRecognitionService, speechEvaluation } from './speechService';

// Enhanced audio capture service for Coral TPU integration
export class AudioCaptureService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private audioConstraints: MediaStreamConstraints;
  
  constructor() {
    this.audioConstraints = {
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    };
  }

  public async startRecording(): Promise<boolean> {
    try {
      // Request microphone access
      this.stream = await navigator.mediaDevices.getUserMedia(this.audioConstraints);
      
      // Setup MediaRecorder
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm;codecs=opus' // Good compression for web
      });

      this.audioChunks = [];

      // Collect audio data
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start(100); // Collect data every 100ms
      
      console.log('🎤 Audio recording started');
      return true;

    } catch (error) {
      console.error('❌ Error starting audio recording:', error);
      return false;
    }
  }

  public async stopRecording(): Promise<string | null> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = async () => {
        try {
          // Create audio blob
          const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
          
          // Convert to base64 for sending to backend
          const base64Audio = await this.blobToBase64(audioBlob);
          
          // Cleanup
          this.cleanup();
          
          console.log('🎵 Audio recording completed');
          resolve(base64Audio);

        } catch (error) {
          console.error('❌ Error processing audio:', error);
          this.cleanup();
          resolve(null);
        }
      };

      // Stop recording
      this.mediaRecorder.stop();
    });
  }

  public async captureAudioForDuration(durationMs: number = 3000): Promise<string | null> {
    const startSuccess = await this.startRecording();
    if (!startSuccess) return null;

    return new Promise((resolve) => {
      setTimeout(async () => {
        const audioData = await this.stopRecording();
        resolve(audioData);
      }, durationMs);
    });
  }

  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert blob to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  private cleanup() {
    // Stop all tracks
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    // Reset recorder
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  public isRecording(): boolean {
    return this.mediaRecorder?.state === 'recording';
  }

  public async checkMicrophonePermission(): Promise<boolean> {
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return result.state === 'granted';
    } catch (error) {
      console.warn('Permission API not supported, assuming microphone access');
      return true;
    }
  }

  public async testMicrophone(): Promise<{
    available: boolean;
    error?: string;
    audioLevel?: number;
  }> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Test audio level for 1 second
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      
      microphone.connect(analyser);
      analyser.fftSize = 256;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      return new Promise((resolve) => {
        setTimeout(() => {
          analyser.getByteFrequencyData(dataArray);
          const audioLevel = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
          
          // Cleanup
          stream.getTracks().forEach(track => track.stop());
          audioContext.close();
          
          resolve({
            available: true,
            audioLevel: audioLevel
          });
        }, 1000);
      });

    } catch (error) {
      return {
        available: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Enhanced speech recognition service with TPU integration
export class EnhancedSpeechRecognitionService extends SpeechRecognitionService {
  private audioCapture: AudioCaptureService;
  private useTPUBackend: boolean = true;

  constructor() {
    super();
    this.audioCapture = new AudioCaptureService();
  }

  public async startAdvancedListening(
    expectedWord: string,
    difficulty: string,
    onResult: (result: any) => void,
    onError?: (error: string) => void,
    onStart?: () => void,
    onEnd?: () => void
  ): Promise<void> {
    
    if (!await this.audioCapture.checkMicrophonePermission()) {
      onError?.('Microphone permission denied');
      return;
    }

    onStart?.();

    try {
      // Start audio capture
      const recordingStarted = await this.audioCapture.startRecording();
      if (!recordingStarted) {
        throw new Error('Failed to start audio recording');
      }

      // Capture audio for 3 seconds (or until manually stopped)
      const audioData = await this.audioCapture.captureAudioForDuration(3000);
      
      if (!audioData) {
        throw new Error('No audio data captured');
      }

      // Send to TPU backend for analysis
      const analysis = await speechEvaluation.evaluatePronunciationWithTPU(
        expectedWord,
        audioData,
        difficulty
      );

      onResult(analysis);

    } catch (error) {
      console.error('🔥 Advanced speech recognition error:', error);
      onError?.(error instanceof Error ? error.message : 'Speech recognition failed');
    } finally {
      onEnd?.();
    }
  }

  public async stopAdvancedListening(): Promise<void> {
    if (this.audioCapture.isRecording()) {
      await this.audioCapture.stopRecording();
    }
  }

  public async testAudioSetup(): Promise<{
    webSpeechAPI: boolean;
    microphone: boolean;
    audioLevel?: number;
    tpuBackend: boolean;
  }> {
    // Test Web Speech API
    const webSpeechSupported = this.isRecognitionSupported();
    
    // Test microphone
    const micTest = await this.audioCapture.testMicrophone();
    
    // Test TPU backend
    let tpuAvailable = false;
    try {
      const response = await fetch('http://localhost:5000/health');
      tpuAvailable = response.ok;
    } catch (error) {
      tpuAvailable = false;
    }

    return {
      webSpeechAPI: webSpeechSupported,
      microphone: micTest.available,
      audioLevel: micTest.audioLevel,
      tpuBackend: tpuAvailable
    };
  }
}

// Export enhanced services
export const audioCapture = new AudioCaptureService();
export const enhancedSpeechRecognition = new EnhancedSpeechRecognitionService();
