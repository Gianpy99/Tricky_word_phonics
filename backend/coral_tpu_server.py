# Coral TPU Integration for Speech Recognition
# This Python backend will handle AI-powered speech analysis

import os
import json
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
import librosa

# Try to import TensorFlow and PyCoral (optional for demo mode)
try:
    import tensorflow as tf
    TF_AVAILABLE = True
except ImportError:
    print("⚠️  TensorFlow not available - running in demo mode")
    TF_AVAILABLE = False

try:
    from pycoral.utils import edgetpu
    from pycoral.adapters import common
    from pycoral.adapters import classify
    CORAL_AVAILABLE = True
except ImportError:
    print("⚠️  PyCoral not available - running in demo mode")
    CORAL_AVAILABLE = False

import io
import base64
import wave

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

class CoralTPUSpeechAnalyzer:
    def __init__(self, model_path='models/speech_model_edgetpu.tflite'):
        """Initialize Coral TPU Speech Analyzer"""
        self.model_path = model_path
        self.interpreter = None
        self.input_details = None
        self.output_details = None
        self.load_model()
        
    def load_model(self):
        """Load TensorFlow Lite model on Coral TPU"""
        try:
            print("⚠️  Running in simplified demo mode")
            print("✅ Analyzer initialized in demo mode")
            return

            if not TF_AVAILABLE or not CORAL_AVAILABLE:
                print("⚠️  TensorFlow or PyCoral not available, using demo mode")
                return

            # Initialize Coral TPU
            delegates = []
            try:
                # Try to load Edge TPU delegate
                edgetpu_delegate = tf.lite.experimental.load_delegate('libedgetpu.so.1')
                delegates = [edgetpu_delegate]
                print("🤖 Coral TPU delegate loaded")
            except Exception as e:
                print(f"⚠️  Could not load TPU delegate: {e}")
                print("📱 Falling back to CPU inference")

            self.interpreter = tf.lite.Interpreter(
                model_path=self.model_path,
                experimental_delegates=delegates
            )
            self.interpreter.allocate_tensors()
            
            # Get input and output details
            self.input_details = self.interpreter.get_input_details()
            self.output_details = self.interpreter.get_output_details()
            
            if delegates:
                print(f"✅ Coral TPU model loaded successfully")
            else:
                print(f"✅ CPU model loaded successfully")
            print(f"📥 Input shape: {self.input_details[0]['shape']}")
            print(f"📤 Output shape: {self.output_details[0]['shape']}")
            
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            print(f"📁 Make sure model file exists at: {self.model_path}")
            # Create a dummy model for fallback
            self.interpreter = None
            self.input_details = None
            self.output_details = None

    def preprocess_audio(self, audio_data, target_word):
        """Preprocess audio for the model"""
        try:
            # Convert base64 to audio
            audio_bytes = base64.b64decode(audio_data.split(',')[1])
            
            # Load audio with librosa
            audio, sr = librosa.load(io.BytesIO(audio_bytes), sr=16000)
            
            # Extract features (MFCC)
            mfcc = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=13, n_fft=512, hop_length=160)
            
            # Normalize and reshape for model
            mfcc_normalized = (mfcc - np.mean(mfcc)) / np.std(mfcc)
            
            # Pad or truncate to fixed size (adjust based on your model)
            target_frames = 100
            if mfcc_normalized.shape[1] < target_frames:
                mfcc_padded = np.pad(mfcc_normalized, ((0, 0), (0, target_frames - mfcc_normalized.shape[1])), mode='constant')
            else:
                mfcc_padded = mfcc_normalized[:, :target_frames]
            
            # Reshape for model input [batch_size, features, time_steps, channels]
            input_data = mfcc_padded.reshape(1, 13, target_frames, 1).astype(np.float32)
            
            return input_data, audio, sr
            
        except Exception as e:
            print(f"❌ Error preprocessing audio: {e}")
            return None, None, None

    def analyze_pronunciation(self, audio_data, target_word, difficulty_level="medium"):
        """Analyze pronunciation using demo mode"""
        try:
            print(f"🎯 Analyzing pronunciation of '{target_word}' in demo mode")
            
            # In demo mode, simulate analysis based on word difficulty
            return self.demo_analysis(target_word, difficulty_level)
            
            # Preprocess audio
            input_data, raw_audio, sr = self.preprocess_audio(audio_data, target_word)
            if input_data is None:
                return self.fallback_analysis(target_word)
            
            # Run inference on Coral TPU
            self.interpreter.set_tensor(self.input_details[0]['index'], input_data)
            self.interpreter.invoke()
            
            # Get output
            output_data = self.interpreter.get_tensor(self.output_details[0]['index'])
            
            # Process results (this depends on your specific model)
            confidence_score = float(output_data[0][0])  # Adjust based on model output
            
            # Calculate pronunciation accuracy
            accuracy = min(confidence_score * 100, 100)
            
            # Determine if pronunciation is correct
            threshold = self.get_threshold_by_difficulty(difficulty_level)
            is_correct = accuracy >= threshold
            
            # Generate detailed feedback
            feedback = self.generate_ai_feedback(accuracy, target_word, difficulty_level)
            
            # Additional analysis
            analysis_results = {
                "is_correct": is_correct,
                "accuracy_score": round(accuracy, 1),
                "confidence": round(confidence_score, 3),
                "feedback": feedback,
                "phonetic_analysis": self.phonetic_breakdown(target_word, accuracy),
                "improvement_tips": self.get_improvement_tips(accuracy, target_word),
                "audio_quality": self.assess_audio_quality(raw_audio, sr),
                "processing_method": "coral_tpu"
            }
            
            return analysis_results
            
        except Exception as e:
            print(f"❌ Error in Coral TPU analysis: {e}")
            return self.fallback_analysis(target_word)
    
    def get_threshold_by_difficulty(self, difficulty):
        """Get accuracy threshold based on difficulty level"""
        thresholds = {
            "easy": 70,    # More lenient for easy words
            "medium": 75,  # Standard threshold
            "hard": 80     # Stricter for hard words
        }
        return thresholds.get(difficulty, 75)
    
    def generate_ai_feedback(self, accuracy, word, difficulty):
        """Generate AI-powered feedback based on analysis"""
        if accuracy >= 90:
            return f"🌟 Perfetto! Hai pronunciato '{word}' in modo eccellente!"
        elif accuracy >= 80:
            return f"🎉 Ottimo! Quasi perfetto su '{word}'. Continua così!"
        elif accuracy >= 70:
            return f"👍 Bene! '{word}' è pronunciato abbastanza bene. Prova ancora!"
        elif accuracy >= 60:
            return f"💪 Non male! '{word}' può essere migliorato. Ascolta e riprova!"
        else:
            return f"🔄 Riprova! Ascolta attentamente '{word}' e pronuncia lentamente."
    
    def phonetic_breakdown(self, word, accuracy):
        """Provide phonetic analysis of the word"""
        # This would be enhanced with actual phonetic analysis
        phonetic_map = {
            "the": "/ðə/",
            "was": "/wɒz/",
            "said": "/sed/",
            "school": "/skuːl/",
            "thought": "/θɔːt/"
        }
        
        phonetic = phonetic_map.get(word.lower(), f"/{word}/")
        
        if accuracy >= 80:
            return f"Pronuncia fonetica corretta: {phonetic}"
        else:
            return f"Lavora sulla pronuncia: {phonetic} - Ascolta il suono e ripeti lentamente"
    
    def get_improvement_tips(self, accuracy, word):
        """Get personalized improvement tips"""
        tips = []
        
        if accuracy < 70:
            tips.append("🗣️ Parla più chiaramente e lentamente")
            tips.append("🎧 Ascolta la pronuncia più volte")
        
        if accuracy < 80:
            tips.append("📱 Avvicinati al microfono")
            tips.append("🔄 Ripeti la parola sillaba per sillaba")
        
        if len(word) > 5:
            tips.append("📝 Dividi la parola in parti più piccole")
        
        return tips
    
    def assess_audio_quality(self, audio, sr):
        """Assess audio quality metrics"""
        if audio is None:
            return "unknown"
        
        # Calculate basic audio metrics
        rms_energy = np.sqrt(np.mean(audio**2))
        
        if rms_energy > 0.1:
            return "good"
        elif rms_energy > 0.05:
            return "fair"
        else:
            return "low"
    
    def fallback_analysis(self, target_word):
        """Fallback analysis when TPU fails"""
        return {
            "is_correct": True,
            "accuracy_score": 75.0,
            "confidence": 0.75,
            "feedback": f"⚠️ Analisi base completata per '{target_word}'. Coral TPU non disponibile.",
            "phonetic_analysis": f"Pronuncia la parola '{target_word}' chiaramente",
            "improvement_tips": ["Assicurati che il Coral TPU sia connesso"],
            "audio_quality": "unknown",
            "processing_method": "fallback"
        }
    
    def demo_analysis(self, target_word, difficulty_level="medium"):
        """Simulate analysis for demo purposes"""
        import random
        
        # Simulate realistic accuracy based on word difficulty
        difficulty_scores = {
            "easy": random.uniform(75, 95),
            "medium": random.uniform(65, 85),
            "hard": random.uniform(55, 75)
        }
        
        accuracy = difficulty_scores.get(difficulty_level, random.uniform(60, 80))
        threshold = self.get_threshold_by_difficulty(difficulty_level)
        is_correct = accuracy >= threshold
        
        return {
            "is_correct": is_correct,
            "accuracy_score": round(accuracy, 1),
            "confidence": round(accuracy / 100, 3),
            "feedback": self.generate_ai_feedback(accuracy, target_word, difficulty_level),
            "phonetic_breakdown": self.phonetic_breakdown(target_word, accuracy),
            "improvement_tips": self.get_improvement_tips(target_word, accuracy),
            "timing_analysis": {
                "duration": round(random.uniform(0.8, 2.5), 2),
                "pace_rating": "good" if random.choice([True, False]) else "too_fast"
            },
            "audio_quality": "good",
            "processing_method": "demo_mode"
        }

# Initialize TPU analyzer
speech_analyzer = CoralTPUSpeechAnalyzer()

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "coral_tpu": "available" if speech_analyzer.interpreter else "unavailable",
        "timestamp": str(np.datetime64('now'))
    })

@app.route('/analyze-speech', methods=['POST'])
def analyze_speech():
    """Main endpoint for speech analysis"""
    try:
        data = request.get_json()
        
        # Extract request data
        audio_data = data.get('audio_data')
        target_word = data.get('target_word', '').lower()
        difficulty = data.get('difficulty', 'medium')
        
        if not audio_data or not target_word:
            return jsonify({
                "error": "Missing audio_data or target_word"
            }), 400
        
        # Analyze with Coral TPU
        results = speech_analyzer.analyze_pronunciation(audio_data, target_word, difficulty)
        
        return jsonify({
            "success": True,
            "analysis": results,
            "word": target_word,
            "difficulty": difficulty
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
            "analysis": speech_analyzer.fallback_analysis(target_word)
        }), 500

@app.route('/get-word-list', methods=['GET'])
def get_word_list():
    """Get available words for practice"""
    words_by_difficulty = {
        "easy": ["the", "was", "you", "they", "said", "have", "like", "so", "do", "some"],
        "medium": ["come", "were", "there", "little", "one", "when", "out", "what", "water", "who"],
        "hard": ["school", "called", "looked", "asked", "could", "people", "your", "right", "know", "thought"]
    }
    
    return jsonify({
        "words": words_by_difficulty,
        "total_words": sum(len(words) for words in words_by_difficulty.values())
    })

@app.route('/model-info', methods=['GET'])
def model_info():
    """Get information about the loaded model"""
    if speech_analyzer.interpreter:
        return jsonify({
            "model_loaded": True,
            "input_shape": speech_analyzer.input_details[0]['shape'] if speech_analyzer.input_details else None,
            "output_shape": speech_analyzer.output_details[0]['shape'] if speech_analyzer.output_details else None,
            "model_path": speech_analyzer.model_path
        })
    else:
        return jsonify({
            "model_loaded": False,
            "error": "Model not loaded"
        })

if __name__ == '__main__':
    print("🚀 Starting Coral TPU Speech Analysis Server...")
    print("🌐 Frontend URL: http://localhost:3000")
    print("🔌 Backend URL: http://localhost:5000")
    print("📡 Health Check: http://localhost:5000/health")
    
    # Run Flask server
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        threaded=True
    )
